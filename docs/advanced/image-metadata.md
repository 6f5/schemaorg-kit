---
title: Image Metadata
parent: Advanced Topics
nav_order: 2
---

# Image Metadata for Google
{: .no_toc }

Google supports rich image metadata via `ImageObject`. Providing licensing, creator, and credit information makes your images eligible for Google Images' licensable image badges and attribution display.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Why Image Metadata Matters

1. **Licensable badge**: Google Images shows a "Licensable" badge on images with `license` + `acquireLicensePage`
2. **Creator attribution**: Image credit appears in Google Images when you supply `creator` + `creditText`
3. **Copyright protection**: `copyrightNotice` and `copyrightHolder` help establish ownership
4. **Rich results eligibility**: Products, recipes, and articles with rich `ImageObject` data may get larger thumbnails

---

## ImageObject Fields

| Field | Type | Notes |
|-------|------|-------|
| `url` | `string` | **Required** — canonical image URL |
| `contentUrl` | `string?` | Direct file URL (if different from page URL) |
| `width` | `number?` | Pixel width |
| `height` | `number?` | Pixel height |
| `caption` | `string?` | Caption to display below the image |
| `description` | `string?` | Longer image description |
| `name` | `string?` | Image title |
| `creator` | `Person \| Organization?` | Who took/made the image |
| `creditText` | `string?` | Credit line to display (e.g. "Photo by Alice / Acme Corp") |
| `copyrightNotice` | `string?` | Copyright notice (e.g. "© 2025 Acme Corp") |
| `copyrightHolder` | `Person \| Organization?` | Who owns the copyright |
| `license` | `string?` | URL to the license (e.g. Creative Commons URL) |
| `acquireLicensePage` | `string?` | URL where someone can buy/request a license |
| `representativeOfPage` | `boolean?` | `true` if this is the primary image of the page |
| `encodingFormat` | `string?` | MIME type, e.g. `"image/jpeg"` |
| `uploadDate` | `string?` | ISO 8601 upload date |
| `thumbnailUrl` | `string?` | Thumbnail URL |

---

## Full Image Object

```ts
import { createImageObject } from 'schemaorg-kit';

const image = createImageObject({
  url: 'https://example.com/photos/mountain-sunrise.jpg',
  contentUrl: 'https://cdn.example.com/photos/mountain-sunrise-full.jpg',
  width: 4000,
  height: 2667,
  caption: 'Sunrise over the Dolomites, June 2025',
  description: 'Golden sunrise light illuminating the jagged peaks of the Dolomites in northern Italy.',
  name: 'Dolomites Sunrise',
  creator: {
    '@type': 'Person',
    name: 'Marco Bianchi',
    url: 'https://marcobianchi.photography',
    sameAs: 'https://instagram.com/marcobianchi_photo',
  },
  creditText: 'Photo © Marco Bianchi Photography',
  copyrightNotice: '© 2025 Marco Bianchi. All rights reserved.',
  copyrightHolder: {
    '@type': 'Person',
    name: 'Marco Bianchi',
  },
  license: 'https://creativecommons.org/licenses/by-nc/4.0/',
  acquireLicensePage: 'https://marcobianchi.photography/licensing',
  representativeOfPage: true,
  encodingFormat: 'image/jpeg',
  uploadDate: '2025-06-10',
  thumbnailUrl: 'https://example.com/photos/mountain-sunrise-thumb.jpg',
});
```

---

## Image on an Article

```ts
import { createArticle, createImageObject } from 'schemaorg-kit';

const article = createArticle({
  headline: 'The Rise of Dolomite Tourism',
  datePublished: '2025-07-01',
  author: { '@type': 'Person', name: 'Travel Writer' },
  image: createImageObject({
    url: 'https://example.com/dolomites.jpg',
    width: 1200,
    height: 630,
    caption: 'The Three Peaks of Lavaredo',
    creator: { '@type': 'Person', name: 'Marco Bianchi' },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creditText: 'Marco Bianchi / Creative Commons',
    representativeOfPage: true,
  }).toObject() as any,
});
```

---

## Multiple Images with Different Aspect Ratios

Google recommends providing images in multiple aspect ratios to maximize eligibility across different surfaces (Discover, Search, News):

```ts
import { createArticle } from 'schemaorg-kit';

const article = createArticle({
  headline: 'Test Article',
  datePublished: '2025-01-01',
  author: { '@type': 'Person', name: 'Author' },
  image: [
    // 16:9 — for Google Discover, AMP
    {
      '@type': 'ImageObject',
      url: 'https://example.com/article-1200x675.jpg',
      width: 1200,
      height: 675,
    },
    // 4:3 — for Top Stories
    {
      '@type': 'ImageObject',
      url: 'https://example.com/article-1200x900.jpg',
      width: 1200,
      height: 900,
    },
    // 1:1 — for Google News
    {
      '@type': 'ImageObject',
      url: 'https://example.com/article-1200x1200.jpg',
      width: 1200,
      height: 1200,
    },
  ],
});
```

**Minimum image size:** 1200 × 628 pixels for Top Stories / Discover.
**Minimum for structured data validation:** any non-zero dimensions.

---

## ImageOrUrl — Simple vs Rich

Most schema fields accepting images use `ImageOrUrl`, which accepts:

```ts
// Simple string URL (most common)
{ image: 'https://example.com/photo.jpg' }

// Full ImageObject for metadata
{ image: { '@type': 'ImageObject', url: 'https://example.com/photo.jpg', width: 1200, height: 630 } }

// Array of either
{ image: [
  'https://example.com/photo-16x9.jpg',
  { '@type': 'ImageObject', url: 'https://example.com/photo-1x1.jpg', width: 800, height: 800 }
]}
```

---

## Organization Logo Requirements

Google has specific requirements for `Organization.logo`:

- **Format:** PNG, WebP, SVG, or GIF (not JPEG — poor transparency support)
- **Aspect ratio:** Prefer square; if rectangular, max 10:1 width:height
- **Min size:** 112 × 112 pixels
- **Recommended:** 512 × 512 pixels
- **White/transparent background** works best for Knowledge Panel display

```ts
import { createOrganization } from 'schemaorg-kit';

const org = createOrganization({
  name: 'Acme Corp',
  logo: {
    '@type': 'ImageObject',
    url: 'https://acme.com/logo-512.png',
    width: 512,
    height: 512,
    encodingFormat: 'image/png',
  },
});
```

---

## Creative Commons License URLs

| License | URL |
|---------|-----|
| CC BY 4.0 | `https://creativecommons.org/licenses/by/4.0/` |
| CC BY-SA 4.0 | `https://creativecommons.org/licenses/by-sa/4.0/` |
| CC BY-NC 4.0 | `https://creativecommons.org/licenses/by-nc/4.0/` |
| CC BY-ND 4.0 | `https://creativecommons.org/licenses/by-nd/4.0/` |
| CC0 (Public Domain) | `https://creativecommons.org/publicdomain/zero/1.0/` |
