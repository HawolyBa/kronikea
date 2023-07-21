import { db, auth, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, getDoc, updateDoc, doc, query, collection, where, getDocs, serverTimestamp, orderBy, deleteDoc } from 'firebase/firestore'

export const getLocation = async id => {
  const location = await getDoc(doc(db, 'locations', id))

  if (location.exists()) {

    return {
      data: {
        info: JSON.parse(JSON.stringify({ ...location.data(), id: location.id })),
        locationExists: true,
      }
    }

  } else {
    return {
      data: {
        info: null,
        locationExists: false,
      }
    }
  }
}

export const addLocation = async data => {
  if (auth.currentUser) {
    const imageName = data.name.toLowerCase().split(' ').join('_')

    const location = await addDoc(collection(db, "locations"), {
      ...data,
      authorId: auth.currentUser.uid,
      image: typeof data.image === "string" ? data.image : "",
      createdAt: serverTimestamp(),
    })

    if (typeof data.image === "object") {
      const storageRef = ref(storage, imageName);
      const response = await uploadBytes(storageRef, data.image);
      const url = await getDownloadURL(response.ref);
      updateDoc(doc(db, "locations", location.id), { image: url });
      return {
        data: {
          locId: data.storyId,
        }
      }
    } else {
      return {
        data: {
          locId: data.storyId,
        }
      }
    }
  } else return { error: "unauthorized" }
}

export const editLocation = async (id, data) => {
  const locRef = doc(db, 'locations', id)
  const locSnapshot = await getDoc(locRef)
  if (locSnapshot.exists()) {
    if (auth.currentUser.uid === locSnapshot.data().authorId) {
      if (typeof data.image === "object") {
        const storageRef = ref(storage, `${auth.currentUser.uid}/${id}`);
        const response = await uploadBytes(storageRef, data.image);
        const url = await getDownloadURL(response.ref);
        updateDoc(doc(db, "locations", id), { ...data, image: url });
        return {
          data: {
            message: 'Location updated successfully'
          }
        }
      } else {
        updateDoc(doc(db, "locations", id), { ...data });
        return {
          data: {
            message: 'Location updated successfully'
          }
        }
      }
    } else return { error: "unauthorized" }
  } else return { error: "Location not found" }
}

export const deleteLocation = async id => {
  try {
    deleteDoc(doc(db, 'locations', id))

    return {
      data: {
        message: "Location deleted successfully"
      }
    }
  } catch (err) {
    console.log(err)
    return {
      error: 'Something went wrong'
    }
  }
}

export const getUserLocations = async (id) => {
  const userId = id ? id : auth?.currentUser?.uid;
  const locRef = userId ? query(collection(db, "locations"), where("authorId", "==", userId), orderBy("createdAt", "desc")) : null
  if (locRef && userId) {
    const querySnapshot = await getDocs(locRef);
    let res = [];
    querySnapshot.forEach((doc) => {
      res = [...res, { id: doc.id, ...doc.data() }];
    });
    return JSON.parse(JSON.stringify(res))
  } else return []
};

export const getStoryLocations = async (id) => {
  const locRef = query(collection(db, "locations"), where("storyId", "==", id))

  const querySnapshot = await getDocs(locRef);

  const locations = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return JSON.parse(JSON.stringify(locations))
};

