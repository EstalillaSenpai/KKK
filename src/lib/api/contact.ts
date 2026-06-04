import { storage, uid, delay } from "./storage";
import type { ContactMessage, Result } from "./types";

const KEY = "contact-messages";

function all(): ContactMessage[] {
  return storage.read<ContactMessage[]>(KEY, []);
}

export interface SubmitContactInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const contactApi = {
  async list(): Promise<ContactMessage[]> {
    return delay(all().sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  async submit(input: SubmitContactInput): Promise<Result<ContactMessage>> {
    const created: ContactMessage = {
      id: uid("msg"),
      name: input.name.trim(),
      email: input.email.trim(),
      subject: input.subject?.trim() || undefined,
      message: input.message.trim(),
      createdAt: new Date().toISOString(),
      handled: false,
    };
    storage.write(KEY, [created, ...all()]);
    return delay({ ok: true, data: created });
  },

  async markHandled(id: string, handled = true): Promise<Result<ContactMessage>> {
    const list = all();
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) return delay({ ok: false, error: "Message not found" });
    const updated: ContactMessage = { ...list[idx], handled };
    list[idx] = updated;
    storage.write(KEY, list);
    return delay({ ok: true, data: updated });
  },
};
