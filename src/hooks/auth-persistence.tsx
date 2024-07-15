import { useEffect } from "react";
import { auth } from "@/lib/firebase.config";
import { onAuthStateChanged } from "firebase/auth";

export default function useAuthPersistence() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
      } else {
        console.log("User is signed out");
      }
    });

    return () => unsubscribe();
  }, []);
}
