---
title: API Reference
nav_order: 5
has_children: true
---

# API Reference

Complete reference for every export from `schemaorg-kit`.

## Import paths

All exports are available from the package root:

```ts
import {
  createArticle,
  createProduct,
  createGraph,
  AggregateRatingSchema,
  // ... etc
} from 'schemaorg-kit';
```

## Reference sections

| Section | Contents |
|---------|----------|
| [Core](core) | `SchemaNode`, `makeFactory`, `SchemaGraph`, `createGraph`, `schema()` |
| [Things](things) | Person, Organization, Product, Event, Place, LocalBusiness, Movie |
| [Creative Works](creative-works) | Article, WebPage, WebSite, Dataset, Recipe, Course, SoftwareApplication, MathSolver, VideoObject |
| [Intangibles & Lodging](intangibles) | FAQPage, QAPage, Quiz, JobPosting, DiscussionForumPosting, ItemList, ProfilePage, VacationRental |
| [Shared Types](shared) | PostalAddress, GeoCoordinates, ImageObject, Offer, Rating, Review, ContactPoint, OpeningHoursSpecification, etc. |
| [Helpers](helpers) | createBreadcrumbList, createFAQPage, createCarousel, createPaywalledArticle |
