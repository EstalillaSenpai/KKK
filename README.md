# KKK Cleaning Services

## From Kadiri to Sarap

---

# Table of Contents

1. Introduction
2. Project Overview
3. Business Background
4. Vision
5. Mission
6. Core Values
7. Features
8. User Roles
9. Customer Guide
10. Booking Process
11. Admin Guide
12. Dashboard Overview
13. Service Management
14. Customer Management
15. Booking Status Workflow
16. Frequently Asked Questions
17. Technical Overview
18. System Architecture
19. Frontend Components
20. Backend Components
21. Database Integration
22. Security Considerations
23. Testing Procedures
24. Troubleshooting Guide
25. Deployment Guide
26. Future Enhancements
27. Team Members

---

# 1. Introduction

KKK Cleaning Services is a technology-driven cleaning service platform designed to simplify the process of booking and managing professional cleaning services. The platform enables customers to conveniently schedule cleaning appointments while allowing administrators to efficiently manage operations through a centralized dashboard.

The system aims to provide a user-friendly experience while ensuring reliability, accessibility, and operational efficiency.

---

# 2. Project Overview

The KKK Cleaning Services platform was developed as a Technopreneurship Project that combines business processes with modern web technologies.

The system focuses on:

* Online booking
* Customer convenience
* Administrative management
* Service scheduling
* Operational monitoring

---

# 3. Business Background

KKK Cleaning Services was conceptualized to address the growing demand for convenient and accessible cleaning services.

Many households struggle to find reliable cleaning providers. The system bridges this gap by providing a centralized platform where customers can schedule services and receive professional assistance.

---

# 4. Vision

To become a trusted and innovative cleaning service provider that leverages technology to deliver convenience, quality, and customer satisfaction.

---

# 5. Mission

* Deliver reliable cleaning solutions.
* Simplify service booking through technology.
* Maintain high standards of service quality.
* Promote customer satisfaction.
* Support operational efficiency.

---

# 6. Core Values

## Professionalism

We maintain high standards in every service provided.

## Reliability

Customers can depend on us for timely and quality service.

## Integrity

We conduct business ethically and transparently.

## Innovation

We utilize technology to improve service delivery.

## Customer Focus

Customer satisfaction remains our highest priority.

---

# 7. Features

## Customer Features

### Home Page

Provides company information and service highlights.

### About Page

Displays mission, vision, and company values.

### Services Page

Showcases available cleaning services.

### Booking System

Allows customers to schedule appointments online.

### Contact Section

Enables customers to communicate with the business.

---

## Administrator Features

### Dashboard

Provides operational insights.

### Booking Management

Handles customer reservations.

### Customer Records

Stores customer information.

### Status Monitoring

Tracks booking progress.

---

# 8. User Roles

## Customer

Responsibilities:

* Browse services
* Schedule bookings
* Submit inquiries

## Administrator

Responsibilities:

* Manage bookings
* Monitor services
* Review customer information

---

# 9. Customer Guide

## Accessing the Website

1. Open the website.
2. Navigate through the menu.
3. Explore available services.

## Viewing Services

Customers can review:

* Sofa Cleaning
* Mattress Sanitization
* Rug Cleaning
* Upholstery Cleaning

## Requesting Services

Customers can proceed to the booking page and submit their preferred schedule.

---

# 10. Booking Process

### Step 1

Access the booking page.

### Step 2

Select a cleaning service.

### Step 3

Choose a preferred schedule.

### Step 4

Provide customer information.

### Step 5

Review booking details.

### Step 6

Submit the booking request.

### Step 7

Wait for confirmation.

---

# 11. Admin Guide

Administrators are responsible for overseeing the daily operations of the platform.

Main tasks include:

* Managing bookings
* Monitoring customers
* Updating statuses
* Reviewing reports

---

# 12. Dashboard Overview

The dashboard provides an overview of:

* Total bookings
* Pending requests
* Confirmed appointments
* Completed services
* Customer records

Benefits:

* Improved monitoring
* Faster decision-making
* Better operational visibility

---

# 13. Service Management

Administrators can:

* Add services
* Edit services
* Update descriptions
* Manage pricing

---

# 14. Customer Management

Customer records include:

* Name
* Contact Information
* Booking History
* Service Preferences

---

# 15. Booking Status Workflow

Possible booking statuses:

### Pending

Booking submitted.

### Confirmed

Booking approved.

### In Progress

Service currently being performed.

### Completed

Service successfully finished.

### Cancelled

Booking cancelled.

---

# 16. Frequently Asked Questions

### How do I book a service?

Navigate to the booking page and complete the booking form.

### Can I cancel my booking?

Yes, subject to company policies.

### How long does cleaning take?

Duration depends on the selected service.

### Do you provide cleaning materials?

Yes, professional cleaning equipment and supplies are provided.

---

# 17. Technical Overview

The project utilizes modern web technologies to provide a responsive and efficient platform.

Main objectives:

* Accessibility
* Performance
* Scalability
* Maintainability

---

# 18. System Architecture

The system consists of:

* Frontend Layer
* Backend Layer
* Database Layer
* Hosting Layer

---

# 19. Frontend Components

Key frontend sections:

* Navigation Bar
* Hero Section
* Services Section
* About Section
* Booking Form
* Dashboard Interface
* Footer

---

# 20. Backend Components

Backend responsibilities:

* Request Handling
* Routing
* Business Logic
* Authentication Support
* Data Processing

---

# 21. Database Integration

The system may integrate Firebase for:

* Customer Records
* Booking Information
* Service Management

Benefits:

* Real-time updates
* Cloud storage
* Scalability

---

# 22. Security Considerations

Security measures include:

* Input Validation
* Access Control
* Secure Data Storage
* User Authentication

---

# 23. Testing Procedures

### Functional Testing

Verify:

* Booking Submission
* Dashboard Access
* Service Display

### User Interface Testing

Verify:

* Responsive Layout
* Navigation
* Accessibility

### Performance Testing

Verify:

* Loading Speed
* System Stability

---

# 24. Troubleshooting Guide

## Website Not Loading

Possible Causes:

* Internet connectivity issues
* Hosting issues

## Booking Form Not Working

Possible Causes:

* Missing required fields
* Backend service interruption

## Dashboard Not Accessible

Possible Causes:

* Permission restrictions
* Authentication issues

---

### Server-side error: "Missing FIREBASE_SERVICE_ACCOUNT_KEY"

If you see an error like:

```
Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable.
```

Reason:
- The server-side code (used for SSR or admin APIs) expects a Firebase service account to be present as an environment variable. Vite will import server modules during dev/build which can cause this error early.

Fixes:
- If you're only working on UI/UX, avoid this by building and serving `dist/client` (see "Run only the UI").
- To work with server features, set the `FIREBASE_SERVICE_ACCOUNT_KEY` or `FIREBASE_SERVICE_ACCOUNT_KEY_B64` environment variable as described above.

Example (bash):

```bash
export FIREBASE_SERVICE_ACCOUNT_KEY="$(cat /path/to/serviceAccount.json)"
npm run dev
```

Or base64-encoded:

```bash
export FIREBASE_SERVICE_ACCOUNT_KEY_B64="$(base64 -w0 /path/to/serviceAccount.json)"
npm run dev
```

---

# 25. Deployment & Developer Guide

This section explains how to set up the project for development, how to run only the UI (client-side) without loading server-side modules like Firebase Admin, how to prepare for production, and common deployment options.

## Developer checklist (quick)

- Install dependencies
- Set required environment variables for server features (optional if you only run the UI)
- Build the project (to produce `dist/client`)
- Serve `dist/client` statically to view the UI-only bundle locally

## Local development (full app)

Install dependencies:

```bash
npm install
```

Run development server (this starts Vite and may load server-side modules used for SSR):

```bash
npm run dev
```

Notes:
- The server-side code (e.g. `src/lib/firebase.ts`) may require environment variables (see below). If those are not present, server-side rendering will throw and the dev server may show an overlay error.
- For day-to-day UI work you usually don't need full server features; see "Run UI-only" below.

## Run only the UI (recommended for pure UI/UX work)

If you want to work on the client bundle (styles, components, static pages) without starting the server or triggering server-only imports (like `firebase-admin`), build the client bundle and serve the static `dist/client` directory. This avoids Node server imports and is quick for visual work.

Steps:

1. Build the project:

```bash
npm run build
```

2. Serve the client bundle (pick one):

- Using Node (npx http-server):

```bash
npx http-server dist/client -p 5000
# open http://localhost:5000
```

- Using `serve` (another popular static server):

```bash
npx serve dist/client -l 5000
# open http://localhost:5000
```

- Using Python (if you have Python 3):

```bash
cd dist/client
python -m http.server 5000
# open http://localhost:5000
```

This will host the client-side SPA only and will not execute server-side code that requires secrets.

## Environment variables (server-side)

The project may require a Firebase service account for admin operations. The server expects an environment variable named `FIREBASE_SERVICE_ACCOUNT_KEY` (raw JSON) or `FIREBASE_SERVICE_ACCOUNT_KEY_B64` (base64-encoded JSON), depending on the code in `src/lib/firebase.ts`.

Set the raw JSON in bash (development):

```bash
export FIREBASE_SERVICE_ACCOUNT_KEY="$(cat /path/to/serviceAccount.json)"
npm run dev
```

Or set a base64-encoded variable to avoid quoting/newline issues:

```bash
export FIREBASE_SERVICE_ACCOUNT_KEY_B64="$(base64 -w0 /path/to/serviceAccount.json)"
npm run dev
```

If you use `serviceAccount.json` file locally for convenience, add it to `.gitignore`:

```bash
echo "serviceAccount.json" >> .gitignore
```

Important notes:
- Never commit real secrets to the repository. Use your host/CI secret storage for production (Vercel/Netlify/Cloud consoles etc.).
- For production deployments, set the secret via the host's secret manager or environment variable configuration.

## Production build and preview

Build the production bundles:

```bash
npm run build
```

Preview (Vite preview attempts to run a server and may pick up server code):

```bash
npm run preview
```

If `npm run preview` triggers server-side imports you don't want locally, use the static-serving instructions above to preview the client.

## Hosting options

Pick a static host for the client-only deployment, or a platform that supports Node for server features:

- Static client only: Vercel (static site), Netlify, GitHub Pages, Amazon S3 + CloudFront
- Full stack / server: Vercel (Serverless functions), Cloud Run, Heroku, DigitalOcean App Platform

When deploying server features, make sure to configure your secrets in the host's environment variable / secret UI.

---

# 26. Future Enhancements

Planned improvements include:

* Email notifications
* SMS notifications
* Online payment integration
* Customer reviews
* Mobile application support
* AI-assisted customer service
* Advanced analytics
* Automated scheduling

---

# 27. Team Members

### Joaquin Angelo Estalilla

Project Lead / Developer

### Rhome Louie Saringayat

Operations and Marketing Lead

### Hezekiah Gutay

Customer Support and Administrative Lead

---

# Conclusion

KKK Cleaning Services demonstrates how technology can be utilized to improve traditional service-based businesses. Through online booking, administrative management, and customer-focused features, the platform provides a foundation for efficient and scalable cleaning service operations.

**KKK Cleaning Services — From Kadiri to Sarap.**


