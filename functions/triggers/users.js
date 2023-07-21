const { db, admin } = require("../utils/admin");

exports.userUpdated = (change) => {
  const batch = db.batch();
  const newInfo = {
    userImage: change.after.data().image,
    authorName: change.after.data().username,
  };

  if (
    change.before.data().username !== change.after.data().username ||
    change.before.data().image !== change.after.data().image
  ) {
    return db
      .collection("stories")
      .where("authorId", "==", change.after.id)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          batch.update(db.collection("stories").doc(doc.id), newInfo);
        });
        return db
          .collection("chapters")
          .where("authorId", "==", change.after.id)
          .get();
      })
      .then((chapters) => {
        chapters.forEach((doc) => {
          batch.update(db.collection("chapters").doc(doc.id), newInfo);
        });
        return db
          .collection("characters")
          .where("authorId", "==", change.after.id)
          .get();
      })
      .then((characters) => {
        characters.forEach((doc) => {
          batch.update(db.collection("characters").doc(doc.id), newInfo);
        });
        return db
          .collection("comments")
          .where("userId", "==", change.after.id)
          .get();
      })
      .then((comments) => {
        comments.forEach((doc) => {
          batch.update(db.collection("comments").doc(doc.id), {
            username: change.after.data().username,
            userImage: change.after.data().image,
          });
        });
        return batch.commit();
      })
      .catch((err) => console.log(err));
  }
}