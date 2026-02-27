---
title: Course
parent: Guides
nav_order: 12
---

# Course Rich Results
{: .no_toc }

`Course` structured data surfaces your courses in Google Search with provider name, duration, price, and a description — helping learners find your content in organic results.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Required Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | Course title |
| `description` | `string` | Course description |
| `provider` | `Organization` | Who offers the course |

## Recommended Fields

| Field | Type | Notes |
|-------|------|-------|
| `hasCourseInstance` | `CourseInstance[]` | Scheduled runs of the course |
| `offers` | `Offer` | Pricing |
| `educationalLevel` | `string` | Beginner, Intermediate, Advanced |
| `about` | `string \| Thing[]` | Topics covered |
| `teaches` | `string` | Learning outcomes |
| `coursePrerequisites` | `string \| Course[]` | Prior knowledge required |
| `totalHistoricalEnrollment` | `number` | Total students enrolled |

---

## CourseInstance Fields

| Field | Type | Notes |
|-------|------|-------|
| `courseMode` | `string` | `"online"`, `"onsite"`, `"blended"` |
| `startDate` | `string` | Session start date |
| `endDate` | `string` | Session end date |
| `instructor` | `Person` | Instructor for this run |
| `location` | `Place` | Physical location (if onsite) |

---

## Self-Paced Online Course

```ts
import { createCourse } from 'schemaorg-kit';

const course = createCourse({
  name: 'Complete TypeScript Bootcamp: Zero to Hero',
  description: 'Master TypeScript from the basics to advanced patterns. Build real-world applications with React, Node.js, and modern tooling. Includes 60+ exercises and 5 full projects.',
  provider: {
    '@type': 'Organization',
    name: 'Code Academy Pro',
    sameAs: 'https://codeacademypro.com',
  },
  offers: {
    '@type': 'Offer',
    price: 49.99,
    priceCurrency: 'USD',
    availability: 'InStock',
    url: 'https://codeacademypro.com/courses/typescript-bootcamp',
    priceValidUntil: '2025-12-31',
  },
  educationalLevel: 'Intermediate',
  teaches: 'TypeScript, Generics, Decorators, React with TypeScript, Node.js with TypeScript',
  coursePrerequisites: 'Basic JavaScript knowledge',
  hasCourseInstance: [
    {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT20H',   // 20 hours total
      instructor: {
        '@type': 'Person',
        name: 'Dr. Sarah Chen',
        url: 'https://codeacademypro.com/instructors/sarah-chen',
      },
    },
  ],
  totalHistoricalEnrollment: 15400,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.8,
    ratingCount: 3240,
    bestRating: 5,
  },
  image: 'https://codeacademypro.com/courses/typescript-bootcamp.jpg',
});
```

---

## In-Person Course with Scheduled Sessions

```ts
import { createCourse } from 'schemaorg-kit';

const course = createCourse({
  name: 'AWS Solutions Architect — Classroom Training',
  description: 'Hands-on AWS training covering compute, storage, networking, and security services.',
  provider: {
    '@type': 'Organization',
    name: 'Cloud Training Institute',
    sameAs: 'https://cloudtraining.example',
  },
  offers: {
    '@type': 'Offer',
    price: 1995,
    priceCurrency: 'USD',
  },
  hasCourseInstance: [
    {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      startDate: '2025-07-14',
      endDate: '2025-07-18',
      location: {
        '@type': 'Place',
        name: 'Cloud Training Institute — NYC',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'New York',
          addressRegion: 'NY',
          addressCountry: 'US',
        },
      },
      instructor: {
        '@type': 'Person',
        name: 'James Rodriguez',
      },
      offers: {
        '@type': 'Offer',
        price: 1995,
        priceCurrency: 'USD',
        availability: 'LimitedAvailability',
        url: 'https://cloudtraining.example/register/aws-july-2025',
      },
    },
    {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      startDate: '2025-09-08',
      endDate: '2025-09-12',
      location: {
        '@type': 'Place',
        name: 'Cloud Training Institute — Chicago',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Chicago',
          addressRegion: 'IL',
          addressCountry: 'US',
        },
      },
    },
  ],
});
```

---

## Course Carousel

Show multiple courses in a search carousel:

```ts
import { createCarousel, createCourse } from 'schemaorg-kit';

const carousel = createCarousel([
  createCourse({
    name: 'TypeScript Fundamentals',
    description: 'Learn TypeScript from scratch.',
    provider: { '@type': 'Organization', name: 'Code Academy Pro' },
  }),
  createCourse({
    name: 'React with TypeScript',
    description: 'Build type-safe React applications.',
    provider: { '@type': 'Organization', name: 'Code Academy Pro' },
  }),
  createCourse({
    name: 'Node.js with TypeScript',
    description: 'Server-side TypeScript development.',
    provider: { '@type': 'Organization', name: 'Code Academy Pro' },
  }),
]);
```

---

## Common Mistakes

{: .tip }
> Include `hasCourseInstance` even for self-paced courses — use `courseMode: "online"` and omit `startDate`/`endDate` for evergreen content.

{: .tip }
> `courseWorkload` (in `CourseInstance`) is the total expected study time in ISO 8601 duration format. This displays in search results and helps learners plan.
