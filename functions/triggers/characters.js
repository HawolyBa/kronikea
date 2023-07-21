const { db } = require("../utils/admin");

exports.deleteCharacter = (snapshot) => {
  const batch = db.batch();

  return db
    .collection("chapters")
    .where("characters", "array-contains", snapshot.id)
    .get()
    .then((docs) => {
      docs.forEach((doc) => {
        batch.update(db.collection("chapters").doc(doc.id), {
          characters: doc.data().characters.filter((c) => c !== snapshot.id),
        });
      });
      return db
        .collection("characters")
        .where("relativesArr", "array-contains", snapshot.id)
        .get();
    })
    .then((characters) => {
      characters.forEach((char) => {
        batch.update(db.collection("characters").doc(char.id), {
          relativesArr: char
            .data()
            .relativesArr.filter((c) => c !== snapshot.id),
          relatives: char
            .data()
            .relatives.filter((c) => c.character_id !== snapshot.id),
        });
      });
      return db
        .collection("charactersLikes")
        .where("characterId", "==", snapshot.id)
        .get();
    })
    .then((likes) => {
      likes.forEach((like) => {
        batch.delete(db.collection("charactersLikes").doc(like.id));
      });
      return db
        .collection("stories")
        .where("mainCharacters", "array-contains", snapshot.id)
        .get();
    })
    .then((stories) => {
      stories.forEach((story) => {
        batch.update(db.collection("stories").doc(story.id), {
          mainCharacters: story
            .data()
            .mainCharacters.filter((m) => m !== snapshot.id),
        });
      });
      return db
        .collection("comments")
        .where("characterId", "==", snapshot.id)
        .get();
    })
    .then((comments) => {
      comments.forEach((comm) =>
        batch.delete(db.collection("comments").doc(comm.id))
      );
      return db
        .collection("notifications")
        .where("characterId", "==", snapshot.id)
        .get();
    })
    .then((notif) => {
      notif.forEach((n) =>
        batch.delete(db.collection("notifications").doc(n.id))
      );
      return batch.commit();
    });
};