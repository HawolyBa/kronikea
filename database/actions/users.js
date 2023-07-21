import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc, collection } from 'firebase/firestore'

export const changeProfile = (dispatch, data, id) => {
  const username = data.username.toLowerCase().replace(/\s/g, '')
  const imageName = `${id}_${username}`;
  if (data.image && typeof data.image === 'object') {
    const imageRef = ref(storage, `${id}/${imageName}`);
    uploadBytes(imageRef, data.image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        updateDoc(doc(db, "users", id), { ...data, image: url })
      })
    });
  } else {
    updateDoc(doc(db, "users", id), { ...data })
  }
}

export const report = data => {
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
    uploadBytes(imageRef, data.image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        const added = addDoc(collection(db, "reports"), { ...data, image: url })
        if (added) {
          return {
            data: { message: "Report sent successfully" },
          }
        } else {
          return {
            data: { error: "Something went wrong" },
          }
        }
      })
    });
  }

}