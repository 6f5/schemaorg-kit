---
title: Video
parent: Guides
nav_order: 9
---

# Video Rich Results
{: .no_toc }

Video structured data makes your video eligible for a thumbnail, duration, and description in Google Search — including the video carousel at the top of results.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Required Fields

| Field | Type | Notes |
|-------|------|-------|
| `name` | `string` | Video title |
| `description` | `string` | Video description |
| `thumbnailUrl` | `string \| string[]` | Thumbnail URL(s) — multiple recommended |
| `uploadDate` | `string` | ISO 8601 upload date |

## Recommended Fields

| Field | Type | Notes |
|-------|------|-------|
| `duration` | `string` | ISO 8601 duration (`"PT5M30S"`) |
| `contentUrl` | `string` | Direct URL to the video file |
| `embedUrl` | `string` | Embed URL (YouTube, Vimeo, etc.) |
| `expires` | `string` | When the video is no longer available |
| `hasPart` | `Clip[]` | Video segments/chapters |
| `publication` | `BroadcastEvent` | For live streams |
| `regionsAllowed` | `string \| string[]` | ISO country codes |

---

## Standard Video

```ts
import { createVideoObject } from 'schemaorg-kit';

const video = createVideoObject({
  name: 'How to Deploy a Next.js App to Vercel',
  description: 'A step-by-step walkthrough of deploying a Next.js application to Vercel, including environment variables and custom domains.',
  thumbnailUrl: [
    'https://example.com/videos/nextjs-deploy-1280x720.jpg',
    'https://example.com/videos/nextjs-deploy-1280x960.jpg',
    'https://example.com/videos/nextjs-deploy-1280x1280.jpg',
  ],
  uploadDate: '2025-03-10',
  duration: 'PT12M45S',
  contentUrl: 'https://example.com/videos/nextjs-deploy.mp4',
  embedUrl: 'https://www.youtube.com/embed/abc123xyz',
  description: 'Learn how to go from git push to live deployment in under 5 minutes.',
  author: { '@type': 'Person', name: 'Dev Tutorials' },
});
```

---

## YouTube / Vimeo Videos

For videos hosted on a third-party platform, use `embedUrl`:

```ts
const youtubeVideo = createVideoObject({
  name: 'TypeScript in 100 Seconds',
  description: 'A rapid-fire overview of TypeScript fundamentals.',
  thumbnailUrl: 'https://i.ytimg.com/vi/ABC123/maxresdefault.jpg',
  uploadDate: '2025-01-05',
  duration: 'PT1M40S',
  embedUrl: 'https://www.youtube.com/embed/ABC123',
  // Note: don't use contentUrl for YouTube — use embedUrl
});
```

---

## Video with Chapters (Clip segments)

```ts
import { createVideoObject } from 'schemaorg-kit';

const video = createVideoObject({
  name: 'Complete React Tutorial for Beginners',
  description: 'Full-length React course covering hooks, state, and more.',
  thumbnailUrl: 'https://example.com/react-course.jpg',
  uploadDate: '2025-02-15',
  duration: 'PT3H20M',
  embedUrl: 'https://www.youtube.com/embed/REACT123',
  hasPart: [
    {
      '@type': 'Clip',
      name: 'Introduction to React',
      startOffset: 0,
      endOffset: 420,
      url: 'https://www.youtube.com/watch?v=REACT123&t=0s',
    },
    {
      '@type': 'Clip',
      name: 'JSX Basics',
      startOffset: 420,
      endOffset: 1200,
      url: 'https://www.youtube.com/watch?v=REACT123&t=420s',
    },
    {
      '@type': 'Clip',
      name: 'useState and useEffect',
      startOffset: 1200,
      endOffset: 3600,
      url: 'https://www.youtube.com/watch?v=REACT123&t=1200s',
    },
  ],
});
```

---

## Live Stream

```ts
import { createVideoObject } from 'schemaorg-kit';

const liveStream = createVideoObject({
  name: 'Building a Real-Time Chat App — Live Coding Session',
  description: 'Watch as we build a WebSocket-powered chat app from scratch.',
  thumbnailUrl: 'https://example.com/live-chat-stream.jpg',
  uploadDate: '2025-06-15',
  publication: {
    '@type': 'BroadcastEvent',
    isLiveBroadcast: true,
    startDate: '2025-06-15T18:00:00Z',
    endDate: '2025-06-15T20:00:00Z',
  },
});
```

---

## Video on a Recipe Page

Embedding a video in recipe structured data:

```ts
import { createRecipe } from 'schemaorg-kit';

const recipe = createRecipe({
  name: 'Perfect French Omelette',
  image: 'https://example.com/omelette.jpg',
  video: {
    '@type': 'VideoObject',
    name: 'How to Make a French Omelette',
    description: 'Chef-level technique for the perfect French omelette.',
    thumbnailUrl: 'https://example.com/omelette-thumb.jpg',
    uploadDate: '2025-01-20',
    duration: 'PT4M15S',
    embedUrl: 'https://www.youtube.com/embed/OMELETTE123',
  },
});
```

---

## Common Mistakes

{: .warning }
> **Provide at least one `thumbnailUrl`.** It's required for video rich results. Google recommends images with 1280×720 (16:9) or larger.

{: .warning }
> **`uploadDate` must be in ISO 8601 format.** Use `"2025-03-10"` or `"2025-03-10T09:00:00Z"`.

{: .tip }
> Include multiple `thumbnailUrl` values with different aspect ratios (16:9, 4:3, 1:1). This qualifies your video for more Google surfaces including Discover and image search.

{: .tip }
> Video chapters (via `hasPart`) are displayed as jump links in the video snippet — this significantly increases click-through rate for long videos.
