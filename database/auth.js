import React, { useState, useEffect, useContext, createContext, useRef } from "react";
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { auth, db, provider } from "./firebaseConfig";
import { doc, setDoc, serverTimestamp, getDoc, onSnapshot, writeBatch, getDocs, where, query, collection } from 'firebase/firestore'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, signInWithPopup, sendEmailVerification, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail, deleteUser, linkWithCredential, reauthenticateWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useTranslation } from "next-i18next";
import { message } from 'antd'

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const mounted = useRef(false);
  const { t } = useTranslation();
  const { pathname } = useRouter()
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({
    password: "",
    email: "",
    username: "",
  });
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    mounted.current = true;
    return () => mounted.current = false;
  }, [])
  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        setErrors({ password: "", email: "", username: "" });
        setUser(response.user);
        return response.user;
      })
      .catch((err) => {
        if (err.code === "auth/wrong-password") {
          setErrors({ ...errors, password: t('auth:wrong-password') });
        } else if (err.code === "auth/user-not-found") {
          setErrors({ ...errors, email: t('auth:user-not-found') });
        }
      })
      .finally(() => mounted.current && setIsLoading(false))
  };

  const signInWithGoogle = () => {
    return signInWithPopup(getAuth(), provider)
      .then(async (response) => {
        setUser(response.user);
        const userRef = await getDoc(doc(db, 'users', response.user.uid))
        if (userRef.exists()) {
          return
        } else {
          return await setDoc(doc(db, "users", response.user.uid), {
            username: response.user.displayName,
            banner: '',
            likesCount: 0,
            privateLikes: false,
            twitter: "",
            facebook: "",
            instagram: "",
            deviantart: "",
            biography: "",
            badges: [],
            likedBy: [],
            subscribedCat: [],
            createdAt: serverTimestamp(),
            image: response.user.photoURL,
            suspended: false,
          })
        }
      })
      .catch((err) => console.log(err.message))
      .finally(() => mounted.current && setIsLoading(false))
  };

  const signup = (email, password, username) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (response) => {
        await sendEmailVerification(response.user);
        message.success(t('auth:signup-success'));
        setErrors({
          password: "",
          email: "",
          username: "",
        });
        setUser({ ...response.user, username: username });
        return await setDoc(doc(db, "users", response.user.uid), {
          username,
          privateLikes: false,
          banner: '',
          likesCount: 0,
          subscribedCat: [],
          twitter: "",
          facebook: "",
          instagram: "",
          deviantart: "",
          biography: "",
          badges: [],
          likedBy: [],
          createdAt: serverTimestamp(),
          image: "",
          suspended: false,
        })
      }).then(() => {
        message.success(t('auth:signup-success'));
      })
      .catch((err) => {
        if (err.code === "auth/email-already-in-use") {
          setErrors({ ...errors, email: t('auth:email-already-in-use') })
        } else if (err.code === "auth/invalid-email") {
          setErrors({ ...errors, email: t('auth:invalid-email') })
        } else if (err.code === "auth/weak-password") {
          setErrors({ ...errors, password: t('auth:weak-password') });
        }
      })
      .finally(() => mounted.current && setIsLoading(false))
  };

  const signout = () => {
    return auth.signOut().then(() => {
      setUser(false);
    });
  };

  const isGoogleOnly = auth.currentUser && auth.currentUser.providerData.map(data => data.providerId).includes("google.com") && auth.currentUser.providerData.length === 1;

  const resetEmail = (email) => {
    return sendPasswordResetEmail(auth, email, { url: "http://https://kronikea.vercel.app/auth" })
      .then(() => {
        setErrors({ ...errors, email: "" })
        return true
      })
      .catch((err) => {
        if (err.code === "auth/invalid-email") {
          setErrors({ ...errors, email: t('auth:invalid-email') })
        } else if (err.code === "auth/user-not-found") {
          setErrors({ ...errors, email: t('auth:user-not-found') })
        }
        return false
      })
  };

  // const confirmPasswordReset = (code, password) => {
  //   return auth.confirmPasswordReset(code, password).then(() => {
  //     return true;
  //   });
  // };

  // const changeUsername = (username) => {
  //   return db
  //     .collection("users")
  //     .doc(auth.currentUser.uid)
  //     .update({ username });
  // };

  const changePassword = async (oldPassword, newPassword) => {
    const user = getAuth().currentUser
    const credential = await EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential)
      .then((cred) => {
        // Mettre à jour le mot de passe de l'utilisateur
        return updatePassword(user, newPassword)
          .then(() => {
            setErrors({ ...errors, password: "" })
            setSuccess(true)
          })
          .catch((error) => {
            setSuccess(false)
            message.error(t('auth:change-password-error'));
          });
      })
      .catch((error) => {
        setSuccess(false)
        setErrors({ ...errors, password: t('auth:wrong-password') });
        message.error(t('auth:change-password-error'));
      });
  }

  const verifyEmail = async () => {
    await sendEmailVerification(auth.currentUser)
    message.info("Verification Email sent. Check your inbox !");
  };

  const deleteAccount = async (password) => {
    const batch = writeBatch(db);
    let id = auth.currentUser.uid;
    const credential = await EmailAuthProvider.credential(auth.currentUser.email, password);
    await reauthenticateWithCredential(auth.currentUser, credential)
      .then(async () => {
        return await deleteUser(auth.currentUser)
      })
      .then(async () => {
        const user = doc(db, 'users', id)
        const stories = await getDocs(query(collection(db, 'stories'), where('authorId', '==', id)));
        const characters = await getDocs(query(collection(db, 'characters'), where('authorId', '==', id)));
        const follows = await getDocs(query(collection(db, 'usersLikes'), where('recipient', '==', id)));
        const followings = await getDocs(query(collection(db, 'usersLikes'), where('sender', '==', id)));
        const notifications = await getDocs(query(collection(db, 'notifications'), where('recipient', '==', id)));
        const comments = await getDocs(query(collection(db, 'comments'), where('userId', '==', id)));

        batch.delete(user);
        stories.docs.forEach(async (item) => batch.delete(item.ref))
        characters.docs.forEach(async (item) => batch.delete(item.ref))
        follows.docs.forEach(async (item) => batch.delete(item.ref))
        followings.docs.forEach(async (item) => batch.delete(item.ref))
        notifications.docs.forEach(async (item) => batch.delete(item.ref))
        comments.docs.forEach(async (item) => batch.delete(item.ref))

        return batch.commit()
      })
      .catch(err => {
        console.log(err)
        if (err.code === "auth/wrong-password") {
          setErrors({ ...errors, password: t('auth:wrong-password') })
        }
      })
  };

  const setupPassword = async (password) => {
    if (auth.currentUser.providerData.some((provider) => provider.providerId === 'password')) {
      setErrors({ ...errors, password: "Error" })
      return
    } else {
      if (!password) {
        setErrors({ ...errors, password: t('auth:error-password') })
        return;
      }
      const provider = new GoogleAuthProvider()
      reauthenticateWithPopup(auth.currentUser, provider).then(async () => {
        const credential = await EmailAuthProvider.credential(auth.currentUser.email, password);
        await linkWithCredential(auth.currentUser, credential)
          .then(() => {
            setSuccess(true)
            setErrors({ ...errors, password: '' })
          }).catch((err) => {
            setSuccess(false)
            setErrors({ ...errors, password: 'Something went wrong' })
          })
      })

    }
  }

  useEffect(() => {
    setErrors({
      password: "",
      email: "",
      username: "",
    })
  }, [pathname])

  useEffect(() => {
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        // const token = await user.getIdToken();
        // nookies.set(null, "token", token, {
        //   path: "/",
        //   encode: (v) => v,
        // })
        // const echoEndpoint = "https://jwtecho.pixegami.io"
        // const certStr = `1e973ee0e16f7eef4f921d50dc61d70b2efefc19": "-----BEGIN CERTIFICATE-----\nMIIDHTCCAgWgAwIBAgIJAL5KzAr9wmGHMA0GCSqGSIb3DQEBBQUAMDExLzAtBgNV\nBAMMJnNlY3VyZXRva2VuLnN5c3RlbS5nc2VydmljZWFjY291bnQuY29tMB4XDTIz\nMDMxMTA5MzkyMloXDTIzMDMyNzIxNTQyMlowMTEvMC0GA1UEAwwmc2VjdXJldG9r\nZW4uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wggEiMA0GCSqGSIb3DQEBAQUA\nA4IBDwAwggEKAoIBAQDB7l9kjFO2Qx9d+89V39UyIqalRJddcWn3kqgS8FZ4QkX5\nwL/aAMYa5rgURga51H0Q8Zm9Z+eLmGCothdaEu225md9JMYCW7PdLr6g5Ojigfnp\nslH0XoIgbPU1hSRCcyz5CzgBFWjhA8+j6q7ms5Annii6JV887aIAoKeE5IKrA+v9\ngXzC2rxcpjW8cVQORQOVSF3qKq635ynC2IrbMUE1iOPFthS7ONKkyhvYT+uAGiX0\nhtVoEkUf2k9EG1jPj/LQ2xlo/KGJcHdIFMlGgnCZahdhOVWBtcZ1hX/7TqeJwYo9\naHN/nIDQiayj6qy+V8lRVV7+5YZTGGstsOYe8o5vAgMBAAGjODA2MAwGA1UdEwEB\n/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1UdJQEB/wQMMAoGCCsGAQUFBwMCMA0G\nCSqGSIb3DQEBBQUAA4IBAQBfnJjCwrBa7za107xZS3LD/fIfXuOFpuQirKlOJkLE\nUGbyF7dBDykoSDPe7s5xfUZtFnvu3xVfiFGkyA9lIs6dWw/Di9UdLLgfm2E+9vzH\n9XfU421zVMAQpO9AiMw3h5l2OZHk/+ae81OcyFlq1SphIVJOqwBNj8841RT6Ui9i\n8i//jLqMDx2i91lDBwHGNrXxaAMWD6dm8On9nKhEYs8dze2ge87P0P8nFEYDJUNQ\nFbA4TrqjbNtC3XuZHZpsUolKVs+q2+PavnMj/RRQegtLp9jTZq4M6iifrnqNbte9\nzbCArdgqFZyJKAvAnQlQ+XVNMf4bo/5Y55kMUlq/YQBt\n-----END CERTIFICATE-----\n`
        // const encodeCertStr = encodeURIComponent(certStr)
        // const audience = "story-center"
        // const verificationEndPoint = `${echoEndpoint}/verify?audience=${audience}&cert_str=${encodeCertStr}`
        // const requestInfo = {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   }
        // }
        // const response = await fetch(verificationEndPoint, requestInfo)
        // const responseBody = await response.json()
        // localStorage.setItem('token', responseBody.token)
        setUser(user);
        if (user.uid) {
          let username = "";
          let subscribedCat;
          setIsLoading(false);
          const token = await user.getIdToken(true);
          nookies.set(undefined, 'token', token, { path: '/' });
          onSnapshot(doc(db, "users", user.uid), doc => {
            if (doc.exists()) {
              username = doc.data().username;
              subscribedCat = doc.data().subscribedCat ? doc.data().subscribedCat : [];
              setUser({ ...user, subscribedCat, username, image: doc.data().image });
            }
          })
        }
      } else {
        nookies.set(undefined, 'token', '', { path: '/' });
        setUser(false);
        setIsLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  // Return the user object and auth methods
  return {
    deleteAccount,
    setupPassword,
    success,
    changePassword,
    isLoading,
    errors,
    user,
    signin,
    signup,
    signout,
    resetEmail,
    // confirmPasswordReset,
    verifyEmail,
    signInWithGoogle,
    isGoogleOnly
    // changeUsername,
  };
}
