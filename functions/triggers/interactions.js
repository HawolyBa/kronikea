const { db, admin } = require("../utils/admin");

exports.storyLiked = (snapshot) => {
  if (snapshot.data().authorId !== snapshot.data().senderId) {
    return db
      .collection("notifications")
      .doc(`${snapshot.data().senderId}${snapshot.data().storyId}`).set(
        {
          type: "storyLike",
          read: false,
          senderName: snapshot.data().sender,
          storyTitle: snapshot.data().storyTitle,
          userImage: snapshot.data().userImage,
          recipient: snapshot.data().authorId,
          sender: snapshot.data().senderId,
          storyId: snapshot.data().storyId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }
      );
  } else return null
};

exports.characterLiked = (snapshot) => {
  if (snapshot.data().authorId !== snapshot.data().senderId) {
    return db
      .collection("notifications")
      .doc(`${snapshot.data().senderId}${snapshot.data().characterId}`).set(
        {
          type: "characterLike",
          read: false,
          characterName: snapshot.data().characterName,
          senderName: snapshot.data().sender,
          userImage: snapshot.data().userImage,
          recipient: snapshot.data().authorId,
          sender: snapshot.data().senderId,
          characterId: snapshot.data().characterId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        }
      );
  } else return null
};

exports.userFollowed = (snapshot) => {
  const batch = db.batch();
  return db
    .collection("users")
    .doc(snapshot.data().recipient)
    .get()
    .then((doc) => {
      if (doc.exists) {
        batch.set(
          db
            .collection("notifications")
            .doc(`${snapshot.data().senderId}${snapshot.data().recipient}`),
          {
            type: "follow",
            read: false,
            recipient: doc.id,
            senderName: snapshot.data().sender,
            userImage: snapshot.data().userImage,
            sender: snapshot.data().senderId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          }
        );
        return batch.commit();
      }
    });
};

exports.commentPosted = (snapshot) => {
  const batch = db.batch();
  if (snapshot.data().storyId) {
    batch.update(db.collection('stories').doc(snapshot.data().storyId), {
      commentsCount: admin.firestore.FieldValue.increment(1)
    })
    if (!snapshot.data().answer &&
      snapshot.data().userId !== snapshot.data().authorId) {
      batch.set(db.collection("notifications").doc(), {
        read: false,
        type: "comment",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        recipient: snapshot.data().authorId,
        chapterTitle: snapshot.data().chapterTitle,
        answer: snapshot.data().answer,
        senderName: snapshot.data().username,
        userImage: snapshot.data().userImage,
        sender: snapshot.data().userId,
        chapterId: snapshot.data().chapterId,
        storyId: snapshot.data().storyId,
      })
    } else if (snapshot.data().answer) {
      if (snapshot.data().userId !== snapshot.data().authorId) {
        batch.set(db.collection("notifications").doc(), {
          read: false,
          type: "comment",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          recipient: snapshot.data().authorId,
          answer: snapshot.data().answer,
          sender: snapshot.data().userId,
          senderName: snapshot.data().username,
          chapterId: snapshot.data().chapterId,
          storyId: snapshot.data().storyId,
        })
      } else return
    }
    return batch.commit()
  } else if (snapshot.data().characterId) {
    if (snapshot.data().authorId !== snapshot.data().userId) {
      batch.set(db.collection("notifications").doc(`${snapshot.data().userId}${snapshot.data().characterId}`), {
        type: "characterComment",
        read: false,
        userImage: snapshot.data().userImage,
        characterName: snapshot.data().characterName,
        recipient: snapshot.data().authorId,
        sender: snapshot.data().userId,
        senderName: snapshot.data().username,
        characterId: snapshot.data().characterId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })
      return batch.commit()
    } else return
  }
};

exports.commentDeleted = (snapshot) => {
  const batch = db.batch();
  if (snapshot.data().storyId) {
    return db
      .collection("stories")
      .doc(snapshot.data().storyId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          batch.update(db.collection("stories").doc(snapshot.data().storyId), {
            commentsCount: admin.firestore.FieldValue.increment(-1),
          });
        }
        return batch.commit();
      })
  }
};