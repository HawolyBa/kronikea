import { db, storage, auth } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDoc, doc, query, collection, updateDoc, addDoc, serverTimestamp, getDocs, where, orderBy, runTransaction, limit } from 'firebase/firestore'
import { getUserStories, getFavoriteStories } from "./stories";
import { getFavoriteCharacters, getUserCharacters } from "./characters";
import { getUserLocations } from "./locations";


export const getUserInfo = async (id) => {
  if (id) {
    const item = await getDoc(doc(db, 'users', id))
    if (item.exists()) {
      return JSON.parse(JSON.stringify({ ...item.data(), id: id }))
    } else return null
  }
}

export const changeProfile = async (data, id) => {
  const { image, banner, ...remains } = data
  // const username = data.username.toLowerCase().replace(/\s/g, '')
  const imageName = `${id}/avatar`;
  const userRef = await getDoc(doc(db, 'users', id))

  const files = [
    { fileName: imageName, file: image ? image : null },
    { fileName: `${id}/banner`, file: banner ? banner : null }
  ]

  const getUrls = async () => {
    const imagePromises = Array.from(files, (image) => uploadImage(image.file, image.fileName));
    const imageRes = await Promise.all(imagePromises);
    return imageRes;
  }

  if (userRef.exists()) {
    if (!data.image && !data.banner) {
      updateDoc(doc(db, "users", id), { ...remains })
      // form.resetFields()
      return {
        data: { message: 'Profile updated successfully', newData: { ...remains } }
      }
    } else if (!banner || typeof banner !== 'object' && image && typeof image === 'object') {
      const imageRef = ref(storage, imageName);
      const snapshot = await uploadBytes(imageRef, image);
      const url = await getDownloadURL(snapshot.ref);
      if (url) {
        updateDoc(doc(db, "users", id), { ...remains, image: url })
        // form.resetFields()
        return {
          data: { message: 'Profile updated successfully', newData: { ...remains, image: url } }
        }
      } else {
        return { error: 'Changes failed' }
      }
    } else if (!image || typeof image !== 'object' && banner && typeof banner === 'object') {
      const imageRef = ref(storage, `${id}/banner`);
      const snapshot = await uploadBytes(imageRef, banner);
      const url = await getDownloadURL(snapshot.ref);
      if (url) {
        updateDoc(doc(db, "users", id), { ...remains, banner: url })
        // form.resetFields()
        return {
          data: { message: 'Profile updated successfully', newData: { ...remains, banner: url } }
        }
      } else {
        return { error: 'Changes failed' }
      }
    } else if (image && banner && typeof banner === 'object' && typeof image === 'object') {
      const result = await getUrls()
      if (result) {
        updateDoc(doc(db, "users", id), { ...remains, image: result[0], banner: result[1] })
        // form.resetFields()
        return {
          data: { message: 'Profile updated successfully', newData: { ...remains, image: result[0], banner: result[1] } }
        }
      } else {
        return { error: 'Changes failed' }
      }
    } else if (image && typeof image !== 'object' && banner && typeof banner !== 'object') {
      updateDoc(doc(db, "users", id), { ...remains })
      // form.resetFields()
      return {
        data: { message: 'Profile updated successfully', newData: { ...remains } }
      }
    }
  } else return { error: 'User does not exist' }
}

export const uploadImage = async (image, fileName) => {
  const storageRef = ref(storage, fileName);
  const response = await uploadBytes(storageRef, image);
  const url = await getDownloadURL(response.ref);
  return url;
}

export const report = async (data) => {

  const { image, ...remains } = data

  if (data.image && typeof data.image !== 'object') {
    const added = addDoc(collection(db, "reports"), {
      ...data,
      createdAt: serverTimestamp()
    })
    if (added) {
      return {
        data: { message: "Report sent successfully" },
      }
    } else {
      return {
        data: { error: "Something went wrong" },
      }
    }
  } else {
    const imageRef = ref(storage, `${data.plaignant}/report_${data.itemId}`);
    const snapshotRef = await uploadBytes(imageRef, data.image);
    const imageUrl = await getDownloadURL(snapshotRef.ref);
    const added = addDoc(collection(db, "reports"), { ...remains, createdAt: serverTimestamp(), image: imageUrl })
    if (added) {
      return {
        data: { message: "Report sent successfully" },
      }
    } else {
      return {
        data: { error: "Something went wrong" },
      }
    }
  }
}

export const rateComment = async (commentId, type) => {

  if (!auth.currentUser) {
    return {
      error: "You must be logged in"
    }
  } else {
    const comment = await getDoc(doc(db, "comments", commentId))
    const isLiked = await comment.data().likedBy.includes(auth.currentUser.uid);
    const isDisliked = await comment.data().dislikedBy.includes(auth.currentUser.uid);

    if ((type === "like" && isLiked) || (type === "dislike" && isDisliked)) {
      const newData = type === "like" ? {
        likedBy: comment.data().dislikedBy.filter((d) => d !== auth.currentUser.uid)
      } : {
        dislikedBy: comment.data().likedBy.filter((d) => d !== auth.currentUser.uid)
      }
      updateDoc(doc(db, "comments", commentId), newData)
      return {
        data: { message: "You removed your like or dislike" }
      }
    } else {
      const newData = type === "like" ? {
        dislikedBy: isDisliked
          ? comment.data().dislikedBy.filter((d) => d !== auth.currentUser.uid)
          : comment.data().dislikedBy,
        likedBy: [...comment.data().likedBy, auth.currentUser.uid],
      } : {
        likedBy: isLiked
          ? comment.data().likedBy.filter((d) => d !== auth.currentUser.uid)
          : comment.data().likedBy,
        dislikedBy: [...comment.data().dislikedBy, auth.currentUser.uid]
      }
      updateDoc(doc(db, "comments", commentId), newData)
      return {
        data: { message: "You have liked this comment" }
      }
    }
  }
};

export const getFollowers = async (id, type, sender) => {
  const userId = id ? id : auth?.currentUser?.uid;

  const likes = userId ? await getDocs(query(collection(db, "usersLikes"), where(type, "==", userId), orderBy('createdAt', "desc"))) : null

  let result;
  if (userId && likes) {
    let favArr = []
    likes.docs.forEach((doc) => {
      favArr = [...favArr, doc.data()[sender]];
    });

    const users = await favArr.map((user) => getDoc(doc(db, "users", user)))

    result = await Promise.all(users).then((user) => {

      let favUsers = [];
      user.forEach(
        (doc) => {
          favUsers = [...favUsers, {
            id: doc.id,
            banner: doc.data().banner,
            username: doc.data().username,
            createdAt: doc.data().createdAt,
            image: doc.data().image
          }]
        });

      return favUsers;
    })
  } else result = null
  try {
    return result
  } catch (error) {
    return { error: error }
  }
}

export const getProfile = async (id, type, uid) => {
  console.log(id, type, uid)
  const allResults = {
    profile: await getUserInfo(id),
    stories: await getUserStories(id, type, uid),
    locations: await getUserLocations(id),
    characters: await getUserCharacters(id, type, uid),
    favCharacters: await getFavoriteCharacters(id),
    favStories: await getFavoriteStories(id),
    followers: await getFollowers(id, 'recipient', 'senderId'),
    followings: await getFollowers(id, 'senderId', 'recipient')
  }
  console.log(allResults, 'lolo')
  try {
    console.log(id, type, uid)
    if (await getUserInfo(id)) {
      return {
        data: {
          ...JSON.parse(JSON.stringify(allResults)),
          userExists: true,

        }

      }
    } else {
      return {
        data: null,
        userExists: false,
      }
    }
  } catch {
    return {
      error: 'Something went wrong'
    }
  }

}

export const followUser = async (id, username, userImage) => {
  if (auth.currentUser) {
    if (auth.currentUser.emailVerified) {
      const result = await runTransaction(db, async (transaction) => {
        const userRef = await transaction.get(doc(db, "users", id))
        if (userRef.exists()) {
          const isFavorite = userRef.data().likedBy.includes(auth.currentUser.uid)
          if (isFavorite) {
            const likeRef = await getDocs(query(collection(db, "usersLikes"), where("recipient", "==", id), where('senderId', '==', auth.currentUser.uid)))
            likeRef.forEach((like) => transaction.delete(like.ref))
            transaction.update(doc(db, "users", id), {
              likedBy: userRef.data().likedBy.filter((c) => c !== auth.currentUser.uid)
            })
            return {
              data: { message: "You have unfollowed this user" }
            }
          } else {
            transaction.set(doc(collection(db, 'usersLikes')), {
              recipient: id,
              sender: username,
              userImage: userImage,
              senderId: auth.currentUser.uid,
              createdAt: serverTimestamp(),
            })
            transaction.update(doc(db, "users", id), {
              likedBy: [...userRef.data().likedBy, auth.currentUser.uid]
            })
            return {
              data: {
                message: "User has been followed successfully"
              }
            }
          }
        } else {
          return { error: "User does not exist" }
        }
      })
      return result
    } else {
      return {
        error: "You must be verified to follow"
      }
    }
  } else {
    return {
      error: "You must be logged in"
    }
  }
}

export const getNotifications = async id => {
  try {
    let notifications = []
    const notificationsRef = await getDocs(query(collection(db, 'notifications'), where('recipient', '==', id), orderBy('createdAt', 'desc')))

    notificationsRef.docs.forEach(doc => {
      notifications.push({
        ...doc.data(),
        id: doc.id,
      })
    })

    return notifications
  } catch (e) {
    console.log(e)
  }
}

export const getForYouPage = async (subscribedCat) => {
  if (auth.currentUser) {
    let result = {
      stories: [],
      users: [],
      popular: []
    }

    const stories = subscribedCat.length ? await getDocs(query(collection(db, 'stories'), where('public', '==', true), where('categories', 'array-contains-any', subscribedCat), orderBy('createdAt', 'desc'), limit(12))) : []

    const popular = subscribedCat.length ? await getDocs(query(collection(db, 'stories'), where('public', '==', true), where('categories', 'array-contains-any', subscribedCat), orderBy('likesCount', 'desc'), limit(12))) : []

    const followings = await getDocs(query(collection(db, "users"), where("likedBy", "array-contains", auth.currentUser.uid), orderBy('createdAt', "desc"), limit(12)))



    stories.forEach(story => {
      result.stories.push({
        id: story.id,
        ...story.data()
      })
    })

    popular.forEach(story => {
      result.popular.push({
        id: story.id,
        ...story.data()
      })
    })

    const tags = [...new Set([...result.popular.map(s => s.tags), ...new Set(...result.stories.map(s => s.tags))].flat(1))].slice(0, 10)

    followings.forEach(following => {
      result.users.push({
        id: following.id,
        image: following.data().image,
        username: following.data().username,
        banner: following.data().banner
      })
    })

    return {
      data: JSON.parse(JSON.stringify({ ...result, tags }))
    }
  } else {
    return {
      error: 'You need to be logged in'
    }
  }
}

export const sendMessage = async data => {
  try {
    addDoc(collection(db, "messages"), {
      ...data,
      createdAt: serverTimestamp()
    })

    return {
      data: "Message sent successfully"
    }

  } catch (err) {
    console.log(err)
    return {
      error: "Something went wrong"
    }
  }
}

export const sendFeedback = async data => {
  try {
    addDoc(collection(db, "feedback"), {
      ...data,
      createdAt: serverTimestamp()
    })

    return {
      data: "Message sent successfully"
    }

  } catch (err) {
    console.log(err)
    return {
      error: "Something went wrong"
    }
  }
}