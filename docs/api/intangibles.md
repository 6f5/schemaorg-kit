---
title: Intangibles & Lodging
parent: API Reference
nav_order: 4
---

# Intangibles & Lodging
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## createFAQPage / FAQPageSchema

```ts
import { createFAQPage } from 'schemaorg-kit'; // ergonomic helper
import { FAQPageSchema } from 'schemaorg-kit'; // raw schema
```

Two ways to create FAQ structured data:

### Ergonomic helper (recommended)

```ts
import { createFAQPage } from 'schemaorg-kit';

const faq = createFAQPage([
  {
    question: 'What is your return policy?',
    answer: 'We offer 30-day hassle-free returns on all items.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes! We ship to over 50 countries. <a href="/shipping">See all destinations</a>.',
  },
]);

faq.toScript(); // ready to inject in <head>
```

The helper auto-wraps each item in `Question` / `Answer` entities.

### Raw schema

```ts
import { FAQPageSchema } from 'schemaorg-kit';

const faq = FAQPageSchema.parse({
  name: 'FAQ',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is your return policy?',
      acceptedAnswer: { '@type': 'Answer', text: '30-day returns.' },
    },
  ],
});
```

### Notes

- Google allows limited HTML in answer `text`: `<h1>`–`<h6>`, `<p>`, `<div>`, `<ol>`, `<ul>`, `<li>`, `<b>`, `<strong>`, `<i>`, `<em>`, `<br>`, `<a>`
- As of 2024, Google restricts FAQ rich results to authoritative government and health sites
- The `createFAQPage` import from `schemaorg-kit` is the **ergonomic helper** from `helpers/faq.ts`; there is also a raw `createFAQPage` factory exported from the QAPage module (use `FAQPageSchema.parse()` directly if you need the raw version)

---

## createQAPage / createQuestion

```ts
import { createQAPage, createQuestion, AnswerSchema } from 'schemaorg-kit';
```

For community Q&A pages (StackOverflow-style). `mainEntity` is a single `Question`.

```ts
const page = createQAPage({
  name: 'How do I center a div in CSS?',
  url: 'https://forum.example.com/q/how-to-center-div',
  mainEntity: {
    '@type': 'Question',
    name: 'How do I center a div in CSS?',
    text: 'I\'ve tried margin: auto but it doesn\'t work vertically.',
    answerCount: 12,
    upvoteCount: 47,
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Use flexbox: set the parent to `display: flex; justify-content: center; align-items: center;`',
      upvoteCount: 89,
      author: { '@type': 'Person', name: 'cssmaster' },
    },
  },
});
```

### createQuestion

```ts
const question = createQuestion({
  name: 'Is TypeScript better than JavaScript?',
  text: 'For large-scale projects, should I choose TypeScript?',
  acceptedAnswer: AnswerSchema.parse({
    text: 'For large projects: yes. TypeScript catches bugs at compile time.',
  }),
  suggestedAnswer: [
    AnswerSchema.parse({ text: 'It depends on team familiarity.', upvoteCount: 12 }),
  ],
  answerCount: 8,
});
```

---

## createQuiz

```ts
import { createQuiz } from 'schemaorg-kit';
```

For Google's [Education Q&A](https://developers.google.com/search/docs/appearance/structured-data/education-q-a) feature. Helps students discover practice questions.

```ts
const quiz = createQuiz({
  name: 'AP Biology: Cell Division',
  educationalLevel: 'high school',
  about: { '@type': 'DefinedTerm', name: 'Mitosis' },
  educationalAlignment: {
    '@type': 'AlignmentObject',
    alignmentType: 'educationalSubject',
    targetName: 'Biology',
  },
  hasPart: [
    {
      '@type': 'Question',
      name: 'During which phase do chromosomes align at the cell equator?',
      acceptedAnswer: { '@type': 'Answer', text: 'Metaphase' },
      suggestedAnswer: [
        { '@type': 'Answer', text: 'Prophase' },
        { '@type': 'Answer', text: 'Anaphase' },
        { '@type': 'Answer', text: 'Telophase' },
      ],
    },
  ],
});
```

---

## createJobPosting

```ts
import { createJobPosting, EmploymentType } from 'schemaorg-kit';
```

Google required: `title`, `description`, `hiringOrganization`, `datePosted`, and either `jobLocation` or `jobLocationType`.

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `title` | `string` | **Required** — job title |
| `description` | `string` | **Required** — HTML allowed |
| `hiringOrganization` | `Organization` | **Required** — employer |
| `datePosted` | `string` | **Required** — ISO 8601 |
| `validThrough` | `string?` | Application deadline |
| `jobLocation` | `Place?` | Office location |
| `jobLocationType` | `string?` | `"TELECOMMUTE"` for remote |
| `applicantLocationRequirements` | `AdministrativeArea?` | Location restrictions for remote |
| `employmentType` | `EmploymentType \| EmploymentType[]?` | See below |
| `baseSalary` | `MonetaryAmount?` | Salary info |
| `totalJobOpenings` | `number?` | Number of open positions |
| `experienceRequirements` | `string?` | Required experience |
| `educationRequirements` | `string?` | Required education |
| `skills` | `string?` | Required skills |
| `responsibilities` | `string?` | Job responsibilities |
| `industry` | `string?` | Industry sector |
| `occupationalCategory` | `string?` | O*NET SOC code |
| `workHours` | `string?` | e.g. "40 hours/week" |
| `jobBenefits` | `string?` | Benefits description |
| `incentiveCompensation` | `string?` | Bonus/commission info |
| `salaryCurrency` | `string?` | Currency code |

### EmploymentType values

`"FULL_TIME"`, `"PART_TIME"`, `"CONTRACTOR"`, `"TEMPORARY"`, `"INTERN"`, `"VOLUNTEER"`, `"PER_DIEM"`, `"OTHER"`

### Salary example

```ts
import { MonetaryAmountSchema } from 'schemaorg-kit';

const job = createJobPosting({
  title: 'Senior Software Engineer',
  description: '<p>Join our engineering team...</p>',
  hiringOrganization: { '@type': 'Organization', name: 'Acme', sameAs: 'https://acme.com' },
  datePosted: '2025-03-01',
  validThrough: '2025-06-01',
  employmentType: 'FULL_TIME',
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      addressCountry: 'US',
    },
  },
  baseSalary: MonetaryAmountSchema.parse({
    currency: 'USD',
    value: {
      '@type': 'QuantitativeValue',
      minValue: 160000,
      maxValue: 220000,
      unitText: 'YEAR',
    },
  }),
});
```

---

## createDiscussionForumPosting

```ts
import { createDiscussionForumPosting } from 'schemaorg-kit';
```

For [Discussion Forum](https://developers.google.com/search/docs/appearance/structured-data/discussion-forum) rich results.

Google required: `headline`, `author`. Google recommended: `datePublished`, `url`.

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `headline` | `string` | **Required** — post title |
| `author` | `Person \| Organization` | **Required** — post author |
| `text` | `string?` | Post body |
| `datePublished` | `string?` | ISO 8601 |
| `dateModified` | `string?` | ISO 8601 |
| `url` | `string?` | Permalink |
| `comment` | `Comment[]?` | Threaded replies |
| `commentCount` | `number?` | Total comment count |
| `upvoteCount` | `number?` | Upvotes |
| `downvoteCount` | `number?` | Downvotes |
| `image` | `string \| ImageObject?` | Post image |
| `creativeWorkStatus` | `string?` | `"published"`, `"draft"`, `"deleted"` |
| `mainEntityOfPage` | `string \| object?` | Page this is the main entity of |
| `sharedContent` | `object?` | Reposted content |
| `interactionStatistic` | `InteractionCounter \| []?` | Like/share counts |
| `inLanguage` | `string?` | Language |

---

## createItemList

```ts
import { createItemList } from 'schemaorg-kit';
```

For Carousel rich results (list of items the same type). Google required: `itemListElement` with at least 2 items.

```ts
const list = createItemList({
  name: 'Top Articles of 2025',
  itemListElement: [
    { '@type': 'ListItem', position: 1, url: 'https://example.com/article-1' },
    { '@type': 'ListItem', position: 2, url: 'https://example.com/article-2' },
    { '@type': 'ListItem', position: 3, url: 'https://example.com/article-3' },
  ],
});
```

For nested entity carousels, use the [`createCarousel` helper](helpers#createcarousel) instead.

---

## createProfilePage

```ts
import { createProfilePage } from 'schemaorg-kit';
```

For [Profile Page](https://developers.google.com/search/docs/appearance/structured-data/profile-page) rich results. The `mainEntity` links the page to its subject (Person or Organization).

### Fields

Extends `WebPageSchema`, plus:

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string?` | Page title |
| `url` | `string?` | Profile URL |
| `mainEntity` | `Person \| Organization?` | The profile subject |
| `datePublished` | `string?` | When profile was created |
| `dateModified` | `string?` | Last updated |

```ts
const profile = createProfilePage({
  '@id': 'https://example.com/u/alice#profilepage',
  name: 'Alice Chen — Developer',
  url: 'https://example.com/u/alice',
  datePublished: '2023-01-01',
  dateModified: '2025-04-10',
  mainEntity: {
    '@type': 'Person',
    '@id': 'https://example.com/u/alice#person',
    name: 'Alice Chen',
    sameAs: ['https://github.com/alice', 'https://linkedin.com/in/alice-chen'],
  },
});
```

---

## createVacationRental

```ts
import { createVacationRental } from 'schemaorg-kit';
```

Extends `LocalBusiness`. Adds lodging-specific fields for [Vacation Rental](https://developers.google.com/search/docs/appearance/structured-data/vacation-rental) rich results.

### Additional fields (beyond LocalBusiness)

| Field | Type | Notes |
|-------|------|-------|
| `petsAllowed` | `boolean?` | Dogs/cats welcome? |
| `checkinTime` | `string?` | Check-in time `"HH:mm:ss"` |
| `checkoutTime` | `string?` | Check-out time `"HH:mm:ss"` |
| `numberOfRooms` | `number?` | Total bedrooms |
| `occupancy` | `QuantitativeValue?` | Min/max guests |
| `amenityFeature` | `LocationFeatureSpecification[]?` | Pool, WiFi, etc. |
| `starRating` | `Rating?` | Official star rating |
| `leaseLength` | `Duration \| QuantitativeValue?` | Minimum stay |
| `floorSize` | `QuantitativeValue?` | Property size |
| `brand` | `string \| Brand \| Organization?` | Property brand/chain |
| `knowsLanguage` | `string \| string[]?` | Host languages (ISO 639-1) |
| `additionalType` | `string?` | `"EntirePlace"`, `"PrivateRoom"`, `"SharedRoom"` |
| `containsPlace` | `Accommodation \| []?` | Units within the property |

```ts
const rental = createVacationRental({
  name: 'Beachfront Villa with Private Pool',
  url: 'https://rentals.example.com/villa-sunset',
  address: { '@type': 'PostalAddress', addressLocality: 'Maui', addressCountry: 'US' },
  checkinTime: '15:00:00',
  checkoutTime: '11:00:00',
  petsAllowed: false,
  numberOfRooms: 4,
  occupancy: { '@type': 'QuantitativeValue', maxValue: 8 },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private Pool', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Ocean View', value: true },
  ],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: 4.9, reviewCount: 156, bestRating: 5 },
  offers: { '@type': 'Offer', price: 650, priceCurrency: 'USD', description: 'Per night' },
});
```

---

## createLanguage / createPronounceableText

```ts
import { createLanguage, createPronounceableText } from 'schemaorg-kit';
```

Helper types for multilingual content.

```ts
const lang = createLanguage({ name: 'Spanish', alternateName: 'Español' });
// { "@type": "Language", "name": "Spanish" }

const pronounceable = createPronounceableText({
  textValue: 'San José',
  inLanguage: 'es',
  phoneticText: '/san xoˈse/',
});
```
