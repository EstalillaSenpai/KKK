import { storage, uid, delay } from "./storage";
import { customersApi } from "./customers";
import { getService } from "./services";
import type { Booking, BookingStatus, Result, ServiceId } from "./types";

const KEY = "bookings";

function all(): Booking[] {
  return storage.read<Booking[]>(KEY, []);
}

function persist(list: Booking[]): void {
  storage.write(KEY, list);
}

export interface CreateBookingInput {
  serviceId: ServiceId;
  date: string;
  time: string;
  address: string;
  notes?: string;
  customer: { name: string; email: string; phone: string };
}

export const bookingsApi = {
  async list(filter?: { status?: BookingStatus; customerId?: string }): Promise<Booking[]> {
    let items = all().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (filter?.status) items = items.filter((b) => b.status === filter.status);
    if (filter?.customerId) items = items.filter((b) => b.customerId === filter.customerId);
    return delay(items);
  },

  async get(id: string): Promise<Booking | null> {
    return delay(all().find((b) => b.id === id) ?? null);
  },

  async create(input: CreateBookingInput): Promise<Result<Booking>> {
    const service = getService(input.serviceId);
    if (!service) return delay({ ok: false, error: "Unknown service" });

    const customerResult = await customersApi.upsert(input.customer);
    if (!customerResult.ok) return { ok: false, error: customerResult.error };

    const now = new Date().toISOString();
    const booking: Booking = {
      id: uid("bkg"),
      customerId: customerResult.data.id,
      customer: input.customer,
      serviceId: service.id,
      serviceName: service.name,
      price: service.price,
      date: input.date,
      time: input.time,
      address: input.address,
      notes: input.notes,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    persist([booking, ...all()]);
    return delay({ ok: true, data: booking });
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Result<Booking>> {
    const list = all();
    const idx = list.findIndex((b) => b.id === id);
    if (idx === -1) return delay({ ok: false, error: "Booking not found" });
    const updated: Booking = { ...list[idx], status, updatedAt: new Date().toISOString() };
    list[idx] = updated;
    persist(list);
    return delay({ ok: true, data: updated });
  },

  async remove(id: string): Promise<Result<true>> {
    const list = all();
    const next = list.filter((b) => b.id !== id);
    if (next.length === list.length) return delay({ ok: false, error: "Booking not found" });
    persist(next);
    return delay({ ok: true, data: true });
  },
};
