import { firestore } from "@/lib/firebase.config";
import { collection, addDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, phone, dob, department } = req.body;

    try {
      const docRef = await addDoc(collection(firestore, "appointments"), {
        name,
        email,
        phone,
        dob,
        department,
        createdAt: new Date().toISOString(),
      });

      res.status(200).json({ id: docRef.id });
    } catch (e) {
      console.error("Error adding document: ", e);
      res.status(500).json({ error: "Error adding document" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
