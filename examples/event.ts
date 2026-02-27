/**
 * event.ts — Event structured data for concerts, online events, and rescheduled events
 *
 * Demonstrates: in-person events, online events, mixed attendance,
 * event status enums, ticketing via Offer, and @graph.
 */

import {
  createEvent,
  createOrganization,
  createGraph,
  createBreadcrumbList,
  PostalAddressSchema,
} from "../src/index";

// ─── In-person concert ────────────────────────────────────────────────────────

const concert = createEvent({
  name: "Midnight Jazz Festival",
  startDate: "2025-08-15T20:00:00-07:00",
  endDate: "2025-08-15T23:30:00-07:00",
  eventStatus: "EventScheduled",
  eventAttendanceMode: "OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "The Blue Note",
    address: PostalAddressSchema.parse({
      streetAddress: "131 W 3rd St",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10012",
      addressCountry: "US",
    }),
    url: "https://bluenotejazz.com",
  },
  description: "An unforgettable evening of jazz featuring world-renowned musicians.",
  image: [
    "https://jazzfest.example.com/img/festival-1200x675.jpg",
    "https://jazzfest.example.com/img/festival-1200x900.jpg",
  ],
  offers: {
    "@type": "Offer",
    price: 75,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://jazzfest.example.com/tickets",
    validFrom: "2025-03-01",
  },
  performer: [
    { "@type": "Person", name: "Marcus Whitfield" },
    { "@type": "Person", name: "Elena Vasquez" },
  ],
  organizer: createOrganization({
    name: "Blue Note Events",
    url: "https://bluenotejazz.com",
  }).toObject(),
});

console.log("=== In-person Concert ===");
console.log(concert.toScript());

// ─── Online webinar ───────────────────────────────────────────────────────────

const webinar = createEvent({
  name: "Build Scalable APIs with TypeScript — Free Webinar",
  startDate: "2025-09-10T18:00:00Z",
  endDate: "2025-09-10T19:30:00Z",
  eventStatus: "EventScheduled",
  eventAttendanceMode: "OnlineEventAttendanceMode",
  location: {
    "@type": "VirtualLocation",
    url: "https://tech.example.com/webinar/register",
    name: "Zoom Webinar",
  },
  description: "Learn how to design scalable, type-safe REST APIs using TypeScript and modern tooling.",
  image: "https://tech.example.com/img/webinar-cover.jpg",
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://tech.example.com/webinar/register",
  },
  organizer: { "@type": "Organization", name: "TypeScript Academy", url: "https://tech.example.com" },
  inLanguage: "en-US",
  isAccessibleForFree: true,
});

console.log("\n=== Online Webinar (free) ===");
console.log(webinar.toJsonLd());

// ─── Rescheduled event ────────────────────────────────────────────────────────

const rescheduled = createEvent({
  name: "Summer Music Festival",
  startDate: "2025-09-20T14:00:00-05:00",   // new date
  previousStartDate: "2025-07-04T14:00:00-05:00",
  eventStatus: "EventRescheduled",
  eventAttendanceMode: "OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Riverside Park",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chicago",
      addressRegion: "IL",
      addressCountry: "US",
    },
  },
  description: "Originally scheduled for July 4th, moved to September 20th due to weather.",
  image: "https://musicfest.example.com/img/cover.jpg",
  offers: {
    "@type": "Offer",
    price: 45,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://musicfest.example.com/tickets",
  },
  organizer: { "@type": "Organization", name: "Chicago Music Events" },
});

console.log("\n=== Rescheduled Event ===");
console.log(rescheduled.toJsonLd());

// ─── Sold-out event ───────────────────────────────────────────────────────────

const soldOut = createEvent({
  name: "Comedy Night with Sarah Bloom",
  startDate: "2025-10-05T20:00:00-04:00",
  eventStatus: "EventScheduled",
  eventAttendanceMode: "OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Laugh Factory NYC",
    address: {
      "@type": "PostalAddress",
      addressLocality: "New York",
      addressRegion: "NY",
      addressCountry: "US",
    },
  },
  image: "https://laughfactory.example.com/sarah-bloom.jpg",
  offers: {
    "@type": "Offer",
    price: 35,
    priceCurrency: "USD",
    availability: "https://schema.org/SoldOut",
    url: "https://laughfactory.example.com/tickets/sarah-bloom",
  },
  performer: { "@type": "Person", name: "Sarah Bloom" },
  organizer: { "@type": "Organization", name: "Laugh Factory" },
});

console.log("\n=== Sold-out Event ===");
console.log(soldOut.toJsonLd());

// ─── @graph for an event page ─────────────────────────────────────────────────

const breadcrumb = createBreadcrumbList([
  { name: "Home", url: "https://jazzfest.example.com" },
  { name: "Events", url: "https://jazzfest.example.com/events" },
  { name: "Midnight Jazz Festival" },
]);

const graph = createGraph([concert, breadcrumb]);

console.log("\n=== Event page @graph ===");
console.log(graph.toScript());
