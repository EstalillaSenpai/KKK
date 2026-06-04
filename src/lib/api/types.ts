// Domain types for KKK Cleaning Services.
// These types are the contract between the UI and the data layer.
// When a real backend is added, only the adapter implementation changes —
// these types and the service functions stay the same.

export type ServiceId = "sofa" | "mattress" | "rug" | "full";

export type BookingStatus =
  | "pending"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string; // ISO
}

export interface Booking {
  id: string;
  customerId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  serviceId: ServiceId;
  serviceName: string;
  price: number;
  date: string;   // YYYY-MM-DD
  time: string;   // e.g. "10:00 AM"
  address: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string; // ISO
  handled: boolean;
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
