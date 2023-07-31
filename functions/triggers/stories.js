const { db, admin } = require("../utils/admin");
const { arr_diff } = require("../utils/validators");

exports.storyDeleted = (snapshot) => {
  const batch = db.batch();

  return db
    .collection("storiesLikes")
    .where("storyId", "==", snapshot.id)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        batch.delete(db.doc(`storiesLikes/${doc.id}`));
      });
      return db
        .collection("chapters")
        .where("storyId", "==", snapshot.id)
        .get();
    })
    .then((data) => {
      data.forEach((doc) => {
        batch.delete(db.doc(`chapters/${doc.id}`));
      });
      return db
        .collection("locations")
        .where("storyId", "==", snapshot.id)
        .get();
    })
    .then((data) => {
      data.forEach((doc) => {
        batch.delete(db.doc(`locations/${doc.id}`));
      });
      return batch.commit();
    })
    .catch((err) => console.log(err));
};

exports.storyUpdated = (change) => {
  const batch = db.batch();
  if (change.before.data().title !== change.after.data().title) {
    return db
      .collection('locations')
      .where("storyId", "==", change.after.id)
      .get()
      .then(docs => {
        docs.forEach((doc) => {
          batch.update(db.collection("locations").doc(doc.id), {
            storyTitle: change.after.data().title,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          });
        });
        return batch.commit();
      })
  } else return
}

exports.chapterCreated = (snapshot) => {
  let storyTitle;
  let visibility;
  let likers = [];
  let doc;
  const batch = db.batch();

  if (snapshot.data().status !== "draft") {
    return db
      .doc(`/stories/${snapshot.data().storyId}`)
      .get()
      .then((storyDoc) => {
        doc = storyDoc;
        likers = doc.data().likedBy;
        storyTitle = doc.data().title;
        visibility = doc.data().public;
        // const main = doc.data().mainCharacters;
        //Liste des ids
        // let secondaryArr = [...doc.data().secondaryArr]
        // //liste des ids+times
        // let secondaryCharacters = [...doc.data().secondaryCharacters];
        // //les persos ssecondaires ajoutés aux chapitres
        // let charInChapter = snapshot.data().characters.filter((c) => !main.includes(c));
        // let newArr = [];

        // charInChapter.forEach((char) => {
        //   const index = secondaryCharacters.findIndex((c) => c.id === char);
        //   if (index !== -1) {
        //     secondaryCharacters[index].times =
        //       secondaryCharacters[index].times + 1;
        //   } else {
        //     secondaryCharacters.push({ id: char, times: 1 });
        //   }
        // });

        // secondaryCharacters =
        //   snapshot.data().status === "published" ? secondaryCharacters : doc.data().secondaryCharacters;

        batch.update(db.collection('stories').doc(doc.id), {
          chaptersCount: admin.firestore.FieldValue.increment(1),
          // secondaryCharacters: secondaryCharacters,
          // secondaryArr: [...new Set(secondaryCharacters.map((c) => c.id))],
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        })
        return likers
      })
      .then(() => {
        if (visibility) {
          likers.forEach((liker) => {
            batch.set(db.collection("notifications").doc(`${snapshot.id}${liker}`), {
              recipient: liker,
              chapterId: snapshot.id,
              type: "newChapter",
              read: false,
              storyId: doc.id,
              banner: doc.data().banner,
              storyTitle: storyTitle,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            })
          });
        }
        return batch.commit()
      })
      .catch((err) => console.log(err));
  } else {
    return null;
  }
};

exports.chapterUpdated = (change) => {
  if ((change.before.data().status === 'published' && change.after.data().characters !== change.before.data().characters) || change.before.data().status === 'draft' && change.after.data().status === 'published' && change.after.status !== 'draft') {
    return db
      .doc(`/stories/${change.after.data().storyId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // Persos du chapitre avant en filtrant les main
          const originArr = change.before
            .data()
            .characters.filter((c) => !doc.data().mainCharacters.includes(c));
          // Persos secondaires dans histoire
          let secondaryCharactersArr = [...doc.data().secondaryCharacters];
          // Persos du chapitre après en filtrant les main
          let charInChapter = change.after
            .data()
            .characters.filter((c) => !doc.data().mainCharacters.includes(c));
          // reste des persos après différence original et new
          let newArr = change.before.data().status === 'published' && change.after.data().status === 'published' ? arr_diff(originArr, charInChapter) : charInChapter;
          // 
          newArr.forEach((char) => {
            // Vérifie s'ils sont déjà dans l'array secondary
            const index = secondaryCharactersArr.findIndex(
              (c) => c.id === char
            );

            if (change.after.data().status === 'published' && change.before.data().status === 'published') {
              // Vérifier si rajouté ou retiré
              if (!originArr.includes(char)) {
                // Char n'existe pas
                if (index === -1) {
                  secondaryCharactersArr.push({ id: char, times: 1 });
                } else {
                  // char existe donc on ajoute time 1
                  secondaryCharactersArr[index].times =
                    secondaryCharactersArr[index].times + 1;
                }
              } else {
                // char retiré donc on enlève time 1
                secondaryCharactersArr[index].times =
                  secondaryCharactersArr[index].times - 1;
              }
            } else if (change.before.data().status === 'draft' && change.after.data().status === 'published') {
              console.log('secondaryCharacters', secondaryCharactersArr)
              if (index === -1) {
                secondaryCharactersArr.push({ id: char, times: 1 });
              } else {
                secondaryCharactersArr[index].times =
                  secondaryCharactersArr[index].times + 1;
              }
            } else return
          });

          secondaryCharactersArr = secondaryCharactersArr.filter(
            (c) => c.times > 0
          );

          secondaryCharactersArr =
            change.after.data().status === "published" ? secondaryCharactersArr : doc.data().secondaryCharacters;
          return db.doc(`/stories/${change.after.data().storyId}`).update({
            // secondaryArr: [...new Set(secondaryCharactersArr.map((c) => c.id))],
            // secondaryCharacters: secondaryCharactersArr,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          });
        } else return
      });
  } else return
};

exports.chapterDeleted = (snapshot) => {
  const batch = db.batch();
  let charactersFromChapter;
  let charactersFromStory;

  return db
    .collection("comments")
    .where("chapterId", "==", snapshot.id)
    .get()
    .then((comments) => {
      comments.forEach((comm) => batch.delete(db.doc(`/comments/${comm.id}`)));
      return db
        .collection("notifications")
        .where("chapterId", "==", snapshot.id)
        .get();
    })
    .then((notif) => {
      notif.forEach((n) => batch.delete(db.doc(`/comments/${n.id}`)));
      return db.collection("stories").doc(snapshot.data().storyId).get();
    })
    .then((story) => {
      let newArr = story.data().secondaryCharacters
      if (snapshot.data().status === "published") {
        charactersFromChapter = snapshot.data().characters;
        charactersFromStory = story.data().secondaryCharacters;
        newArr = charactersFromStory
          .map((c) => {
            if (charactersFromChapter.includes(c.id)) {
              return { ...c, times: c.times - 1 };
            } else {
              return c;
            }
          })
          .filter((c) => c.times > 0);
      }
      batch.update(db.collection("stories").doc(story.id), {
        chaptersCount: admin.firestore.FieldValue.increment(-1),
        // secondaryCharacters: newArr,
        // secondaryArr: newArr.map((c) => c.id),
      });
      return batch.commit();
    })
    .catch((err) => console.log(err));
};