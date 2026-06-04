import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { db, increment, serverTimestamp, Timestamp } from "./lib/firebase";
import { getService } from "./lib/api/services";
import { sendAdminNewBookingNotification } from "./lib/email";
import type { Booking, ServiceId } from "./lib/api/types";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => ((m as { default?: ServerEntry }).default ?? (m as unknown as ServerEntry)),
    );
  }
  return serverEntryPromise;
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ ok: false, error: message }, status);
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isCatastrophicSsrErrorBody(body: string, responseStatus: number): boolean {
  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return false;
  }

  if (!payload || Array.isArray(payload) || typeof payload !== "object") {
    return false;
  }

  const fields = payload as Record<string, unknown>;
  const expectedKeys = new Set(["message", "status", "unhandled"]);
  if (!Object.keys(fields).every((key) => expectedKeys.has(key))) {
    return false;
  }

  return (
    fields.unhandled === true &&
    fields.message === "HTTPError" &&
    (fields.status === undefined || fields.status === responseStatus)
  );
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isCatastrophicSsrErrorBody(body, response.status)) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return brandedErrorResponse();
}

function serializeBooking(doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>) {
  const data = doc.data() ?? {};
  const dateValue = data.date as FirebaseFirestore.Timestamp | undefined;
  const dateObj = dateValue ? dateValue.toDate() : new Date();
  const isoDate = dateObj.toISOString();
  const time = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  return {
    id: doc.id,
    customerId: (data.customerID as FirebaseFirestore.DocumentReference)?.id ?? "",
    customer: {
      name: data.customerSnapshot?.name ?? "",
      email: data.customerSnapshot?.email ?? "",
      phone: data.customerSnapshot?.phone ?? "",
    },
    serviceId: data.serviceId ?? "",
    serviceName: data.serviceName ?? "",
    price: data.price ?? 0,
    date: isoDate.split("T")[0],
    time,
    address: data.address ?? "",
    notes: data.notes ?? "",
    status: data.status ?? "pending",
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? isoDate,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
  };
}

const COUNTERS_DOC = db.doc("metadata/counters");

function formatCustomId(prefix: "CUST" | "BOOK", year: number, sequence: number) {
  return `${prefix}-${year}-${sequence.toString().padStart(6, "0")}`;
}

async function reserveIds(tx: FirebaseFirestore.Transaction, needsCustomerId: boolean) {
  const counterDoc = await tx.get(COUNTERS_DOC);
  const current = counterDoc.exists ? (counterDoc.data() as Record<string, number>) : {};

  let customerSeq = current.customer ?? 0;
  let bookingSeq = current.booking ?? 0;

  if (needsCustomerId) {
    customerSeq += 1;
  }
  bookingSeq += 1;

  tx.set(COUNTERS_DOC, {
    customer: customerSeq,
    booking: bookingSeq,
  }, { merge: true });

  const year = new Date().getFullYear();
  return {
    customerId: needsCustomerId ? formatCustomId("CUST", year, customerSeq) : undefined,
    bookingId: formatCustomId("BOOK", year, bookingSeq),
  };
}

async function handleCreateBooking(request: Request): Promise<Response> {
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid JSON payload", 400);
  }

  const { serviceId, date, time, address, notes, customer } = payload;
  if (!serviceId || !date || !time || !address || !customer) {
    return errorResponse("Missing required booking fields", 400);
  }
  if (!customer.name || !customer.email || !customer.phone) {
    return errorResponse("Customer name, email, and phone are required", 400);
  }

  const service = getService(serviceId);
  if (!service) {
    return errorResponse("Unknown service", 400);
  }

  const serviceIdValue = String(serviceId) as ServiceId;
  const email = String(customer.email).trim().toLowerCase();
  const customerQuery = await db.collection("customers").where("email", "==", email).limit(1).get();
  const isNewCustomer = customerQuery.empty;
  const ids = await db.runTransaction(async (tx) => {
    const counterIds = await reserveIds(tx, isNewCustomer);

    const customerRef = isNewCustomer
      ? db.collection("customers").doc(counterIds.customerId!)
      : customerQuery.docs[0].ref;

    if (isNewCustomer) {
      tx.set(customerRef, {
        name: customer.name,
        email,
        phone: customer.phone,
        address,
        totalBookings: 1,
        totalSpent: service.price,
        lastBookingAt: serverTimestamp,
        createdAt: serverTimestamp,
      });
    } else {
      tx.update(customerRef, {
        name: customer.name,
        phone: customer.phone,
        address,
        totalBookings: increment(1),
        totalSpent: increment(service.price),
        lastBookingAt: serverTimestamp,
      });
    }

    const bookingRef = db.collection("bookings").doc(counterIds.bookingId);
    tx.set(bookingRef, {
      address,
      createdAt: serverTimestamp,
      customerID: customerRef,
      customerSnapshot: {
        name: customer.name,
        email,
        phone: customer.phone,
      },
      date: Timestamp.fromDate(new Date(`${date} ${time}`)),
      notes: notes ?? "",
      price: service.price,
      serviceId,
      serviceName: service.name,
      status: "pending",
      updatedAt: serverTimestamp,
    });

    return {
      bookingId: counterIds.bookingId,
      customerId: customerRef.id,
    };
  });

  const bookingData: Booking = {
    id: ids.bookingId,
    address,
    customerId: ids.customerId,
    customer: {
      name: customer.name,
      email,
      phone: customer.phone,
    },
    serviceId: serviceIdValue,
    serviceName: service.name,
    price: service.price,
    date,
    time,
    notes: notes ?? "",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  sendAdminNewBookingNotification(bookingData).catch((error) => {
    console.error("Failed to send admin booking notification:", error);
  });

  return jsonResponse({ ok: true, data: bookingData });
}

async function handleListBookings(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const customerId = url.searchParams.get("customerId");

  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection("bookings");
  if (status) query = query.where("status", "==", status);
  if (customerId) {
    const customerRef = db.collection("customers").doc(customerId);
    query = query.where("customerID", "==", customerRef);
  }
  const snapshot = await query.orderBy("createdAt", "desc").get();
  const bookings = snapshot.docs.map(serializeBooking);
  return jsonResponse({ ok: true, data: bookings });
}

async function handleGetBooking(request: Request, id: string): Promise<Response> {
  const bookingRef = db.collection("bookings").doc(id);
  const bookingDoc = await bookingRef.get();
  if (!bookingDoc.exists) {
    return errorResponse("Booking not found", 404);
  }
  const booking = serializeBooking(bookingDoc);
  return jsonResponse({ ok: true, data: booking });
}

async function handleUpdateBookingStatus(request: Request, id: string): Promise<Response> {
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid JSON payload", 400);
  }
  const { status } = payload;
  if (!status) {
    return errorResponse("Missing status", 400);
  }

  const bookingRef = db.collection("bookings").doc(id);
  const bookingDoc = await bookingRef.get();
  if (!bookingDoc.exists) {
    return errorResponse("Booking not found", 404);
  }

  await bookingRef.update({ status, updatedAt: serverTimestamp });
  const updatedBooking = serializeBooking(await bookingRef.get());
  return jsonResponse({ ok: true, data: updatedBooking });
}

function getBookingIdFromPath(pathname: string): string | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 2 && parts[0] === "api" && parts[1] === "bookings") {
    return null;
  }
  if (parts.length === 3 && parts[0] === "api" && parts[1] === "bookings") {
    return parts[2];
  }
  return null;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      if (pathname === "/api/bookings" && request.method === "POST") {
        return await handleCreateBooking(request);
      }

      if (pathname === "/api/bookings" && request.method === "GET") {
        return await handleListBookings(request);
      }

      const bookingId = getBookingIdFromPath(pathname);
      if (bookingId && request.method === "GET") {
        return await handleGetBooking(request, bookingId);
      }

      if (bookingId && request.method === "PATCH") {
        return await handleUpdateBookingStatus(request, bookingId);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
