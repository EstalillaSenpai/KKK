import type { Customer, Result } from "./types";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

const COLLECTION = "customers";

/**
 * Convert Firestore doc → Customer
 */
function mapDoc(id: string, data: any): Customer {
  return {
    id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    createdAt: data.createdAt,
  };
}

export const customersApi = {
  /**
   * LIST all customers
   */
  async list(): Promise<Customer[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTION));

      return snap.docs.map((d) =>
        mapDoc(d.id, d.data())
      );
    } catch {
      return [];
    }
  },

  /**
   * GET customer by ID
   */
  async get(id: string): Promise<Customer | null> {
    try {
      const snap = await getDoc(doc(db, COLLECTION, id));

      if (!snap.exists()) return null;

      return mapDoc(snap.id, snap.data());
    } catch {
      return null;
    }
  },

  /**
   * FIND customer by email
   */
  async findByEmail(email: string): Promise<Customer | null> {
    try {
      const q = query(
        collection(db, COLLECTION),
        where("email", "==", email.trim().toLowerCase())
      );

      const snap = await getDocs(q);

      if (snap.empty) return null;

      const docSnap = snap.docs[0];

      return mapDoc(docSnap.id, docSnap.data());
    } catch {
      return null;
    }
  },

  /**
   * UPSERT (find or create customer)
   */
  async upsert(input: {
    name: string;
    email: string;
    phone: string;
  }): Promise<Result<Customer>> {
    try {
      const email = input.email.trim().toLowerCase();

      const q = query(
        collection(db, COLLECTION),
        where("email", "==", email)
      );

      const snap = await getDocs(q);

      // ✅ EXISTS → UPDATE
      if (!snap.empty) {
        const existingDoc = snap.docs[0];
        const ref = doc(db, COLLECTION, existingDoc.id);

        const updated = {
          name: input.name,
          phone: input.phone,
        };

        await updateDoc(ref, updated);

        const updatedSnap = await getDoc(ref);

        return {
          ok: true,
          data: mapDoc(
            updatedSnap.id,
            updatedSnap.data()
          ),
        };
      }

      // 🆕 CREATE NEW
      const now = new Date().toISOString();

      const createdData = {
        name: input.name,
        email,
        phone: input.phone,
        createdAt: now,
      };

      const docRef = await addDoc(
        collection(db, COLLECTION),
        createdData
      );

      return {
        ok: true,
        data: {
          id: docRef.id,
          ...createdData,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Customer upsert failed",
      };
    }
  },
};