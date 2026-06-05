// Public surface for the data layer. Import from "@/lib/api" everywhere in the UI
// so we can swap the localStorage adapter for a real backend in one place.
export * from "./types";
export * from "./services";
export { bookingsApi } from "./bookings";
export type { CreateBookingInput } from "./bookings";
export { customersApi } from "./customers";
export { contactApi } from "./contact";