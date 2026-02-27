---
title: Creative Works
parent: API Reference
nav_order: 3
---

# Creative Works
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## CreativeWork — Base Type

All creative work types share these base fields (inherited from `ThingSchema` + `CreativeWorkSchema`):

| Field | Type | Notes |
|-------|------|-------|
| `author` | `string \| Person \| Organization?` | Content author |
| `publisher` | `string \| Person \| Organization?` | Publisher |
| `datePublished` | `string?` | ISO 8601 publication date |
| `dateModified` | `string?` | ISO 8601 last-modified date |
| `headline` | `string?` (max 110 chars) | Article headline |
| `keywords` | `string \| string[]?` | Topics |
| `inLanguage` | `string \| Language?` | BCP 47, e.g. `"en-US"` |
| `license` | `string?` (URL) | Content license |
| `thumbnailUrl` | `string?` (URL) | Thumbnail image |
| `isAccessibleForFree` | `boolean?` | For paywalled content |
| `image` | `string \| ImageObject \| []?` | Representative image(s) |
| `hasPart` | `object[]?` | Sub-parts (for paywalls) |
| `isPartOf` | `object?` | Parent work |
| `text` | `string?` | Full text content |
| `abstract` | `string?` | Summary |
| `encodingFormat` | `string?` | MIME type |
| `contentUrl` | `string?` | Direct URL to content |
| `copyrightYear` | `number?` | Copyright year |
| `copyrightHolder` | `Person \| Organization?` | Copyright holder |

---

## createArticle / createNewsArticle / createBlogPosting

```ts
import { createArticle, createNewsArticle, createBlogPosting } from 'schemaorg-kit';
```

| Factory | `@type` | Google Rich Result |
|---------|---------|-------------------|
| `createArticle` | `"Article"` | Top Stories, general article |
| `createNewsArticle` | `"NewsArticle"` | Top Stories, AMP |
| `createBlogPosting` | `"BlogPosting"` | General article |

### Article-specific fields

| Field | Type | Notes |
|-------|------|-------|
| `articleBody` | `string?` | Full article text |
| `articleSection` | `string?` | Section/category |
| `wordCount` | `number?` | Word count (non-negative integer) |
| `image` | `string \| ImageObject \| []?` | **Google requires ≥1 image, ≥1200px wide** |
| `video` | `VideoObject \| VideoObject[]?` | Embedded video |
| `speakable` | `SpeakableSpecification?` | For Google Assistant |

### Minimum for Google rich result

```ts
createArticle({
  headline: 'Article Title',           // required (max 110 chars)
  image: 'https://example.com/img.jpg', // required (≥1200px wide)
  datePublished: '2025-01-01',          // required
  author: { '@type': 'Person', name: 'Alice' }, // required
});
```

---

## createWebPage

```ts
import { createWebPage } from 'schemaorg-kit';
```

Represents an individual web page. Useful in `@graph` alongside Article, Organization, etc.

### Fields (additional to CreativeWork)

| Field | Type | Notes |
|-------|------|-------|
| `url` | `string?` | Page URL |
| `name` | `string?` | Page title |
| `breadcrumb` | `BreadcrumbList?` | Page breadcrumb |
| `reviewedBy` | `Person \| Organization?` | Medical/legal review |
| `lastReviewed` | `string?` | ISO 8601 review date |
| `speakable` | `SpeakableSpecification?` | For Google Assistant |
| `significantLink` | `string \| string[]?` | Important outgoing links |
| `primaryImageOfPage` | `ImageObject?` | Primary image |
| `relatedLink` | `string \| string[]?` | Related links |

### Example

```ts
const page = createWebPage({
  '@id': 'https://example.com/about#webpage',
  name: 'About Us — Acme',
  url: 'https://example.com/about',
  description: 'Learn about Acme Corporation.',
  datePublished: '2024-01-01',
  dateModified: '2025-03-15',
  inLanguage: 'en-US',
  isPartOf: { '@id': 'https://example.com/#website' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com' },
      { '@type': 'ListItem', position: 2, name: 'About' },
    ],
  },
});
```

---

## createWebSite

```ts
import { createWebSite } from 'schemaorg-kit';
```

Represents the entire website. Used for knowledge panel signals.

{: .warning }
> **`potentialAction` (SearchAction) was deprecated by Google in November 2024.** The Sitelinks Searchbox no longer appears in search results. The field is harmless to include but has no effect. See [Google's announcement](https://developers.google.com/search/blog/2024/11/retiring-sitelinks-searchbox).

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string?` | Site name |
| `url` | `string?` | Homepage URL |
| `inLanguage` | `string \| string[]?` | Site language(s) |
| `publisher` | `Person \| Organization?` | Site owner |
| `potentialAction` | `SearchAction?` | ~~Sitelinks searchbox~~ — **deprecated Nov 2024** |
| `copyrightYear` | `number?` | Copyright year |

### Example

```ts
const site = createWebSite({
  '@id': 'https://acme.com/#website',
  name: 'Acme Corporation',
  url: 'https://acme.com',
  inLanguage: 'en-US',
  publisher: { '@id': 'https://acme.com/#organization' },
});
```

---

## createDataset

```ts
import { createDataset, PropertyValueSchema } from 'schemaorg-kit';
```

For [Google Dataset Search](https://datasetsearch.research.google.com/). Required: `name`, `description`.

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | **Required** — dataset name |
| `description` | `string?` | What the data contains |
| `url` | `string?` | Landing page URL |
| `identifier` | `string?` | DOI or other persistent ID |
| `license` | `string?` | License URL |
| `creator` | `Person \| Organization \| []?` | Dataset creator(s) |
| `publisher` | `Person \| Organization?` | Publisher |
| `datePublished` | `string?` | ISO 8601 |
| `dateModified` | `string?` | ISO 8601 |
| `keywords` | `string \| string[]?` | Subject keywords |
| `variableMeasured` | `string \| PropertyValue \| []?` | Variables in the dataset |
| `measurementTechnique` | `string?` | How data was collected |
| `temporalCoverage` | `string?` | ISO 8601 date/interval |
| `spatialCoverage` | `Place?` | Geographic coverage |
| `distribution` | `DataDownload \| DataDownload[]?` | Downloadable files |
| `hasPart` | `Dataset[]?` | Sub-datasets |
| `isBasedOn` | `string?` | Source dataset URL |
| `citation` | `string?` | How to cite |
| `inLanguage` | `string?` | Language |
| `isAccessibleForFree` | `boolean?` | Open access? |

---

## createRecipe

```ts
import { createRecipe, NutritionInformationSchema } from 'schemaorg-kit';
```

Google required: `name`, `image`. Enables the Recipe rich result with ratings, nutrition, and cooking time.

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | **Required** |
| `image` | `string \| ImageObject \| []` | **Required** — multiple aspect ratios recommended |
| `author` | `Person \| Organization \| []?` | Recipe author |
| `datePublished` | `string?` | Publication date |
| `description` | `string?` | Short description |
| `prepTime` | `string?` | ISO 8601 duration, e.g. `"PT15M"` |
| `cookTime` | `string?` | ISO 8601 duration |
| `totalTime` | `string?` | ISO 8601 duration |
| `recipeYield` | `string \| number \| string[]?` | Serving size |
| `recipeCategory` | `string?` | e.g. "Dessert", "Breakfast" |
| `recipeCuisine` | `string?` | e.g. "Italian", "Mexican" |
| `recipeIngredient` | `string[]?` | List of ingredients |
| `recipeInstructions` | `(string \| HowToStep \| HowToSection)[]?` | Step-by-step instructions |
| `nutrition` | `NutritionInformation?` | Per-serving nutrition data |
| `video` | `VideoObject \| VideoObject[]?` | Cooking video |
| `aggregateRating` | `AggregateRating?` | User ratings |
| `review` | `Review \| Review[]?` | User reviews |
| `keywords` | `string \| string[]?` | Tags |
| `cookingMethod` | `string?` | e.g. "Baking", "Grilling" |
| `suitableForDiet` | `string \| string[]?` | Schema.org diet enum URLs |
| `estimatedCost` | `string?` | Rough cost |

### NutritionInformation fields

```ts
NutritionInformationSchema.parse({
  calories: '350 calories',
  proteinContent: '12 grams',
  carbohydrateContent: '45 grams',
  fatContent: '8 grams',
  fiberContent: '3 grams',
  sugarContent: '5 grams',
  sodiumContent: '480 milligrams',
  servingSize: '1 cup (240g)',
});
```

---

## createCourse

```ts
import { createCourse } from 'schemaorg-kit';
```

Required: `name`, `description`. Eligible for [Course rich results](https://developers.google.com/search/docs/appearance/structured-data/course).

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | **Required** |
| `description` | `string?` | **Required** for rich result |
| `provider` | `Organization \| Person?` | Who offers the course |
| `url` | `string?` | Course landing page |
| `hasCourseInstance` | `CourseInstance[]?` | Specific scheduled instances |
| `image` | `string \| ImageObject \| []?` | Course image |
| `inLanguage` | `string?` | Language |
| `educationalLevel` | `string?` | e.g. "beginner", "undergraduate" |
| `teaches` | `string \| string[]?` | Skills taught |
| `skillLevel` | `string?` | Skill level |
| `numberOfCredits` | `number?` | Academic credits |
| `occupationalCredentialAwarded` | `string?` | Certificate or degree |
| `educationalCredentialAwarded` | `string?` | Academic credential |
| `about` | `object \| object[]?` | Topics covered |
| `aggregateRating` | `AggregateRating?` | Course rating |

### CourseInstance (for `hasCourseInstance`)

```ts
{
  '@type': 'CourseInstance',
  courseMode: 'online' | 'onsite' | 'blended',
  startDate: '2025-09-01',  // ISO 8601
  endDate: '2025-12-15',
  location: { '@type': 'Place', name: 'Room 204' },  // for onsite
  instructor: { '@type': 'Person', name: 'Prof. Smith' },
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
}
```

---

## createSoftwareApplication / createMobileApplication / createWebApplication

```ts
import {
  createSoftwareApplication,
  createMobileApplication,
  createWebApplication,
} from 'schemaorg-kit';
```

| Factory | `@type` | Platform |
|---------|---------|----------|
| `createSoftwareApplication` | `"SoftwareApplication"` | Desktop |
| `createMobileApplication` | `"MobileApplication"` | iOS / Android |
| `createWebApplication` | `"WebApplication"` | Browser |

Google required: `name`, `offers.price`, and either `aggregateRating` or `review`.

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string?` | App name |
| `description` | `string?` | App description |
| `applicationCategory` | `string?` | e.g. `"FinanceApplication"`, `"GameApplication"` |
| `operatingSystem` | `string \| string[]?` | e.g. `["ANDROID 8.0+", "iOS 14.0+"]` |
| `offers` | `Offer \| Offer[]?` | Pricing (free = `price: 0`) |
| `aggregateRating` | `AggregateRating?` | App store rating |
| `review` | `Review?` | Individual review |
| `screenshot` | `string \| ImageObject \| []?` | App screenshots |
| `softwareVersion` | `string?` | Current version |
| `fileSize` | `string?` | Download size |
| `downloadUrl` | `string?` | Download link |
| `installUrl` | `string?` | Installation URL |
| `countriesSupported` | `string[]?` | Country codes |
| `featureList` | `string \| string[]?` | Feature list |
| `browserRequirements` | `string?` | WebApplication only |
| `isAccessibleForFree` | `boolean?` | Free app? |

### ApplicationCategory values

`"GameApplication"`, `"SocialNetworkingApplication"`, `"TravelApplication"`,
`"ShoppingApplication"`, `"SportsApplication"`, `"LifestyleApplication"`,
`"BusinessApplication"`, `"DesignApplication"`, `"DeveloperApplication"`,
`"DriverApplication"`, `"EducationalApplication"`, `"HealthApplication"`,
`"FinanceApplication"`, `"SecurityApplication"`, `"BrowserApplication"`,
`"CommunicationApplication"`, `"DesktopEnhancementApplication"`,
`"EntertainmentApplication"`, `"MultimediaApplication"`, `"HomeApplication"`,
`"UtilitiesApplication"`, `"ReferenceApplication"`

---

## createVideoObject

```ts
import { createVideoObject, ClipSchema, BroadcastEventSchema } from 'schemaorg-kit';
```

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string?` | Video title |
| `description` | `string?` | Video description |
| `thumbnailUrl` | `string \| string[]?` | **Required for rich result** — multiple aspect ratios |
| `uploadDate` | `string?` | **Required** — ISO 8601 |
| `duration` | `string?` | ISO 8601 duration, e.g. `"PT1H12M30S"` |
| `contentUrl` | `string?` | Direct video file URL |
| `embedUrl` | `string?` | Embed URL (YouTube, Vimeo, etc.) |
| `hasPart` | `Clip[]?` | Key moments (chapters) |
| `isLiveBroadcast` | `boolean?` | Is/was live |
| `publication` | `BroadcastEvent?` | Live broadcast details |
| `regionsAllowed` | `string \| string[]?` | ISO 3166-1 country codes |
| `requiresSubscription` | `boolean?` | Paywalled? |
| `interactionStatistic` | `InteractionCounter?` | View count |

### ClipSchema — Key Moments

```ts
ClipSchema.parse({
  name: 'Introduction',
  startOffset: 0,       // seconds from start
  endOffset: 120,       // seconds from start
  url: 'https://example.com/video.mp4#t=0',
})
```

### BroadcastEventSchema — Livestream

```ts
BroadcastEventSchema.parse({
  isLiveBroadcast: true,
  startDate: '2025-06-01T09:00:00-07:00',
  endDate:   '2025-06-01T11:00:00-07:00',
})
```

---

## createBook

```ts
import {
  createBook,
  BookEditionSchema,
  ReadActionSchema,
  BorrowActionSchema,
  BookFormatType,
} from 'schemaorg-kit';
```

For [Google Book Actions](https://developers.google.com/search/docs/appearance/structured-data/book) (invite-only). Google uses a two-level structure: a **work** node (the book itself) containing `workExample` entries (individual editions). Each edition has a `potentialAction` — either `ReadAction` (read online) or `BorrowAction` (borrow from a library).

### BookSchema fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | **Required** — book title |
| `author` | `Person \| Organization \| []` | **Required** — author(s) |
| `workExample` | `BookEdition \| BookEdition[]?` | Individual editions (eBook, print, audio…) |
| `isbn` | `string?` | ISBN-13 preferred |
| `description` | `string?` | Book synopsis |
| `image` | `string \| ImageObject \| []?` | Cover image |
| `url` | `string?` | Canonical book page |
| `sameAs` | `string \| string[]?` | WorldCat, Open Library, Wikidata, etc. |

### BookEditionSchema fields

| Field | Type | Notes |
|-------|------|-------|
| `bookFormat` | `BookFormatType?` | `"EBook"`, `"Hardcover"`, `"Paperback"`, `"AudioBook"`, `"GraphicNovel"` |
| `inLanguage` | `string?` | BCP 47 language code |
| `isbn` | `string?` | Edition ISBN |
| `name` | `string?` | Edition-specific title |
| `potentialAction` | `ReadAction \| BorrowAction \| []?` | How to acquire the edition |
| `url` | `string?` | Edition landing page |
| `datePublished` | `string?` | Edition publication date |

### ReadActionSchema

```ts
ReadActionSchema.parse({
  target: 'https://read.example.com/book-slug',   // URL or EntryPoint object
  expectsAcceptanceOf: { '@type': 'Offer', price: 9.99, priceCurrency: 'USD' },
})
```

### BorrowActionSchema

```ts
BorrowActionSchema.parse({
  lender: {
    '@type': 'LibrarySystem',
    name: 'City Public Library System',
    '@id': 'https://www.worldcat.org/wcpa/oclc/12345',
  },
  target: 'https://catalog.library.example/borrow/isbn/9780132350884',
})
```

### Full Example

```ts
import { createBook, BookEditionSchema, ReadActionSchema, BorrowActionSchema } from 'schemaorg-kit';

const book = createBook({
  name: 'Clean Code',
  author: { '@type': 'Person', name: 'Robert C. Martin' },
  isbn: '9780132350884',
  description: 'A handbook of agile software craftsmanship.',
  image: 'https://example.com/covers/clean-code.jpg',
  sameAs: [
    'https://www.worldcat.org/oclc/71196630',
    'https://openlibrary.org/books/OL7353243M',
  ],
  workExample: [
    BookEditionSchema.parse({
      name: 'Clean Code (eBook)',
      bookFormat: 'EBook',
      inLanguage: 'en',
      isbn: '9780136083252',
      potentialAction: ReadActionSchema.parse({
        target: 'https://read.example.com/clean-code',
        expectsAcceptanceOf: { '@type': 'Offer', price: 9.99, priceCurrency: 'USD' },
      }),
    }),
    BookEditionSchema.parse({
      name: 'Clean Code (Hardcover)',
      bookFormat: 'Hardcover',
      inLanguage: 'en',
      isbn: '9780132350884',
      potentialAction: BorrowActionSchema.parse({
        lender: { '@type': 'LibrarySystem', name: 'San Francisco Public Library' },
        target: 'https://sfpl.org/catalog/borrow/clean-code',
      }),
    }),
  ],
});
```

---

## createMathSolver

```ts
import { createMathSolver, SolveMathActionSchema } from 'schemaorg-kit';
```

For Google's [Math Solver](https://developers.google.com/search/docs/appearance/structured-data/math-solvers) rich result. Required: `name`, `potentialAction`.

### Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | **Required** — solver name |
| `url` | `string?` | Solver URL |
| `potentialAction` | `SolveMathAction \| SolveMathAction[]?` | **Required** — solve action |
| `mathExpression` | `string \| string[]?` | Example expressions |
| `educationalLevel` | `string?` | Level (e.g. "high school") |
| `teaches` | `string \| string[]?` | Topics covered |

```ts
const solver = createMathSolver({
  name: 'Algebra Step Solver',
  potentialAction: {
    '@type': 'SolveMathAction',
    eduQuestionType: 'Algebra',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://solver.example.com/solve?expr={math_expression_string}',
      actionAccessibilityRequirement: {
        '@type': 'ActionAccessSpecification',
        requiresSubscription: false,
      },
    },
  },
});
```
