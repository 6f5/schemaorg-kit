---
title: Discussion Forum
parent: Guides
nav_order: 17
---

# Discussion Forum Rich Results
{: .no_toc }

Discussion Forum structured data helps Google understand community-generated content like forum threads, Reddit-style posts, and social media discussions. It can appear in Google Search as a [Discussion Forum](https://developers.google.com/search/docs/appearance/structured-data/discussion-forum) rich result.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

- Forum threads (Discourse, phpBB, custom forums)
- Reddit-style post/comment pages
- Community Q&A threads
- Social media discussion pages

---

## Quick Start

```ts
import { createDiscussionForumPosting } from 'schemaorg-kit';

const post = createDiscussionForumPosting({
  headline: 'Best practices for TypeScript monorepos?',
  author: { '@type': 'Person', name: 'devUser42' },
  datePublished: '2025-08-10T14:30:00Z',
  url: 'https://forum.example.com/t/typescript-monorepos/1234',
  text: 'I\'m setting up a monorepo with TypeScript. What tools and patterns do you recommend?',
  commentCount: 15,
  comment: [
    {
      '@type': 'Comment',
      text: 'Turborepo + pnpm workspaces is a great combo.',
      author: { '@type': 'Person', name: 'buildExpert' },
      datePublished: '2025-08-10T15:00:00Z',
      upvoteCount: 23,
    },
    {
      '@type': 'Comment',
      text: 'Nx is more opinionated but has better caching.',
      author: { '@type': 'Person', name: 'nxFan' },
      datePublished: '2025-08-10T15:30:00Z',
      upvoteCount: 18,
    },
  ],
});

document.head.innerHTML += post.toScript();
```

---

## Google Required Fields

| Field | Description |
|-------|-------------|
| `headline` | The post title |
| `author` | Post author (Person or Organization) |

**Google recommended:** `datePublished`, `url`, `text`, `comment`

---

## Interaction Statistics

Track likes, shares, and views using `interactionStatistic`:

```ts
import { createDiscussionForumPosting, InteractionCounterSchema } from 'schemaorg-kit';

const post = createDiscussionForumPosting({
  headline: 'Announcing our new open-source project',
  author: { '@type': 'Organization', name: 'Acme Labs' },
  datePublished: '2025-09-01',
  url: 'https://forum.example.com/t/announcement/5678',
  upvoteCount: 142,
  commentCount: 37,
  interactionStatistic: [
    InteractionCounterSchema.parse({
      interactionType: 'https://schema.org/LikeAction',
      userInteractionCount: 142,
    }),
    InteractionCounterSchema.parse({
      interactionType: 'https://schema.org/ShareAction',
      userInteractionCount: 28,
    }),
  ],
});
```

---

## Forum Section Context

Use `mainEntityOfPage` or `isPartOf` to link the post to a parent forum or category:

```ts
const post = createDiscussionForumPosting({
  headline: 'How to optimize Next.js builds',
  author: { '@type': 'Person', name: 'webdev_sarah' },
  datePublished: '2025-10-15',
  url: 'https://forum.example.com/web-dev/nextjs-builds',
  mainEntityOfPage: 'https://forum.example.com/web-dev',
  creativeWorkStatus: 'published',
});
```

---

## Reposts / Shared Content

For reposted or shared content, use the `sharedContent` field:

```ts
const repost = createDiscussionForumPosting({
  headline: 'RE: Great article on Rust performance',
  author: { '@type': 'Person', name: 'rustFan' },
  datePublished: '2025-11-01',
  sharedContent: {
    '@type': 'WebPage',
    url: 'https://blog.example.com/rust-performance',
    headline: 'Why Rust Is Faster Than C++ in These Benchmarks',
  },
});
```

---

## Best Practices

- **Include `comment` data** when available — Google uses it to show discussion depth
- **Set `datePublished` as ISO 8601** with timezone for accurate indexing
- **Add `upvoteCount`/`downvoteCount`** to signal community engagement
- **Use one DiscussionForumPosting per thread** — the opening post, not individual replies

---

## Common Mistakes

{: .warning }
> **Don't use DiscussionForumPosting for Article content.** This type is for user-generated discussions, not editorial articles. Use `Article` or `BlogPosting` for editorial content.

{: .tip }
> Google may show discussion forum results as carousels in search for conversational queries. Make sure `comment` entries have `text` and `author` for best visibility.
