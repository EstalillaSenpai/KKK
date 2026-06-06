import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Booking, BookingStatus, Result, ServiceId } from "./types";

export interface CreateBookingInput {
  serviceId: ServiceId;
  date: string;
  time: string;
  address: string;
  notes?: string;
  customer: { name: string; email: string; phone: string };
}

const bookingsRef = collection(db, "bookings");

export const bookingsApi = {
  async create(input: CreateBookingInput): Promise<Result<Booking>> {
    try {
      const docRef = await addDoc(bookingsRef, {
        ...input,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const snapshot = await getDoc(docRef);

      return {
        ok: true,
        data: { id: docRef.id, ...snapshot.data() } as Booking,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Booking failed",
      };
    }
  },

  async list(): Promise<Booking[]> {
    const snap = await getDocs(bookingsRef);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Booking[];
  },

  async get(id: string): Promise<Booking | null> {
    const snap = await getDoc(doc(db, "bookings", id));
    return snap.exists() ? (snap.data() as Booking) : null;
  },
};