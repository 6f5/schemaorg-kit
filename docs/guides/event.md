---
title: Event
parent: Guides
nav_order: 4
---

# Event Rich Results
{: .no_toc }

Event structured data generates rich search results with date, time, location, and ticket links — ideal for concerts, workshops, sports, and online events.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Required Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | Event title |
| `startDate` | `string` | ISO 8601 with timezone (`2025-06-20T19:00:00-07:00`) |
| `location` | `Place \| VirtualLocation` | Physical or online location |

## Recommended Fields

| Field | Type | Notes |
|-------|------|-------|
| `endDate` | `string` | End date/time |
| `image` | `string \| string[]` | Event image(s) |
| `description` | `string` | Event description |
| `offers` | `Offer` | Ticket pricing |
| `organizer` | `Person \| Organization` | Who's running the event |
| `performer` | `Person \| Organization` | Artists, speakers |
| `eventStatus` | `EventStatusType` | Scheduled, cancelled, postponed |
| `eventAttendanceMode` | `EventAttendanceMode` | Offline, online, mixed |

---

## In-Person Event

```ts
import { createEvent } from 'schemaorg-kit';

const concert = createEvent({
  name: 'The Mountain Goats — Live in Concert',
  startDate: '2025-08-15T20:00:00-07:00',
  endDate: '2025-08-15T23:00:00-07:00',
  eventStatus: 'EventScheduled',          // → https://schema.org/EventScheduled
  eventAttendanceMode: 'OfflineEventAttendanceMode',  // → https://schema.org/OfflineEventAttendanceMode
  image: 'https://tickets.example.com/events/mountain-goats.jpg',
  description: 'An intimate evening with The Mountain Goats featuring songs from their 30-year catalog.',
  location: {
    '@type': 'Place',
    name: 'The Fillmore',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1805 Geary Blvd',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94115',
      addressCountry: 'US',
    },
  },
  offers: {
    '@type': 'Offer',
    price: 35,
    priceCurrency: 'USD',
    availability: 'InStock',
    url: 'https://tickets.example.com/buy/mountain-goats-fillmore',
    validFrom: '2025-05-01',
  },
  organizer: {
    '@type': 'Organization',
    name: 'Live Nation West',
    url: 'https://livenation.com',
  },
  performer: {
    '@type': 'Person',
    name: 'John Darnielle',
  },
});
```

---

## Online Event

```ts
import { createEvent } from 'schemaorg-kit';

const webinar = createEvent({
  name: 'Introduction to Machine Learning — Free Webinar',
  startDate: '2025-07-10T14:00:00Z',
  endDate: '2025-07-10T15:30:00Z',
  eventStatus: 'EventScheduled',
  eventAttendanceMode: 'OnlineEventAttendanceMode',   // → https://schema.org/OnlineEventAttendanceMode
  location: {
    '@type': 'VirtualLocation',
    url: 'https://zoom.us/j/123456789',
  },
  image: 'https://example.com/webinar-ml-intro.jpg',
  offers: {
    '@type': 'Offer',
    price: 0,
    priceCurrency: 'USD',
    availability: 'InStock',
    url: 'https://example.com/webinar/register',
  },
  organizer: {
    '@type': 'Organization',
    name: 'Tech Academy',
    url: 'https://techacademy.io',
  },
});
```

---

## Mixed Attendance (Hybrid Event)

```ts
const hybrid = createEvent({
  name: 'Annual Developer Summit 2025',
  startDate: '2025-09-20T09:00:00-04:00',
  eventAttendanceMode: 'MixedEventAttendanceMode',    // → https://schema.org/MixedEventAttendanceMode
  location: [
    {
      '@type': 'Place',
      name: 'Boston Convention Center',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Boston',
        addressRegion: 'MA',
        addressCountry: 'US',
      },
    },
    {
      '@type': 'VirtualLocation',
      url: 'https://devsummit.example.com/live',
    },
  ],
});
```

---

## EventStatus Values

| Value | Meaning |
|-------|---------|
| `"EventScheduled"` | Event is planned as normal |
| `"EventPostponed"` | Postponed, new date TBD |
| `"EventRescheduled"` | Moved to a new date |
| `"EventCancelled"` | Cancelled entirely |
| `"EventMovedOnline"` | Converted to online-only |

These values automatically expand to `https://schema.org/EventScheduled`, etc.

---

## Cancelled / Rescheduled Events

```ts
// Cancelled event
const cancelled = createEvent({
  name: 'Summer Music Festival',
  startDate: '2025-07-04T12:00:00-05:00',
  eventStatus: 'EventCancelled',
  location: { '@type': 'Place', name: 'Grant Park', address: { ... } },
});

// Rescheduled event
const rescheduled = createEvent({
  name: 'Summer Music Festival',
  startDate: '2025-08-15T12:00:00-05:00',  // new date
  previousStartDate: '2025-07-04',          // original date
  eventStatus: 'EventRescheduled',
  location: { '@type': 'Place', name: 'Grant Park', address: { ... } },
});
```

---

## Common Mistakes

{: .warning }
> **Always include the timezone offset.** `"2025-08-15T20:00:00"` (no timezone) may cause errors. Use `"-07:00"` or `"Z"` for UTC.

{: .warning }
> **`location` is required.** Even for online events — use `VirtualLocation` with a `url`.

{: .tip }
> Multiple `offers` entries with different `price` values (e.g., GA vs VIP) can be passed as an array.
