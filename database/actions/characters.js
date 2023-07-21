import { db, storage } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { getDoc, doc, query, collection, where, getDocs, orderBy, addDoc, serverTimestamp, deleteDoc, updateDoc, runTransaction, limit, or, and } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const auth = getAuth();

export const getCharacter = async (id, uid, type) => {
  const item = await getDoc(doc(db, 'characters', id))
  if (item.exists()) {
    if (type === "show") {
      const relatives = item.data().relativesArr;
      let relQueries = await [];
      relatives.forEach((rel) => {
        relQueries.push(getDoc(doc(db, 'characters', rel)));
      });
      const mainQuery = await getDocs(query(collection(db, "stories"), where("mainCharacters", "array-contains", id)))
      const secondaryQuery = await getDocs(query(collection(db, "stories"), where("secondaryArr", "array-contains", id)))


      const allData = await Promise.all([Promise.all(relQueries), [mainQuery, secondaryQuery]]).then(async (result) => {
        let finalResult = { storyArr: [], relArr: [] }
        result[0].forEach((char) =>
          finalResult.relArr.push({
            image: char.data().image,
            authorId: char.data().authorId,
            firstname: char.data().firstname,
            lastname: char.data().lastname,
            id: char.id,
            public: char.data().public,
            relation: item
              .data()
              .relatives.find((c) => c.character_id === char.id).relation,
          })
        );
        ([result[1][0].docs, result[1][1].docs]).forEach((snapshots) => {
          snapshots.forEach((story) => {
            finalResult.storyArr.push({
              id: story.id,
              title: story.data().title,
              authorName: story.data().authorName,
              authorId: story.data().authorId,
              banner: story.data().banner,
              public: story.data().public,
              likedBy: story.data().likedBy
            });
          })
        })
        return finalResult
      })
      return {
        data: JSON.parse(JSON.stringify({
          character: {
            ...item.data(),
            id: item.id,
            relatives: allData.relArr.filter(
              (r) => {
                if (r.public) {
                  return r
                } else {
                  if (uid === r.authorId) return r
                }
              }
            ),
            stories: allData.storyArr.filter(
              (r) => {
                if (r.public) {
                  return r
                } else {
                  if (uid === r.authorId) return r
                }
              }
            ),
          },
          charaExists: true,
        }))
      }
    } else {
      return {
        data: JSON.parse(JSON.stringify({
          character: { ...item.data(), id: item.id },
          charaExists: true,
        }))
      }
    }
  } else {
    return {
      error: "this character does not exist",
      data: JSON.parse(JSON.stringify({
        character: null,
        charaExists: false,
      }))
    }
  }
}

export const addCharacter = async data => {

  if (auth.currentUser && auth.currentUser.uid) {


    const character = await addDoc(collection(db, "characters"), {
      ...data,
      authorId: auth.currentUser.uid,
      image: typeof data.image === "string" ? data.image : "",
      createdAt: serverTimestamp(),
      likesCount: 0,
      likedBy: [],
      imageCopyright: "",
      public: true,
    })

    if (typeof data.image === "object") {
      const imageName = `${auth.currentUser.uid}/${character.id}`
      const storageRef = ref(storage, imageName);
      const response = await uploadBytes(storageRef, data.image);
      const url = await getDownloadURL(response.ref);
      updateDoc(doc(db, "characters", character.id), { image: url });

      return {
        data: {
          charaId: character.id,
        }
      }
    } else {
      return {
        data: {
          charaId: character.id,
        }
      }
    }
  } else {
    return { error: 'unauthorized' }
  }
}

export const editCharacter = async (id, data) => {
  const charaRef = doc(db, 'characters', id)
  const charaSnapshot = await getDoc(charaRef)
  if (charaSnapshot.exists()) {
    if (auth.currentUser.uid === data.authorId) {
      if (typeof data.image === "object") {
        const storageRef = ref(storage, `${auth.currentUser.uid}/${id}`);
        const response = await uploadBytes(storageRef, data.image);
        const url = await getDownloadURL(response.ref);

        updateDoc(doc(db, "characters", id), { ...data, relativesArr: data.relatives.map((c) => c.character_id), image: url });
        return {
          data: {
            message: 'Character updated successfully'
          }
        }
      } else {
        updateDoc(doc(db, "characters", id), { ...data, relativesArr: data.relatives.map((c) => c.character_id) });
        return {
          data: {
            message: 'Character updated successfully'
          }
        }
      }
    } else return { error: "unauthorized" }
  } else return { error: "Character not found" }
}

export const deleteCharacter = async (id) => {
  try {
    deleteDoc(doc(db, 'characters', id))

    return {
      data: {
        message: "Character deleted successfully"
      }
    }
  } catch (err) {
    console.log(err)
    return {
      error: 'Something went wrong'
    }
  }
}

export const getPopularCharacters = async () => {
  try {
    const charaRef = await getDocs(query(collection(db, "characters"), where("public", "==", true), orderBy("likedBy", "desc"), limit(6)))
    let result = [];
    charaRef.forEach((doc) => result.push({
      id: doc.id,
      firstname: doc.data().firstname,
      lastname: doc.data().lastname,
      authorId: doc.data().authorId,
      authorName: doc.data().authorName,
      createdAt: doc.data().createdAt,
      image: doc.data().image,
      likedBy: doc.data().likedBy
    }));
    result = result.sort((a, b) => b.likedBy.length - a.likedBy.length)
    return {
      data: JSON.parse(JSON.stringify(result))
    }
  } catch (e) {
    console.log(e)
    return { error: "Something went wrong" }
  }
}

export const getAllCharacters = async () => {
  try {
    let result = []
    const charaRef = await getDocs(query(collection(db, 'characters'), where('public', '==', true), orderBy('createdAt', 'asc')))

    charaRef.forEach(chara => {
      result.push({
        ...chara.data(),
        id: chara.id,
      })
    })

    return { data: JSON.parse(JSON.stringify(result)) }
  } catch (e) {
    console.log(e)
  }
}

export const getUserCharacters = async (id, type, uid) => {
  let charaRef;

  if (id === uid) {
    charaRef = query(collection(db, "characters"), and(where("authorId", "==", id), or(where('public', '==', true), where("public", "==", false))), orderBy("createdAt", "desc"));
  } else {
    charaRef = query(collection(db, "characters"), where("public", "==", true), where("authorId", "==", id), orderBy("createdAt", "desc"));
  }

  if (charaRef) {
    const querySnapshot = await getDocs(charaRef);
    let items = [];
    querySnapshot.forEach((doc) => {
      if (doc.exists) {
        if (type === 'show' || type === 'profile') {
          items = [...items, { id: doc.id, ...doc.data() }]
        } else {
          items = [...items, { id: doc.id, firstname: doc.data().firstname, lastname: doc.data().lastname, image: doc.data().image }]
        }
      }
    });
    return type === 'show' || type === 'profile' ? JSON.parse(JSON.stringify(items)) : { data: JSON.parse(JSON.stringify(items)) }

  } else return []
};

export const getFavoriteCharacters = async (id) => {
  const userId = id
  const charaRef = userId ? query(collection(db, "charactersLikes"), where("senderId", "==", userId), orderBy('createdAt', 'desc')) : null
  if (charaRef && userId) {
    const querySnapshot = await getDocs(charaRef);
    let favArr = [];
    querySnapshot.forEach((doc) => {
      favArr = [...favArr, doc.data().characterId];
    })

    const result = await favArr.map(user => getDoc(doc(db, "characters", user)))
    const promises = await Promise.all(result)
    let favCharacters = [];
    promises.forEach(
      (doc) => (favCharacters = [...favCharacters, { id: doc.id, ...doc.data() }].filter(c => c.public))
    );
    return JSON.parse(JSON.stringify(favCharacters.filter(c => c.public)))
  } return []
};

export const getCharacterComments = async (id, type) => {
  const commentsRef = query(collection(db, "comments"), where(type, "==", id), orderBy('createdAt', 'asc'))
  const querySnapshot = await getDocs(commentsRef);
  let comments = [];

  querySnapshot.forEach((c) => comments.push({ ...c.data(), id: c.id }));
  const userComment = auth.currentUser
    ? comments.find((c) => c.userId === auth.currentUser.uid)
    : null;
  comments = auth.currentUser
    ? comments.filter((c) => c.userId !== auth.currentUser.uid)
    : comments;

  return {
    data: JSON.parse(JSON.stringify({
      comments: comments,
      userComment: userComment
    }))
  };
};

export const submitCharacterFeedback = (info, userComment) => {
  const { characterName, ...allInfo } = info;
  if (!auth.currentUser.emailVerified)
    return { error: "You need to verify your email first" }
  if (!info.content) return { error: "You need to write something" }
  if (userComment) return { error: "You have already sent feedback" }

  const addedComment = addDoc(collection(db, "comments"), {
    ...info,
    createdAt: serverTimestamp()
  })

  if (addedComment) {
    return {
      data: {
        message: "Your feedback has been submitted successfully"
      }
    }
  } else {
    console.log('error')
    return {
      error: "Something went wrong"
    }
  }
};

export const deleteCharacterComment = async (id) => {
  await deleteDoc(doc(db, "comments", id))
  return {
    data: {
      message: "Your feedback has been deleted successfully"
    }
  }
};

export const addCharacterToFavorite = async (id, username, userImage, characterName) => {
  if (!auth.currentUser)
    return { error: "You need to be logged in to add a character to your favorites" }
  if (!auth.currentUser.emailVerified)
    return { error: "You need to verify your email first" }


  const result = await runTransaction(db, async (transaction) => {
    const characterRef = await transaction.get(doc(db, "characters", id))
    if (characterRef.exists()) {
      const isLiked = characterRef.data().likedBy.includes(auth.currentUser.uid)

      if (isLiked) {
        const likeRef = await getDocs(query(collection(db, "charactersLikes"), where("characterId", "==", id), where('senderId', '==', auth.currentUser.uid)))
        likeRef.forEach((like) => transaction.delete(like.ref))
        transaction.update(doc(db, "characters", id), {
          likedBy: characterRef.data().likedBy.filter((c) => c !== auth.currentUser.uid)
        })
        return {
          data: {
            message: "Character deleted from your favorites"
          }
        }
      } else {
        transaction.set(doc(collection(db, 'charactersLikes')), {
          sender: username,
          userImage: userImage,
          authorId: characterRef.data().authorId,
          characterName: characterName,
          senderId: auth.currentUser.uid,
          characterId: id,
          createdAt: serverTimestamp(),
        })
        transaction.update(doc(db, "characters", id), {
          likedBy: [...characterRef.data().likedBy, auth.currentUser.uid]
        })
        return {
          data: {
            message: "Character added to your favorites"
          }
        }
      }
    } else {
      return { error: "Character not found" }
    }
  })
  return result

}








  // if (!isLiked) {
  //   batch.set(doc(db, "charactersLikes", id), {
  //     sender: username,
  //     senderId: auth.currentUser.uid,
  //     characterId: id,
  //     createdAt: serverTimestamp(),
  //   })


  //   if (characterRef.exists() && added.id) {
  //     updateDoc(doc(db, "characters", id), {
  //       likedBy: [...characterRef.data().likedBy, auth.currentUser.uid]
  //     })
  //     return {
  //       data: {
  //         message: "Character added to your favorites"
  //       }
  //     }
  //   } else {
  //     return {
  //       error: 'Something went wrong'
  //     }
  //   }
  // } else {
  //   if (characterRef.exists()) {
  //     const likeRef = await getDocs(query(collection(db, "charactersLikes"), where("characterId", "==", id), where('senderId', '==', auth.currentUser.uid)))
  //     console.log(likeRef)
  //     // likeRef.forEach((like) => deleteDoc(doc(db, like)))

  //     // updateDoc(doc(db, "characters", id), {
  //     //   likedBy: characterRef.data().likedBy.filter((c) => c !== auth.currentUser.uid)
  //     // })
  //     return {
  //       data: {
  //         message: "Character deleted from your favorites"
  //       }
  //     }
  //   } else {
  //     return {
  //       error: 'Something went wrong'
  //     }
  //   }
  // }


