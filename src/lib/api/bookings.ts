import type { Booking, BookingStatus, Result, ServiceId } from "./types";

export interface CreateBookingInput {
  serviceId: ServiceId;
  date: string;
  time: string;
  address: string;
  notes?: string;
  customer: { name: string; email: string; phone: string };
}

async function requestJson<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { "content-type": "application/json" },
    ...options,
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body?.error ?? "Booking service failure");
  }
  return body as T;
}

export const bookingsApi = {
  async list(filter?: { status?: BookingStatus; customerId?: string }): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (filter?.status) params.set("status", filter.status);
    if (filter?.customerId) params.set("customerId", filter.customerId);
    const url = `/api/bookings?${params.toString()}`;
    const body = await requestJson<{ ok: true; data: Booking[] }>(url, { method: "GET" });
    return body.data;
  },

  async get(id: string): Promise<Booking | null> {
    try {
      const body = await requestJson<{ ok: true; data: Booking }>(`/api/bookings/${id}`, { method: "GET" });
      return body.data;
    } catch {
      return null;
    }
  },

  async create(input: CreateBookingInput): Promise<Result<Booking>> {
    try {
      const body = await requestJson<{ ok: true; data: Booking }>("/api/bookings", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return { ok: true, data: body.data };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Booking failed" };
    }
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Result<Booking>> {
    try {
      const body = await requestJson<{ ok: true; data: Booking }>(`/api/bookings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      return { ok: true, data: body.data };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : "Status update failed" };
    }
  },

  async remove(id: string): Promise<Result<true>> {
    return { ok: false, error: "Booking removal is not implemented" };
  },
};
