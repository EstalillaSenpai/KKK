import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Sparkles, Sofa, BedDouble, Wind, Brush, ShieldCheck, Clock, Leaf, Smile, Phone, Mail, MapPin, Menu, X, Star, ArrowRight, Target, Eye, Heart, Lightbulb, Users, Wrench, CalendarCheck, ShieldAlert, Plus, Minus, MousePointerClick, CalendarClock, Truck, BadgeCheck, Check } from "lucide-react";
import heroImg from "@/assets/hero-cleaning.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "KKK Cleaning Services — From Kadiri to Sarap" },
      { name: "description", content: "Premium sofa, mattress, rug, and upholstery deep cleaning services. From Kadiri to Sarap." },
    ],
  }),
});

const services = [
  { icon: Sofa, title: "Sofa Deep Cleaning", desc: "Restore your sofa's freshness with deep-extraction cleaning that lifts dirt, stains, and allergens." },
  { icon: BedDouble, title: "Mattress Sanitization", desc: "Eliminate dust mites and bacteria with professional sanitization for healthier sleep." },
  { icon: Wind, title: "Rug Cleaning", desc: "Gentle yet powerful cleaning that revives colors and texture of every rug type." },
  { icon: Brush, title: "Upholstery Cleaning", desc: "Expert care for chairs, cushions, and fabric surfaces — leaving them spotless and soft." },
];

const reasons = [
  { icon: ShieldCheck, title: "Trusted Professionals", desc: "Trained, vetted technicians delivering consistent five-star results." },
  { icon: Leaf, title: "Eco-Friendly Products", desc: "Safe, non-toxic solutions for your family, pets, and the planet." },
  { icon: Clock, title: "On-Time Service", desc: "We respect your schedule with punctual arrivals and fast turnaround." },
  { icon: Smile, title: "Satisfaction Guaranteed", desc: "Not happy? We'll re-clean it free. Your comfort is our promise." },
];

const testimonials = [
  { name: "Maria Santos", role: "Homeowner", quote: "My sofa looks brand new! The team was professional, on time, and incredibly thorough.", rating: 5 },
  { name: "Daniel Cruz", role: "Cafe Owner", quote: "KKK Cleaning transformed our upholstered seating. Customers noticed the next day.", rating: 5 },
  { name: "Ana Reyes", role: "Mom of three", quote: "The mattress sanitization gave me peace of mind. Truly from Kadiri to Sarap!", rating: 5 },
];

const trustPoints = [
  { icon: Users, title: "Trained Cleaning Professionals", desc: "Certified technicians with hands-on expertise in fabric care." },
  { icon: Leaf, title: "Eco-Friendly Products", desc: "Plant-based, non-toxic solutions safe for kids and pets." },
  { icon: Wrench, title: "Modern Cleaning Equipment", desc: "Hospital-grade extractors and steam systems for deep results." },
  { icon: CalendarCheck, title: "Fast Booking System", desc: "Reserve a slot in under a minute — online or by phone." },
  { icon: ShieldAlert, title: "Reliable Sanitation Process", desc: "Multi-step sanitization protocol verified after every job." },
];

const stats = [
  { value: 2500, suffix: "+", label: "Customers Served" },
  { value: 8000, suffix: "+", label: "Cleaning Sessions" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
  { value: 30, suffix: " min", label: "Avg. Response Time" },
];

const team = [
  { name: "Kris K. King", role: "Founder & CEO", initials: "KK" },
  { name: "Marco Dela Cruz", role: "Operations Manager", initials: "MD" },
  { name: "Liza Mendoza", role: "Customer Support Lead", initials: "LM" },
  { name: "Cleaning Specialists", role: "Field Technicians Team", initials: "CS" },
];

const faqs = [
  { q: "How do I book a cleaning service?", a: "Use the contact form above, message us on social media, or call our hotline. Bookings are confirmed within the hour." },
  { q: "How long does a typical cleaning session take?", a: "Most sofa or mattress deep cleans take 1–2 hours depending on size and condition. We'll give you a clear estimate when booking." },
  { q: "Which areas do you serve?", a: "We currently cover the entire metro area and nearby provinces. Contact us to confirm coverage in your location." },
  { q: "What payment methods do you accept?", a: "Cash, GCash, Maya, and major bank transfers. Payment is collected after the service is completed." },
  { q: "Are your cleaning chemicals safe?", a: "Yes — we use eco-certified, non-toxic, biodegradable formulas safe for children, pets, and people with allergies." },
];

function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return { value, ref };
}

function Reveal({ children, delay = 0, as: As = "div", className = "" }: { children: ReactNode; delay?: number; as?: any; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add("is-visible");
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <As ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </As>
  );
}

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { value: v, ref } = useCountUp(value);
  return (
    <div ref={ref} className="rounded-2xl bg-card border border-border p-7 text-center shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] transition-all">
      <div className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
        {v.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

function About() {
  const items = [
    { icon: Target, title: "Mission", desc: "Deliver premium, eco-friendly cleaning that restores comfort and confidence to every home." },
    { icon: Eye, title: "Vision", desc: "To be the most trusted name in deep cleaning — recognized for quality, care, and innovation." },
    { icon: Heart, title: "Core Values", desc: "Integrity, excellence, sustainability, and genuine care for every customer we serve." },
    { icon: Lightbulb, title: "Technopreneurship", desc: "We blend craftsmanship with smart tech — online booking, route optimization, and digital tracking." },
  ];
  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-primary border border-border">About Us</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">Built on care. Powered by craft.</h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              KKK Cleaning Services started with a simple idea — that every home deserves to feel brand new. What began as a small family operation has grown into a trusted cleaning brand, blending traditional craftsmanship with modern, tech-driven service.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              From Kadiri to Sarap, we've made it our mission to transform tired furniture into refreshed comfort — one home, one fabric, one detail at a time.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {items.map((it, i) => (
              <Reveal key={it.title} delay={i * 80}>
                <div className="group rounded-2xl bg-card border border-border p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="h-11 w-11 grid place-items-center rounded-xl text-primary-foreground transition-transform group-hover:scale-110 group-hover:rotate-3" style={{ background: "var(--gradient-primary)" }}>
                    <it.icon size={20} />
                  </div>
                  <h3 className="mt-4 font-semibold">{it.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section id="trust" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Customers Trust Us</h2>
          <p className="mt-3 text-muted-foreground">A complete system designed to deliver consistent, premium results.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {trustPoints.map((t, i) => (
            <Reveal key={t.title} delay={i * 70}>
              <div className="group rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-card)] hover:-translate-y-1.5 hover:border-primary/40 transition-all duration-300 h-full">
                <div className="h-11 w-11 grid place-items-center rounded-xl bg-accent text-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <t.icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-sm">{t.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="team" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Meet the Team</h2>
          <p className="mt-3 text-muted-foreground">The people behind every spotless result.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 80}>
              <div className="group rounded-2xl bg-card border border-border p-6 text-center shadow-[var(--shadow-card)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-soft)] hover:border-primary/40 transition-all duration-300 h-full">
                <div className="mx-auto h-20 w-20 rounded-full grid place-items-center text-2xl font-bold text-primary-foreground transition-transform group-hover:scale-105" style={{ background: "var(--gradient-primary)" }}>
                  {m.initials}
                </div>
                <h3 className="mt-5 font-semibold">{m.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="mt-3 text-muted-foreground">Everything you need to know before booking.</p>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 50}>
              <div className={`rounded-2xl bg-card border overflow-hidden transition-colors ${isOpen ? "border-primary/40" : "border-border"}`}>
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-accent/40 transition">
                  <span className="font-semibold">{f.q}</span>
                  <span className={`grid place-items-center h-8 w-8 rounded-full bg-accent text-primary shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{f.a}</div>
                  </div>
                </div>
              </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  const links = [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#pricing", label: "Pricing" },
    { href: "#how", label: "How It Works" },
    { href: "#trust", label: "Why Us" },
    { href: "#team", label: "Team" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-lg transition-all duration-300 ${scrolled ? "bg-background/90 border-b border-border shadow-[0_4px_20px_-12px_rgba(0,0,0,0.12)]" : "bg-background/60 border-b border-transparent"}`}>
      <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-extrabold text-lg">
          <span className="grid place-items-center h-9 w-9 rounded-xl text-primary-foreground transition-transform hover:rotate-6 hover:scale-105" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles size={18} />
          </span>
          <span>KKK Cleaning</span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a key={l.href} href={l.href} className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">{l.label}</a>
          ))}
          <Link to="/book" className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 hover:scale-[1.03] active:scale-[0.98] transition">
            Book Now <ArrowRight size={14} />
          </Link>
        </div>
        <button className="md:hidden p-2 rounded-md hover:bg-accent transition" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      <div className={`md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur transition-[max-height,opacity] duration-300 ease-out ${open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 py-4 flex flex-col gap-1">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-medium rounded-md px-2 hover:bg-accent hover:text-primary transition"
              style={{ transitionDelay: `${i * 20}ms` }}
            >
              {l.label}
            </a>
          ))}
          <Link to="/book" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-primary text-primary-foreground text-center py-2.5 font-semibold hover:opacity-90 active:scale-[0.98] transition">Book Now</Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-background/70 backdrop-blur px-4 py-1.5 text-xs font-semibold text-primary border border-border">
            <Sparkles size={14} /> Premium Deep Cleaning
          </span>
          <h1 className="mt-5 text-[2.5rem] sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
            From <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>Kadiri</span> to Sarap.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl">
            KKK Cleaning Services brings your sofas, mattresses, rugs, and upholstery back to life — with deep-clean care your home deserves.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:scale-[1.02] transition" style={{ background: "var(--gradient-primary)" }}>
              Book Now <ArrowRight size={16} />
            </Link>
            <a href="#services" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold bg-background border border-border hover:border-primary transition">
              View Services
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><Star size={16} className="fill-primary text-primary" /><span className="font-semibold text-foreground">4.9</span> rating</div>
            <div>500+ happy homes</div>
            <div>Eco-friendly</div>
          </div>
        </div>
        <div className="relative animate-float">
          <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-40" style={{ background: "var(--gradient-primary)" }} />
          <img src={heroImg} alt="Professional cleaning a white sofa" width={1024} height={1024} className="relative rounded-3xl shadow-[var(--shadow-soft)] w-full h-auto object-cover" />
        </div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">A cleaner home, a happier you.</h2>
      <p className="mt-5 text-lg text-muted-foreground">
        KKK Cleaning Services is your trusted partner for professional deep cleaning. With years of experience and a passion for spotless results, we transform tired furniture into refreshed comfort — one home at a time.
      </p>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Services</h2>
          <p className="mt-3 text-muted-foreground">Specialized cleaning treatments tailored to every fabric and fiber.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <div className="group bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)] hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)] transition-all duration-300 h-full">
                <div className="h-12 w-12 grid place-items-center rounded-xl text-primary-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: "var(--gradient-primary)" }}>
                  <s.icon size={22} />
                </div>
                <h3 className="mt-5 font-semibold text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section id="why" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose Us</h2>
          <p className="mt-3 text-muted-foreground">Quality, care, and consistency in every clean.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 80}>
              <div className="group rounded-2xl p-6 bg-card border border-border hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 h-full">
                <div className="h-11 w-11 grid place-items-center rounded-xl bg-accent text-primary transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <r.icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What our customers say</h2>
          <p className="mt-3 text-muted-foreground">Real stories from homes we've refreshed.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
            <div className="rounded-2xl bg-card p-7 border border-border shadow-[var(--shadow-card)] hover:-translate-y-1 hover:border-primary/40 transition-all duration-300 h-full">
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="mt-4 text-foreground leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 pt-5 border-t border-border">
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl p-8 md:p-14 text-primary-foreground shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-primary)" }}>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Ready to book your clean?</h2>
              <p className="mt-4 opacity-90">Tell us what needs refreshing — we'll respond within the hour.</p>
              <div className="mt-8 space-y-3 text-sm">
                <div className="flex items-center gap-3"><Phone size={18} /> +63 900 000 0000</div>
                <div className="flex items-center gap-3"><Mail size={18} /> hello@kkkcleaning.ph</div>
                <div className="flex items-center gap-3"><MapPin size={18} /> Serving your city, 7 days a week</div>
              </div>
            </div>
            <form className="bg-background text-foreground rounded-2xl p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium">Name</label>
                <input className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 outline-none focus:border-primary" placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-medium">Phone or Email</label>
                <input className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 outline-none focus:border-primary" placeholder="How can we reach you?" />
              </div>
              <div>
                <label className="text-sm font-medium">What do you need cleaned?</label>
                <textarea rows={3} className="mt-1 w-full rounded-lg border border-border px-4 py-2.5 outline-none focus:border-primary resize-none" placeholder="Sofa, mattress, rug..." />
              </div>
              <button className="w-full rounded-full py-3 font-semibold text-primary-foreground hover:opacity-90 transition" style={{ background: "var(--gradient-primary)" }}>
                Request a Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

const PRICING = [
  { name: "Sofa Cleaning", price: 1200, unit: "per set", features: ["Up to 3-seater", "Deep extraction", "Stain treatment", "Deodorizing"], popular: false },
  { name: "Mattress Cleaning", price: 1500, unit: "per piece", features: ["Queen / King size", "Dust mite removal", "UV sanitization", "Odor neutralizer"], popular: true },
  { name: "Rug Cleaning", price: 900, unit: "per rug", features: ["Any fabric type", "Color-safe wash", "Quick dry process", "Fringe care"], popular: false },
  { name: "Full Deep Clean", price: 3500, unit: "package", features: ["Sofa + Mattress + Rug", "Priority booking", "Free re-clean", "10% return discount"], popular: false },
];

function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-primary border border-border">Pricing</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">Simple, upfront pricing</h2>
          <p className="mt-3 text-muted-foreground">No surprises. Final estimate is confirmed after your booking.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
            <div className={`relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1.5 h-full ${p.popular ? "border-primary bg-card shadow-[var(--shadow-soft)] lg:scale-[1.02]" : "border-border bg-card shadow-[var(--shadow-card)] hover:border-primary/40"}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                  Most Popular
                </span>
              )}
              <h3 className="font-semibold">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>₱{p.price.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">/ {p.unit}</span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/book" className={`mt-6 w-full inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition hover:scale-[1.02] active:scale-[0.98] ${p.popular ? "text-primary-foreground hover:opacity-90" : "bg-accent text-primary hover:bg-accent/70"}`} style={p.popular ? { background: "var(--gradient-primary)" } : undefined}>
                Book Now <ArrowRight size={14} />
              </Link>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { icon: MousePointerClick, title: "Choose a Service", desc: "Pick from sofa, mattress, rug, or our full deep clean package." },
  { icon: CalendarClock, title: "Schedule a Slot", desc: "Select your preferred date and time — same-day slots available." },
  { icon: Truck, title: "We Arrive On Time", desc: "Our trained team arrives with eco-friendly tools and equipment." },
  { icon: BadgeCheck, title: "Enjoy the Freshness", desc: "Sit back, relax, and pay only after the job is done right." },
];

function HowItWorks() {
  return (
    <section id="how" className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-1.5 text-xs font-semibold text-primary border border-border">How It Works</span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">Booking made effortless</h2>
          <p className="mt-3 text-muted-foreground">Four simple steps from request to refreshed.</p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <div className="group relative rounded-2xl bg-card border border-border p-6 shadow-[var(--shadow-card)] hover:-translate-y-1.5 hover:border-primary/40 transition-all duration-300 h-full">
                <div className="absolute -top-4 -left-4 h-10 w-10 grid place-items-center rounded-full text-primary-foreground font-bold text-sm shadow-[var(--shadow-soft)] transition-transform group-hover:scale-110" style={{ background: "var(--gradient-primary)" }}>
                  {i + 1}
                </div>
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-accent text-primary transition-transform group-hover:scale-110">
                  <s.icon size={22} />
                </div>
                <h3 className="mt-5 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/book" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] hover:scale-[1.02] transition" style={{ background: "var(--gradient-primary)" }}>
            Start Booking <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <span className="grid place-items-center h-7 w-7 rounded-lg text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles size={14} />
          </span>
          KKK Cleaning Services
        </div>
        <div>© {new Date().getFullYear()} KKK Cleaning. From Kadiri to Sarap.</div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Intro />
      <About />
      <Services />
      <Pricing />
      <HowItWorks />
      <Trust />
      <Stats />
      <WhyUs />
      <Team />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
