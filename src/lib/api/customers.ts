import { storage, uid, delay } from "./storage";
import type { Customer, Result } from "./types";

const KEY = "customers";

function all(): Customer[] {
  return storage.read<Customer[]>(KEY, []);
}

export const customersApi = {
  async list(): Promise<Customer[]> {
    return delay(all());
  },

  async get(id: string): Promise<Customer | null> {
    return delay(all().find((c) => c.id === id) ?? null);
  },

  async findByEmail(email: string): Promise<Customer | null> {
    const e = email.trim().toLowerCase();
    return delay(all().find((c) => c.email.toLowerCase() === e) ?? null);
  },

  /** Find by email or create a new customer record. */
  async upsert(input: {
    name: string;
    email: string;
    phone: string;
  }): Promise<Result<Customer>> {
    const list = all();
    const email = input.email.trim().toLowerCase();
    const existing = list.find((c) => c.email.toLowerCase() === email);
    if (existing) {
      const updated: Customer = { ...existing, name: input.name, phone: input.phone };
      const next = list.map((c) => (c.id === existing.id ? updated : c));
      storage.write(KEY, next);
      return delay({ ok: true, data: updated });
    }
    const created: Customer = {
      id: uid("cus"),
      name: input.name,
      email: input.email,
      phone: input.phone,
      createdAt: new Date().toISOString(),
    };
    storage.write(KEY, [created, ...list]);
    return delay({ ok: true, data: created });
  },
};
