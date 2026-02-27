---
title: Custom Extensions
parent: Advanced Topics
nav_order: 5
---

# Custom Schema Extensions
{: .no_toc }

You can extend any built-in schema with additional fields using `extendThing` or by directly calling `.extend()` on any Zod schema.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## extendThing

`extendThing` creates a new schema that inherits all `ThingSchema` fields (id, name, url, description, image, sameAs, etc.):

```ts
import { z } from 'zod';
import { extendThing, makeFactory } from 'schemaorg-kit';

const PodcastEpisodeSchema = extendThing({
  '@type': z.literal('PodcastEpisode').default('PodcastEpisode'),
  episodeNumber: z.number().int().positive(),
  duration: z.string().optional(),   // ISO 8601
  partOfSeries: z.object({
    '@type': z.literal('PodcastSeries'),
    name: z.string(),
    url: z.string().url().optional(),
  }).optional(),
  audio: z.object({
    '@type': z.literal('AudioObject'),
    contentUrl: z.string().url(),
    encodingFormat: z.string().optional(),
    duration: z.string().optional(),
  }).optional(),
});

export type PodcastEpisode = z.infer<typeof PodcastEpisodeSchema>;
export const createPodcastEpisode = makeFactory(PodcastEpisodeSchema);

// Usage:
const episode = createPodcastEpisode({
  name: 'Episode 42: TypeScript Deep Dive',
  url: 'https://podcast.example/ep/42',
  episodeNumber: 42,
  duration: 'PT1H12M',
  partOfSeries: {
    '@type': 'PodcastSeries',
    name: 'Dev Conversations',
    url: 'https://podcast.example',
  },
  audio: {
    '@type': 'AudioObject',
    contentUrl: 'https://cdn.podcast.example/ep42.mp3',
    encodingFormat: 'audio/mpeg',
    duration: 'PT1H12M',
  },
});
```

---

## Extending an Existing Schema

Extend a specific type using `.extend()` on the Zod schema:

```ts
import { z } from 'zod';
import { ArticleSchema, makeFactory } from 'schemaorg-kit';

// Extend Article with a custom field
const TechnicalArticleSchema = ArticleSchema.extend({
  // Override @type to be more specific
  '@type': z.literal('TechArticle').default('TechArticle'),
  // Add custom fields
  proficiencyLevel: z.enum(['Beginner', 'Intermediate', 'Expert']).optional(),
  dependencies: z.array(z.string()).optional(),
  codeRepository: z.string().url().optional(),
});

export type TechnicalArticle = z.infer<typeof TechnicalArticleSchema>;
export const createTechnicalArticle = makeFactory(TechnicalArticleSchema);

const article = createTechnicalArticle({
  headline: 'Advanced TypeScript Patterns',
  image: 'https://example.com/ts-patterns.jpg',
  datePublished: '2025-01-01',
  author: { '@type': 'Person', name: 'Dev Expert' },
  proficiencyLevel: 'Expert',
  codeRepository: 'https://github.com/example/ts-patterns',
});
```

---

## Registering Custom Types

Register your custom schema in the registry to use it with `schema()`:

```ts
import { z } from 'zod';
import { extendThing, makeFactory, schema } from 'schemaorg-kit';
import { REGISTRY } from 'schemaorg-kit/registry';   // internal export

const PodcastEpisodeSchema = extendThing({
  '@type': z.literal('PodcastEpisode').default('PodcastEpisode'),
  episodeNumber: z.number().int(),
});

// Add to registry (mutates — do this once at app startup)
(REGISTRY as any)['PodcastEpisode'] = PodcastEpisodeSchema;

// Now usable with schema():
const ep = schema('PodcastEpisode', { name: 'Ep 1', episodeNumber: 1 });
```

{: .note }
> Modifying the registry is optional — using `makeFactory` directly is sufficient for most use cases.

---

## Adding to @graph

Custom schema nodes work seamlessly with `createGraph`:

```ts
import { createGraph, createOrganization } from 'schemaorg-kit';
import { createPodcastEpisode } from './your-schemas';

const graph = createGraph([
  createOrganization({ name: 'Dev Conversations', url: 'https://podcast.example' }),
  createPodcastEpisode({ name: 'Episode 42', episodeNumber: 42, duration: 'PT1H12M' }),
]);

console.log(graph.toScript());
```

---

## Schema Composition

Compose reusable sub-schemas:

```ts
import { z } from 'zod';
import { makeFactory, extendThing } from 'schemaorg-kit';

// Reusable sub-schema
const SocialLinksSchema = z.object({
  twitter: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
});

// Use it in a custom schema
const TeamMemberSchema = extendThing({
  '@type': z.literal('Person').default('Person'),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  socialLinks: SocialLinksSchema.optional(),
  headshot: z.string().url().optional(),
});

export const createTeamMember = makeFactory(TeamMemberSchema);

const member = createTeamMember({
  name: 'Alice Chen',
  jobTitle: 'Senior Engineer',
  department: 'Platform',
  socialLinks: {
    twitter: 'https://twitter.com/alicechen',
    github: 'https://github.com/alicechen',
  },
  headshot: 'https://company.example/team/alice.jpg',
});
```

Note: `socialLinks` is a non-standard field — it will appear in the JSON-LD output but Google ignores unknown properties.

---

## Validating Custom Fields

Custom fields use the full Zod API — enum, regex, min/max, refine, etc.:

```ts
import { z } from 'zod';
import { extendThing, makeFactory } from 'schemaorg-kit';

const ProductSchema = extendThing({
  '@type': z.literal('Product').default('Product'),
  name: z.string().min(1).max(200),
  sku: z.string().regex(/^[A-Z]{2}-\d{4}$/, 'SKU must be XX-0000 format'),
  weight: z.number().positive().optional(),
  internalCategory: z.enum(['electronics', 'clothing', 'food', 'other']).optional(),
  discontinued: z.boolean().default(false),
});
```
