import React, { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "./firebaseConfig";
import { getDocs, doc, updateDoc, deleteDoc, query, collection, where, writeBatch, onSnapshot } from 'firebase/firestore'

const notificationContext = createContext();

export function ProvideNotification({ children }) {
  const notifications = useProvideNotification();
  return (
    <notificationContext.Provider value={notifications}>
      {children}
    </notificationContext.Provider>
  );
}

export const useNotifcations = () => {
  return useContext(notificationContext);
};

function useProvideNotification() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const markAsRead = (id) => updateDoc(doc(db, 'notifications', id), { read: true })

  const deleteOne = (id) => deleteDoc(doc(db, 'notifications', id))

  const markAllAsRead = async () => {
    const batch = writeBatch(db);
    const userId = auth.currentUser.uid;

    const data = await getDocs(query(collection(db, 'notifications'), where("recipient", "==", userId), where("read", "==", false)))

    data.forEach((notif) => {
      batch.update(doc(db, 'notifications', notif.id), {
        read: true,
      });
    });
    return batch.commit();
  };

  const deleteAll = async () => {
    try {
      const batch = writeBatch(db);
      const userId = auth.currentUser.uid;
      const data = await getDocs(query(collection(db, 'notifications'), where("recipient", "==", userId)))

      data.forEach((notif) => {
        batch.delete(doc(db, 'notifications', notif.id))
      });
      return batch.commit();
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.uid) {
        const notifRef = await query(collection(db, 'notifications'), where("recipient", "==", user.uid))

        onSnapshot(notifRef, (docs) => {
          let items = [];
          items = docs.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }))
            .sort((a, b) => {
              a =
                typeof a.createdAt !== "object"
                  ? new Date(a.createdAt)
                  : new Date(a.createdAt.seconds);
              b =
                typeof b.createdAt !== "object"
                  ? new Date(b.createdAt)
                  : new Date(b.createdAt.seconds);

              return b < a ? -1 : b > a ? 1 : 0;
            });
          setNotifications(items);
        });
        setIsLoading(false);
      } else return;
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    setCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  return {
    isLoading,
    items: notifications,
    markAsRead,
    count,
    deleteOne,
    markAllAsRead,
    deleteAll,
  };
}