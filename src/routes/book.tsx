import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles, Sofa, BedDouble, Wind, Brush, Calendar, Clock, MapPin,
  User, Phone, Mail, NotebookPen, CheckCircle2, ArrowRight, ArrowLeft, X,
} from "lucide-react";
import { bookingsApi } from "@/lib/api";

export const Route = createFileRoute("/book")({
  component: BookPage,
  head: () => ({
    meta: [
      { title: "Book a Cleaning — KKK Cleaning Services" },
      { name: "description", content: "Book your sofa, mattress, rug, or full deep cleaning service in minutes." },
    ],
  }),
});

const SERVICES = [
  { id: "sofa", name: "Sofa Cleaning", price: 1200, icon: Sofa, desc: "Deep extraction for sofas & couches" },
  { id: "mattress", name: "Mattress Cleaning", price: 1500, icon: BedDouble, desc: "Sanitization & dust mite removal" },
  { id: "rug", name: "Rug Cleaning", price: 900, icon: Wind, desc: "Gentle care for all rug types" },
  { id: "full", name: "Full Deep Cleaning Package", price: 3500, icon: Brush, desc: "Complete home fabric refresh" },
];

const TIME_SLOTS = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

type Errors = Partial<Record<"service" | "date" | "time" | "address" | "name" | "phone" | "email", string>>;

function BookPage() {
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const service = useMemo(() => SERVICES.find(s => s.id === serviceId), [serviceId]);
  const today = new Date().toISOString().split("T")[0];

  const validate = (): Errors => {
    const e: Errors = {};
    if (!serviceId) e.service = "Please choose a service";
    if (!date) e.date = "Pick a date";
    if (!time) e.time = "Pick a time";
    if (!address.trim() || address.trim().length < 6) e.address = "Enter a complete address";
    if (!name.trim() || name.trim().length < 2) e.name = "Enter your full name";
    if (!phone.trim() || !/^[+0-9\s\-()]{7,}$/.test(phone)) e.phone = "Enter a valid phone number";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    void bookingsApi
      .create({
        serviceId: serviceId as "sofa" | "mattress" | "rug" | "full",
        date,
        time,
        address,
        notes,
        customer: { name, email, phone },
      })
      .then((res) => { if (res.ok) setSubmitted(true); });
  };
  const onSubmit = (ev: React.FormEvent) => { ev.preventDefault(); submit(); };

  const reset = () => {
    setServiceId(""); setDate(""); setTime(""); setAddress("");
    setName(""); setPhone(""); setEmail(""); setNotes("");
    setErrors({}); setSubmitted(false);
  };

  const fieldErr = (k: keyof Errors) => errors[k];
  const inputBase = (k: keyof Errors) =>
    `mt-1.5 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/20 ${
      fieldErr(k) ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
    }`;

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg">
            <span className="grid place-items-center h-9 w-9 rounded-xl text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles size={18} />
            </span>
            KKK Cleaning
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </header>

      <section className="py-12 md:py-16" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-background/70 backdrop-blur px-4 py-1.5 text-xs font-semibold text-primary border border-border">
            <Calendar size={14} /> Quick Booking
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight">Book your cleaning in minutes</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Pick a service, choose your slot, and we'll handle the rest. From Kadiri to Sarap.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[1fr_380px] gap-8">
          <form id="booking-form" onSubmit={onSubmit} noValidate className="rounded-3xl bg-card border border-border p-6 md:p-10 shadow-[var(--shadow-card)] space-y-10">
            {/* Service */}
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2"><Sparkles size={18} className="text-primary" /> Select a Service</h2>
              <p className="text-sm text-muted-foreground mt-1">Choose what needs the KKK treatment.</p>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {SERVICES.map((s) => {
                  const active = serviceId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => { setServiceId(s.id); setErrors(p => ({ ...p, service: undefined })); }}
                      className={`text-left rounded-2xl border p-4 transition-all hover:-translate-y-0.5 ${
                        active ? "border-primary bg-accent/40 shadow-[var(--shadow-soft)]" : "border-border bg-background hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`h-10 w-10 grid place-items-center rounded-xl shrink-0 ${active ? "text-primary-foreground" : "bg-accent text-primary"}`} style={active ? { background: "var(--gradient-primary)" } : undefined}>
                          <s.icon size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold text-sm">{s.name}</div>
                            <div className="text-sm font-bold text-primary">₱{s.price.toLocaleString()}</div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {fieldErr("service") && <p className="mt-2 text-xs text-destructive">{fieldErr("service")}</p>}
            </div>

            {/* Schedule */}
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2"><Calendar size={18} className="text-primary" /> Schedule</h2>
              <p className="text-sm text-muted-foreground mt-1">When should we drop by?</p>
              <div className="mt-5 grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium">Preferred Date</label>
                  <input type="date" min={today} value={date}
                    onChange={(e) => { setDate(e.target.value); setErrors(p => ({ ...p, date: undefined })); }}
                    className={inputBase("date")} />
                  {fieldErr("date") && <p className="mt-1 text-xs text-destructive">{fieldErr("date")}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Preferred Time</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((t) => {
                      const active = time === t;
                      return (
                        <button key={t} type="button"
                          onClick={() => { setTime(t); setErrors(p => ({ ...p, time: undefined })); }}
                          className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                            active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40"
                          }`}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                  {fieldErr("time") && <p className="mt-1 text-xs text-destructive">{fieldErr("time")}</p>}
                </div>
              </div>
              <div className="mt-5">
                <label className="text-sm font-medium flex items-center gap-1.5"><MapPin size={14} /> Service Address</label>
                <input type="text" value={address}
                  onChange={(e) => { setAddress(e.target.value); setErrors(p => ({ ...p, address: undefined })); }}
                  placeholder="House #, street, barangay, city"
                  className={inputBase("address")} />
                {fieldErr("address") && <p className="mt-1 text-xs text-destructive">{fieldErr("address")}</p>}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2"><User size={18} className="text-primary" /> Contact Information</h2>
              <p className="text-sm text-muted-foreground mt-1">So we can confirm your booking.</p>
              <div className="mt-5 grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input value={name} onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                    placeholder="Juan Dela Cruz" className={inputBase("name")} />
                  {fieldErr("name") && <p className="mt-1 text-xs text-destructive">{fieldErr("name")}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-1.5"><Phone size={14} /> Phone</label>
                  <input value={phone} onChange={(e) => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })); }}
                    placeholder="+63 900 000 0000" className={inputBase("phone")} />
                  {fieldErr("phone") && <p className="mt-1 text-xs text-destructive">{fieldErr("phone")}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-1.5"><Mail size={14} /> Email</label>
                  <input type="email" value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                    placeholder="you@email.com" className={inputBase("email")} />
                  {fieldErr("email") && <p className="mt-1 text-xs text-destructive">{fieldErr("email")}</p>}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2"><NotebookPen size={18} className="text-primary" /> Additional Notes</h2>
              <p className="text-sm text-muted-foreground mt-1">Stains, pets, parking instructions — anything we should know.</p>
              <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Tell us more about your space or special requests..."
                className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
          </form>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-3xl bg-card border border-border p-6 shadow-[var(--shadow-card)]">
              <h3 className="font-bold text-lg">Booking Summary</h3>
              <p className="text-xs text-muted-foreground mt-1">Review your details before confirming.</p>

              <div className="mt-5 space-y-3 text-sm">
                <Row label="Service" value={service ? service.name : "—"} />
                <Row label="Date" value={date || "—"} />
                <Row label="Time" value={time || "—"} />
                <Row label="Address" value={address || "—"} truncate />
                <Row label="Name" value={name || "—"} />
                <Row label="Phone" value={phone || "—"} />
              </div>

              <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estimated total</span>
                <span className="text-2xl font-extrabold text-primary">
                  {service ? `₱${service.price.toLocaleString()}` : "—"}
                </span>
              </div>

              <button type="button" onClick={submit}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-primary-foreground hover:opacity-90 transition"
                style={{ background: "var(--gradient-primary)" }}>
                Confirm Booking <ArrowRight size={16} />
              </button>
              <p className="mt-3 text-[11px] text-center text-muted-foreground">No payment required now. Pay after service.</p>
            </div>
          </aside>
        </div>
      </section>

      {submitted && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm p-4 animate-fade-in-up" onClick={reset}>
          <div className="relative w-full max-w-md rounded-3xl bg-card border border-border p-8 text-center shadow-[var(--shadow-soft)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={reset} className="absolute top-4 right-4 p-1 rounded-full hover:bg-accent" aria-label="Close">
              <X size={18} />
            </button>
            <div className="mx-auto h-16 w-16 grid place-items-center rounded-full text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 className="mt-5 text-2xl font-bold">Booking Confirmed!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you, {name.split(" ")[0]}! We've received your request for <b className="text-foreground">{service?.name}</b> on <b className="text-foreground">{date}</b> at <b className="text-foreground">{time}</b>. Our team will call you shortly to confirm.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={reset} className="flex-1 rounded-full border border-border py-2.5 text-sm font-semibold hover:bg-accent transition">Book another</button>
              <Link to="/" className="flex-1 rounded-full py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition" style={{ background: "var(--gradient-primary)" }}>
                Back home
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Row({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`font-medium text-right ${truncate ? "truncate max-w-[200px]" : ""}`}>{value}</span>
    </div>
  );
}