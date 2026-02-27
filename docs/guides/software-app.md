---
title: Software App
parent: Guides
nav_order: 10
---

# Software Application Rich Results
{: .no_toc }

`SoftwareApplication` structured data enables star ratings, price, and platform information in Google Search results — making your app listing stand out in organic results.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Required Fields

At least **one of** these must be present:
- `aggregateRating`
- `review` (at least one)

Plus:
- `name`
- `offers.price` (or indicate it's free with `price: 0`)
- `operatingSystem`
- `applicationCategory`

---

## Application Types

| Factory | `@type` |
|---------|---------|
| `createSoftwareApplication` | `SoftwareApplication` |
| `createMobileApplication` | `MobileApplication` |
| `createWebApplication` | `WebApplication` |

---

## Application Categories

Common values for `applicationCategory`:

`GameApplication`, `SocialNetworkingApplication`, `TravelApplication`, `ShoppingApplication`, `SportsApplication`, `LifestyleApplication`, `BusinessApplication`, `DesignApplication`, `DeveloperApplication`, `DriverApplication`, `EducationalApplication`, `HealthApplication`, `FinanceApplication`, `SecurityApplication`, `BrowserApplication`, `CommunicationApplication`, `DesktopEnhancementApplication`, `EntertainmentApplication`, `MultimediaApplication`, `HomeApplication`, `UtilitiesApplication`, `ReferenceApplication`

---

## Web App

```ts
import { createWebApplication } from 'schemaorg-kit';

const app = createWebApplication({
  name: 'Taskflow',
  description: 'A lightweight project management tool for small teams. Features kanban boards, time tracking, and Slack integration.',
  url: 'https://taskflow.app',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: 0,
    priceCurrency: 'USD',
    description: 'Free plan: up to 5 projects and 3 users',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.6,
    ratingCount: 1840,
    bestRating: 5,
    worstRating: 1,
  },
  screenshot: 'https://taskflow.app/screenshots/kanban.png',
  featureList: 'Kanban boards, Time tracking, Slack integration, Export to CSV',
  softwareVersion: '3.2.1',
});
```

---

## Mobile App (iOS + Android)

```ts
import { createMobileApplication } from 'schemaorg-kit';

const iosApp = createMobileApplication({
  name: 'Taskflow Mobile',
  description: 'Manage your projects on the go with Taskflow Mobile.',
  operatingSystem: 'iOS',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    price: 4.99,
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.8,
    ratingCount: 12400,
    bestRating: 5,
  },
  installUrl: 'https://apps.apple.com/app/taskflow/id123456789',
  softwareVersion: '5.1.0',
  datePublished: '2025-01-15',
});

const androidApp = createMobileApplication({
  name: 'Taskflow Mobile',
  description: 'Manage your projects on the go with Taskflow Mobile.',
  operatingSystem: 'Android',
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    price: 0,    // Free on Android
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.7,
    ratingCount: 28000,
    bestRating: 5,
  },
  installUrl: 'https://play.google.com/store/apps/details?id=com.taskflow.app',
});
```

---

## Game Application

```ts
import { createSoftwareApplication } from 'schemaorg-kit';

const game = createSoftwareApplication({
  '@type': 'VideoGame',
  name: 'Pixel Quest',
  description: 'A retro-style RPG adventure with over 40 hours of gameplay.',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Windows, macOS, Linux',
  offers: {
    '@type': 'Offer',
    price: 19.99,
    priceCurrency: 'USD',
    availability: 'InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: 4.5,
    ratingCount: 3200,
    bestRating: 5,
  },
  screenshot: [
    'https://pixelquest.io/screenshots/gameplay-1.jpg',
    'https://pixelquest.io/screenshots/gameplay-2.jpg',
  ],
});
```

---

## Common Mistakes

{: .warning }
> **Price must be set.** Either `price: 0` (free) or the actual price. Omitting the price may disqualify the app from rich results.

{: .tip }
> Use `aggregateRating` for app store ratings (thousands of ratings). Use `review` for featured user reviews.

{: .tip }
> For cross-platform apps, create separate schema nodes per platform and combine them in a `@graph`. Google associates each with the correct app store listing.
