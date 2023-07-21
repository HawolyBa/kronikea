const functions = require("firebase-functions");

const usersTriggers = require("./triggers/users");
const storiesTriggers = require("./triggers/stories");
const charactersTriggers = require("./triggers/characters");
const interactionsTriggers = require("./triggers/interactions");

exports.onUserEdited = functions.region('europe-west1').firestore.document("users/{id}").onUpdate(usersTriggers.userUpdated)

exports.onStoryDeleted = functions
  .region("europe-west1")
  .firestore.document("stories/{id}")
  .onDelete(storiesTriggers.storyDeleted);
exports.onStoryUpdated = functions
  .region("europe-west1")
  .firestore.document("stories/{id}")
  .onUpdate(storiesTriggers.storyUpdated);

exports.onChapterCreated = functions
  .region("europe-west1")
  .firestore.document("chapters/{id}")
  .onCreate(storiesTriggers.chapterCreated);
exports.onChapterEdited = functions
  .region("europe-west1")
  .firestore.document("chapters/{id}")
  .onUpdate(storiesTriggers.chapterUpdated);
exports.onChapterDeleted = functions
  .region("europe-west1")
  .firestore.document("chapters/{id}")
  .onDelete(storiesTriggers.chapterDeleted);

exports.onDeleteCharacter = functions
  .region("europe-west1")
  .firestore.document("characters/{id}")
  .onDelete(charactersTriggers.deleteCharacter);

exports.onStoryLiked = functions
  .region("europe-west1")
  .firestore.document("storiesLikes/{id}")
  .onCreate(interactionsTriggers.storyLiked);
exports.onCharacterLiked = functions
  .region("europe-west1")
  .firestore.document("charactersLikes/{id}")
  .onCreate(interactionsTriggers.characterLiked);
exports.onUserFollowed = functions
  .region("europe-west1")
  .firestore.document("usersLikes/{id}")
  .onCreate(interactionsTriggers.userFollowed);
exports.onCommentPosted = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(interactionsTriggers.commentPosted);
exports.onCommentDeleted = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onDelete(interactionsTriggers.commentDeleted);
// exports.onChapterPosed = functions
//   .region("europe-west1")
//   .firestore.document("chapters/{id}")
//   .onCreate(interactionsTriggers.commentPosted);