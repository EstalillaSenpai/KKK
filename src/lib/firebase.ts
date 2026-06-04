import admin from "firebase-admin";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!serviceAccount) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable.");
}

const credential = typeof serviceAccount === "string"
  ? JSON.parse(serviceAccount)
  : serviceAccount;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(credential),
  });
}

export const db = admin.firestore();
export const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();
export const increment = admin.firestore.FieldValue.increment;
export const Timestamp = admin.firestore.Timestamp;
