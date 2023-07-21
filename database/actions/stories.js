import { db, auth, storage } from "../firebaseConfig";
import { getDoc, doc, query, collection, where, getDocs, orderBy, runTransaction, serverTimestamp, limit, addDoc, updateDoc, onSnapshot, deleteDoc, increment } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getStoryLocations } from "./locations";
import { getUserCharacters } from "./characters";

export const getStory = async (id, uid) => {
  const result = {
    story: await queryStory(id, uid),
    chapters: await queryChapters(id),
    locations: await getStoryLocations(id)
  }
  try {
    if (result.story.error && result.story.error === 'Page not found') {
      return { data: null, storyExists: false }
    } else {
      return { data: result, storyExists: true }
    }
  } catch {

    return { error: "Something went wrong" }
  }
}

export const getStoryOnly = async id => {
  const storyRef = doc(db, 'stories', id)
  const storySnapshot = await getDoc(storyRef)

  if (storySnapshot.exists()) {
    return {
      data: {
        story: JSON.parse(JSON.stringify({ ...storySnapshot.data(), id: storySnapshot.id })),
        storyExists: true
      }
    }
  } else {
    return {
      error: 'Story not found'
    }
  }
}

export const addStory = async data => {
  if (auth.currentUser) {
    const story = await addDoc(collection(db, "stories"), {
      ...data,
      authorId: auth.currentUser.uid,
      banner: typeof data.banner === "string" ? data.banner : "",
      createdAt: serverTimestamp(),
      likesCount: 0,
      likedBy: [],
      imageCopyright: "",
      secondaryCharacters: [],
      featured: false,
      chaptersCount: 0,
      commentsCount: 0,
      views: 0,
      status: "in progress",
      lastUpdated: serverTimestamp(),
    })

    if (typeof data.banner === "object") {
      const storageRef = ref(storage, `${auth.currentUser.uid}/${story.id}`);
      const response = await uploadBytes(storageRef, data.banner);
      const url = await getDownloadURL(response.ref);

      updateDoc(doc(db, "stories", story.id), { banner: url });
      return {
        data: {
          storyId: story.id,
        }
      }
    } else {
      return {
        data: {
          storyId: story.id,
        }
      }
    }
  } else return { error: "unauthorized" }
}

export const editStory = async (id, data) => {

  try {
    const storyRef = doc(db, 'stories', id)
    const storySnapshot = await getDoc(storyRef)
    if (storySnapshot.exists()) {
      if (auth.currentUser.uid === data.authorId) {
        if (typeof data.banner === "object") {
          const storageRef = ref(storage, `${auth.currentUser.uid}/${data.id}`);
          const response = await uploadBytes(storageRef, data.banner);
          const url = await getDownloadURL(response.ref);

          updateDoc(doc(db, "stories", data.id), { ...data, banner: url });
          return {
            data: {
              message: 'Story updated successfully'
            }
          }
        } else {
          updateDoc(doc(db, "stories", id), { ...data });
          return {
            data: {
              message: 'Story updated successfully'
            }
          }
        }
      } else return { error: "unauthorized" }
    } else return { error: "Story not found" }
  } catch (err) {
    console.log(err)
  }
}

export const deleteStory = (id) => {
  try {
    deleteDoc(doc(db, 'stories', id))

    return {
      data: {
        message: "Story deleted successfully"
      }
    }
  } catch (err) {
    return {
      error: 'Something went wrong'
    }
  }
}

const queryStory = async (id, uid) => {
  const result = await runTransaction(db, async (transaction) => {
    const storySnapshot = await transaction.get(doc(db, "stories", id))

    if (storySnapshot.exists()) {

      const main = storySnapshot.data().mainCharacters;
      const secondary = storySnapshot.data().secondaryCharacters;
      const mainQuery = main.map((c) => transaction.get(doc(db, 'characters', c)))
      const secondaryQuery = secondary.map((c) => transaction.get(doc(db, 'characters', c.id)))

      const mainRes = Promise.all(mainQuery);
      const secondaryRes = Promise.all(secondaryQuery);

      const res = await Promise.all([mainRes, secondaryRes]).then((r) => {
        let mainArr = [];
        let secondaryArr = [];
        r[0].forEach((docu) => {
          if (docu.data().public) {
            mainArr = [...mainArr, { ...docu.data(), id: docu.id }];
          } else {
            if (uid === docu.data().authorId) {
              mainArr = [...mainArr, { ...docu.data(), id: docu.id }];
            } else {
              mainArr = [...mainArr, { ...docu.data(), id: docu.id }].filter(chara => chara.public)
            }
          }
        });
        r[1].forEach((docu) => {
          secondaryArr = [...secondaryArr, { ...docu.data(), id: docu.id }];
        });
        return {
          ...storySnapshot.data(),
          id: storySnapshot.id,
          secondaryCharacters: secondaryArr,
          mainCharacters: mainArr,
          mainArr: storySnapshot.data().mainCharacters,
        }
      })
      if ((storySnapshot.data().authorId !== uid) && uid) {
        transaction.update(doc(db, "stories", id), { views: increment(1) })
      }
      return JSON.parse(JSON.stringify(res))
    } else {
      return {
        error: 'Page not found',
      }
    }
  })
  return result
}

export const getAllStories = async () => {
  try {
    let result = []
    const storiesRef = await getDocs(query(collection(db, 'stories'), where('public', '==', true), orderBy('createdAt', 'asc')))

    storiesRef.forEach(story => {
      result.push({
        ...story.data(),
        id: story.id,
      })
    })

    return { data: JSON.parse(JSON.stringify(result)) }
  } catch (e) {
    console.log(e)
  }
}

export const getUserStories = async (id, type, uid) => {
  const storiesRef = query(collection(db, "stories"), where("authorId", "==", id), orderBy("createdAt", "desc"))

  if (storiesRef) {
    const querySnapshot = await getDocs(storiesRef);
    let items = [];
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        if (type === 'show') {
          if (uid === doc.data().authorId) {
            items = [...items, { id: doc.id, ...doc.data() }]
          } else {
            items = [...items, { id: doc.id, ...doc.data() }].filter((s) => id ? s.public : s)
          }
        } else if (type === 'profile') {
          items = [...items, { id: doc.id, ...doc.data() }]
        } else {
          items = [...items, { id: doc.id, title: doc.data().title }]
        }
      }
    });
    return type && type === 'show' || type === 'profile' ? JSON.parse(JSON.stringify(items)) : { data: JSON.parse(JSON.stringify(items)) }
  } else {
    return []
  }
}

export const getFavoriteStories = async (id) => {
  const userId = id ? id : auth?.currentUser?.uid;
  const storiesRef = userId ? query(collection(db, "storiesLikes"), where("senderId", "==", userId), orderBy('createdAt', 'desc')) : null

  if (storiesRef && userId) {
    const querySnapshot = await getDocs(storiesRef);
    let favArr = [];
    querySnapshot.forEach((doc) => {
      favArr = [...favArr, doc.data().storyId];
    })

    const result = await favArr.map(user => getDoc(doc(db, "stories", user)))
    const promises = await Promise.all(result)
    let favStories = [];
    promises.forEach(
      (doc) => (favStories = [...favStories, { id: doc.id, ...doc.data() }])
    );

    return JSON.parse(JSON.stringify(favStories.filter(story => story.public)))

  } else return []
};

export const addStoryToFavorites = async (id, username, userImage, storyTitle) => {
  if (!auth.currentUser)
    return { error: "You need to be logged in to add a story to your favorites" }
  if (!auth.currentUser.emailVerified)
    return { error: "You need to verify your email first" }


  const result = await runTransaction(db, async (transaction) => {
    const storyRef = await transaction.get(doc(db, "stories", id))
    if (storyRef.exists()) {
      const isLiked = storyRef.data().likedBy.includes(auth.currentUser.uid)
      if (isLiked) {
        const likeRef = await getDocs(query(collection(db, "storiesLikes"), where("storyId", "==", id), where('senderId', '==', auth.currentUser.uid)))
        likeRef.forEach((like) => transaction.delete(like.ref))
        transaction.update(doc(db, "stories", id), {
          likedBy: storyRef.data().likedBy.filter((c) => c !== auth.currentUser.uid)
        })
        return {
          data: {
            message: "Story deleted from your favorites"
          }
        }
      } else {
        transaction.set(doc(collection(db, 'storiesLikes')), {
          sender: username,
          userImage: userImage,
          authorId: storyRef.data().authorId,
          senderId: auth.currentUser.uid,
          storyTitle,
          storyId: id,
          createdAt: serverTimestamp(),
        })
        transaction.update(doc(db, "stories", id), {
          likedBy: [...storyRef.data().likedBy, auth.currentUser.uid]
        })
        return {
          data: {
            message: "Story added to your favorites"
          }
        }
      }
    } else {
      return { error: "Story not found" }
    }
  })
  return result
}

export const getFeaturedStories = async () => {
  const storiesRef = await getDocs(query(collection(db, "stories"), where("public", "==", true), where("featured", "==", true), limit(6)))
  let result = [];
  storiesRef.forEach((doc) => result.push({ id: doc.id, ...doc.data() }));
  result = result.sort((a, b) => b.likedBy.length - a.likedBy.length)
  return {
    data: {
      featured: JSON.parse(JSON.stringify(result))
    }
  }
};

export const getPopularStories = async () => {
  try {
    const storiesRef = await getDocs(query(collection(db, "stories"), where("public", "==", true), orderBy("likedBy", "desc"), limit(6)))
    let result = [];
    storiesRef.forEach((doc) => result.push({ id: doc.id, ...doc.data() }));
    return {
      data: JSON.parse(JSON.stringify(result))
    }
  } catch (e) {
    console.log(e)
    return { error: "Something went wrong" }
  }
}

export const getPopularStoriesByCategory = async (cat) => {
  try {
    const storiesRef = await getDocs(query(collection(db, "stories"), where("public", "==", true), where("categories", 'array-contains', cat), orderBy("likedBy", "desc"), limit(4)))
    let result = [];
    storiesRef.forEach((doc) => result.push({ id: doc.id, ...doc.data() }));
    return {
      data: JSON.parse(JSON.stringify(result))
    }
  } catch (e) {
    console.log(e)
    return { error: "Something went wrong" }
  }
}

export const getStoriesByCategory = async (cat) => {
  const storiesQuery = await getDocs(query(collection(db, 'stories'), where("categories", "array-contains", cat)))
  let result = [];
  storiesQuery.forEach((doc) => result.push({ ...doc.data(), id: doc.id }));

  try {
    return JSON.parse(JSON.stringify(result))
  } catch (err) {
    console.log(err)
    return { error: "Something went wrong" }
  }
};

export const getStoriesFromSearch = async (search) => {
  try {
    let result = []
    const storiesRef = await getDocs(query(collection(db, 'stories'), where('public', '==', true), orderBy('createdAt', 'asc')))

    storiesRef.forEach(story => {
      result.push({
        ...story.data(),
        id: story.id,
      })
    })

    return { data: JSON.parse(JSON.stringify(result)) }
  } catch (e) {
    console.log(e)
  }
};

export const getStoriesByTag = async tag => {
  try {
    let result = []
    const storiesRef = await getDocs(query(collection(db, 'stories'), where('public', '==', true), where("tags", 'array-contains', tag), orderBy('createdAt', 'asc')))

    storiesRef.forEach(story => {
      result.push({
        ...story.data(),
        id: story.id,
      })
    })

    return { data: JSON.parse(JSON.stringify(result)) }
  } catch (e) {
    console.log(e)
  }
}

// CHAPTERS

export const getChapter = async (id, storyId, type) => {
  const chapterRef = await getDoc(doc(db, 'chapters', id))
  const storyRef = await getDoc(doc(db, 'stories', storyId))
  let characters = [];
  let locations = [];
  let charaQuery = [];
  let locQuery = [];

  if (chapterRef.exists() && storyRef.exists() && chapterRef.data().storyId === storyId) {
    if (type === "show") {
      const charactersInChaper = chapterRef.data().characters;
      const locationsInChaper = chapterRef.data().locations;
      const chapNumber = chapterRef.data().number;
      const prevChap = getDocs(query(collection(db, 'chapters'), where('number', '==', chapNumber - 1), where('storyId', '==', storyId)))

      const nextChap = getDocs(query(collection(db, 'chapters'), where('number', '==', chapNumber + 1), where('storyId', '==', storyId)))
      charactersInChaper.forEach((char) => {
        charaQuery.push(getDoc(doc(db, 'characters', char)));
      });
      locationsInChaper.forEach((loc) => {
        locQuery.push(getDoc(doc(db, 'locations', loc)));
      });
      charaQuery = await Promise.all(charaQuery);
      locQuery = await Promise.all(locQuery);

      const result = Promise.all([charaQuery, locQuery, prevChap, nextChap]).then(
        (res) => {
          let prev = res[2].docs[0] && res[2].docs[0].data().status === 'published' ? res[2].docs[0].id : null;
          let next = res[3].docs[0] && res[3].docs[0].data().status === 'published' ? res[3].docs[0].id : null;

          res[0].forEach((c) => {
            characters.push({ ...c.data(), id: c.id });
          });
          res[1].forEach((l) => {
            locations.push({ ...l.data(), id: l.id });
          });
          return {
            data: JSON.parse(JSON.stringify({
              ...chapterRef.data(),
              id: chapterRef.id,
              prev,
              next,
              locations,
              characters,
              userImage: storyRef.data().userImage,
              likedBy: storyRef.data().likedBy,
              public: storyRef.data().public,
              storyTitle: storyRef.data().title,
              image: storyRef.data().banner,
            })),
            storyExists: true
          }
        }
      );
      return result
    } else {
      return {
        data: JSON.parse(JSON.stringify({
          ...chapterRef.data(),
          id: chap.id,
          public: storyRef.data().public,
        })),
        storyExists: true
      }
    }
  } else {
    return { data: null, storyExists: false }
  }
};

const queryChapters = async id => {
  let arr = [];
  const chaptersRef = query(collection(db, "chapters"), where("storyId", "==", id), orderBy('createdAt', 'asc'))
  const querySnapshot = await getDocs(chaptersRef);

  querySnapshot.forEach(item => {
    arr.push({
      authorId: item.data().authorId,
      id: item.id,
      numberOnly: item.data().numberOnly,
      createdAt: item.data().createdAt,
      number: item.data().number,
      title: item.data().title,
      commentsCount: item.data().commentsCount,
      status: item.data().status,
    });
  })

  return JSON.parse(JSON.stringify(arr))
};

export const getChapterInfo = async (storyId, type, chapterId) => {
  const storyRef = await getDoc(doc(db, 'stories', storyId))
  const characters = await getUserCharacters(auth.currentUser.uid, "show", auth.currentUser.uid)
  const locations = await getStoryLocations(storyId)

  if (storyRef.exists()) {
    if (auth.currentUser.uid === storyRef.data().authorId) {
      if (type === 'edit') {
        const chapterRef = await getDoc(doc(db, 'chapters', chapterId))
        if (chapterRef.exists() && chapterRef.data().storyId === storyId) {
          return {
            data: {
              info: JSON.parse(JSON.stringify({
                ...chapterRef.data(),
                id: chapterRef,
                storyTitle: storyRef.data().title,
                storyId: storyRef.id,
                userLocations: locations,
                userCharacters: characters
              })),
              storyExists: true
            }
          }
        } else {
          return {
            error: {
              messge: 'Story not found',
              storyExists: false
            }
          }
        }
      } else {
        return {
          data: {
            info: JSON.parse(JSON.stringify({
              storyTitle: storyRef.data().title,
              storyId: storyRef.id,
              userLocations: locations,
              userCharacters: characters
            })),
            storyExists: true
          }
        }
      }
    } else {
      return {
        error: {
          messge: 'unauthorized',
          storyExists: true
        }
      }
    }
  } else {
    return {
      error: {
        messge: 'Story not found',
        storyExists: false
      }
    }
  }
}

export const addChapter = async (data) => {

  const chaptersRef = await getDocs(query(collection(db, 'chapters'), where("storyId", "==", data.storyId)))

  let numberUsed = [];

  chaptersRef.forEach((chapter) => {
    numberUsed.push(chapter.data().number);
  });

  if (numberUsed.includes(data.number)) {
    return {
      error: `You already have a chapter numbered: ${data.number}`
    }
  } else {
    const chapter = await addDoc(collection(db, 'chapters'), {
      ...data,
      authorId: auth.currentUser.uid,
      commentsCount: 0,
      note: 0,
      voters: [],
      votesCount: 0,
      createdAt: serverTimestamp()
    })
    return {
      data: {
        chapid: chapter.id,
        message: 'Draft created successfully'
      }
    }
  }
};

export const editChapter = async (id, data) => {
  const chaptersRef = await getDocs(query(collection(db, 'chapters'), where("storyId", "==", data.storyId)))
  let numberUsed = [];

  const remain = chaptersRef.docs.filter(c => c.id !== id)
  remain.forEach((chapter) => {
    numberUsed.push(chapter.data().number);
  });

  if (numberUsed.includes(data.number)) {
    return {
      error: `You already have a chapter numbered: ${data.number}`
    }
  } else {
    updateDoc(doc(db, 'chapters', id), { ...data })
    return {
      data: {
        message: "Chapter edited successfully"
      }
    }
  }

}

export const deleteChapter = (id) => {

  try {
    deleteDoc(doc(db, 'chapters', id))

    return {
      data: {
        message: "Chapter deleted successfully"
      }
    }
  } catch (err) {
    console.log(err)
    return {
      error: 'Something went wrong'
    }
  }
}

export const getComments = async (id) => {
  const commentsRef = query(collection(db, "comments"), where("chapterId", "==", id), orderBy('createdAt', 'asc'))
  const querySnapshot = await getDocs(commentsRef);
  let comments = [];

  querySnapshot.forEach((comment) => (
    comments.push({
      ...comment.data(),
      id: comment.id,
    })
  ));

  try {
    return {
      data: JSON.parse(JSON.stringify(comments))
    }
  } catch {
    return { error: "Something went wrong" }
  }
};

export const getCommentsSnapshot = async (id, updateCachedData, cacheDataLoaded, cacheEntryRemoved) => {
  let unsubscribe = () => { };
  let comments = [];
  try {
    await cacheDataLoaded;
    const commentsRef = query(
      collection(db, "comments"),
      where("chapterId", "==", id)
    );
    unsubscribe = onSnapshot(commentsRef, (snapshot) => {
      comments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      updateCachedData((draft) => {
        // or whatever you want to do
        draft.push(JSON.parse(JSON.stringify(comments)));
      });
    });
  } catch { }
  await cacheEntryRemoved;
  unsubscribe();
}

export const submitComment = async data => {
  if (!auth.currentUser.emailVerified)
    return { error: "You need to verify your email first" }
  if (!data.content) return { error: "Content must not be empty" }

  await addDoc(collection(db, 'comments'), {
    ...data,
    userDeleted: false,
    suspended: false,
    createdAt: serverTimestamp(),
  })

  try {
    return {
      data: {
        message: "Comment posted successfully"
      }
    }
  } catch {
    return {
      error: err.message
    }
  }
};

// CATEGORIES

export const subscribeToCategory = async (cat) => {
  if (auth.currentUser) {
    const result = await runTransaction(db, async (transaction) => {
      const user = await transaction.get(doc(db, 'users', auth.currentUser.uid))
      const subscribedCat = user.data().subscribedCat || []
      if (subscribedCat.includes(cat)) {
        transaction.update(doc(db, 'users', auth.currentUser.uid), {
          subscribedCat: subscribedCat.filter(c => c !== cat)
        })
        return {
          data: {
            message: "Category removed from your favorites"
          }
        }
      } else {
        transaction.update(doc(db, 'users', auth.currentUser.uid), {
          subscribedCat: [...subscribedCat, cat]
        })
        return {
          data: {
            message: "Category added to your favorites"
          }
        }
      }
    })
    return result
  } else {
    return {
      error: "You need to be logged in to subscribe"
    }
  }
}