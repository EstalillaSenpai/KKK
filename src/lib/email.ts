import sgMail from "@sendgrid/mail";
import type { Booking } from "./api/types";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const EMAIL_FROM = process.env.EMAIL_FROM ?? "hello@kkkcleaning.ph";

if (!SENDGRID_API_KEY) {
  throw new Error("Missing SENDGRID_API_KEY environment variable.");
}

if (!ADMIN_EMAIL) {
  throw new Error("Missing ADMIN_EMAIL environment variable.");
}

sgMail.setApiKey(SENDGRID_API_KEY);

function buildAdminBookingSubject(booking: Booking) {
  return `New booking received: ${booking.id} (${booking.serviceName})`;
}

function buildAdminBookingText(booking: Booking) {
  return [
    `Booking ID: ${booking.id}`,
    `Service: ${booking.serviceName}`,
    `Customer: ${booking.customer.name}`,
    `Email: ${booking.customer.email}`,
    `Phone: ${booking.customer.phone}`,
    `Date: ${booking.date}`,
    `Time: ${booking.time}`,
    `Address: ${booking.address}`,
    `Notes: ${booking.notes ?? "None"}`,
    `Status: ${booking.status}`,
    `Created at: ${booking.createdAt}`,
  ].join("\n");
}

function buildAdminBookingHtml(booking: Booking) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h1>New Booking Received</h1>
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;">
        <tbody>
          <tr><td><strong>Booking ID:</strong></td><td>${booking.id}</td></tr>
          <tr><td><strong>Service:</strong></td><td>${booking.serviceName}</td></tr>
          <tr><td><strong>Customer:</strong></td><td>${booking.customer.name}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${booking.customer.email}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${booking.customer.phone}</td></tr>
          <tr><td><strong>Date:</strong></td><td>${booking.date}</td></tr>
          <tr><td><strong>Time:</strong></td><td>${booking.time}</td></tr>
          <tr><td><strong>Address:</strong></td><td>${booking.address}</td></tr>
          <tr><td><strong>Notes:</strong></td><td>${booking.notes ?? "None"}</td></tr>
          <tr><td><strong>Status:</strong></td><td>${booking.status}</td></tr>
          <tr><td><strong>Created at:</strong></td><td>${booking.createdAt}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

export async function sendAdminNewBookingNotification(booking: Booking): Promise<void> {
  await sgMail.send({
    to: ADMIN_EMAIL,
    from: EMAIL_FROM,
    subject: buildAdminBookingSubject(booking),
    text: buildAdminBookingText(booking),
    html: buildAdminBookingHtml(booking),
  });
}
