---
title: Framework Integration
parent: Advanced Topics
nav_order: 6
---

# Framework Integration
{: .no_toc }

`schemaorg-kit` is framework-agnostic — it outputs strings and plain objects that any framework can embed. This page shows patterns for the most popular frameworks.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Next.js (App Router)

In the App Router, inject structured data using `<script>` in server components:

### Single schema

```tsx
// app/blog/[slug]/page.tsx
import { createArticle, createBreadcrumbList, createGraph } from 'schemaorg-kit';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);

  const graph = createGraph([
    createArticle({
      headline: post.title,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      image: post.coverImage,
      author: { '@type': 'Person', name: post.author.name },
      publisher: { '@type': 'Organization', name: 'My Blog', logo: { '@type': 'ImageObject', url: '/logo.png' } },
      mainEntityOfPage: `https://myblog.com/blog/${params.slug}`,
    }),
    createBreadcrumbList([
      { name: 'Home', url: 'https://myblog.com' },
      { name: 'Blog', url: 'https://myblog.com/blog' },
      { name: post.title },
    ]),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph.toJsonLd()) }}
      />
      <article>{/* ... */}</article>
    </>
  );
}
```

### Layout-level schema (Organization + WebSite)

```tsx
// app/layout.tsx
import { createGraph, createOrganization, createWebSite } from 'schemaorg-kit';

const siteGraph = createGraph([
  createOrganization({
    name: 'My Company',
    url: 'https://mycompany.com',
    logo: { '@type': 'ImageObject', url: 'https://mycompany.com/logo.png', width: 512, height: 512 },
    sameAs: ['https://twitter.com/mycompany', 'https://linkedin.com/company/mycompany'],
  }),
  createWebSite({
    name: 'My Company',
    url: 'https://mycompany.com',
  }),
]);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph.toJsonLd()) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## Next.js (Pages Router)

In the Pages Router, use `next/head`:

```tsx
// pages/products/[slug].tsx
import Head from 'next/head';
import { createProduct, createGraph, createBreadcrumbList } from 'schemaorg-kit';

export default function ProductPage({ product }) {
  const graph = createGraph([
    createProduct({
      name: product.name,
      image: product.images,
      offers: { '@type': 'Offer', price: product.price, priceCurrency: 'USD', availability: 'InStock' },
      aggregateRating: product.rating
        ? { '@type': 'AggregateRating', ratingValue: product.rating, ratingCount: product.reviewCount, bestRating: 5 }
        : undefined,
    }),
    createBreadcrumbList([
      { name: 'Home',      url: 'https://store.example' },
      { name: 'Products',  url: 'https://store.example/products' },
      { name: product.name },
    ]),
  ]);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph.toJsonLd()) }}
        />
      </Head>
      <main>{/* ... */}</main>
    </>
  );
}
```

---

## Astro

In Astro, inject directly into `<head>` via the `<head>` slot or in a `.astro` layout:

```astro
---
// src/layouts/BlogPost.astro
import { createGraph, createArticle, createBreadcrumbList } from 'schemaorg-kit';

const { post } = Astro.props;

const graph = createGraph([
  createArticle({
    headline: post.title,
    datePublished: post.date,
    image: post.image,
    author: { '@type': 'Person', name: post.author },
  }),
  createBreadcrumbList([
    { name: 'Home', url: Astro.site?.toString() ?? '/' },
    { name: 'Blog', url: new URL('/blog', Astro.site).toString() },
    { name: post.title },
  ]),
]);
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>{post.title}</title>
    <script type="application/ld+json" set:html={JSON.stringify(graph.toJsonLd())} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

---

## SvelteKit

In SvelteKit, use `svelte:head`:

```svelte
<!-- src/routes/blog/[slug]/+page.svelte -->
<script lang="ts">
  import { createArticle, createBreadcrumbList, createGraph } from 'schemaorg-kit';
  import type { PageData } from './$types';

  export let data: PageData;

  const graph = createGraph([
    createArticle({
      headline: data.post.title,
      datePublished: data.post.publishedAt,
      image: data.post.coverImage,
      author: { '@type': 'Person', name: data.post.author },
    }),
    createBreadcrumbList([
      { name: 'Home', url: 'https://myblog.com' },
      { name: 'Blog', url: 'https://myblog.com/blog' },
      { name: data.post.title },
    ]),
  ]);

  const ldJson = JSON.stringify(graph.toJsonLd());
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${ldJson}</script>`}
</svelte:head>

<article>
  <h1>{data.post.title}</h1>
  <!-- ... -->
</article>
```

---

## Remix

In Remix, use the `links` export or inject in the root component:

```tsx
// app/routes/products.$slug.tsx
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { createProduct, createGraph, createBreadcrumbList } from 'schemaorg-kit';

export async function loader({ params }: LoaderArgs) {
  const product = await fetchProduct(params.slug);
  return json({ product });
}

export default function ProductPage() {
  const { product } = useLoaderData<typeof loader>();

  const graph = createGraph([
    createProduct({
      name: product.name,
      offers: { '@type': 'Offer', price: product.price, priceCurrency: 'USD', availability: 'InStock' },
    }),
    createBreadcrumbList([
      { name: 'Home',     url: 'https://store.example' },
      { name: 'Products', url: 'https://store.example/products' },
      { name: product.name },
    ]),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph.toJsonLd()) }}
      />
      <main>
        <h1>{product.name}</h1>
        {/* ... */}
      </main>
    </>
  );
}
```

---

## Vue 3 / Nuxt

```vue
<!-- pages/blog/[slug].vue (Nuxt 3) -->
<script setup lang="ts">
import { createArticle, createGraph } from 'schemaorg-kit';

const { data: post } = await useFetch(`/api/posts/${route.params.slug}`);

const graph = createGraph([
  createArticle({
    headline: post.value.title,
    datePublished: post.value.date,
    image: post.value.image,
    author: { '@type': 'Person', name: post.value.author },
  }),
]);

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(graph.toJsonLd()),
    },
  ],
});
</script>

<template>
  <article>
    <h1>{{ post.title }}</h1>
  </article>
</template>
```

---

## Vanilla JavaScript / HTML

For static sites or server-rendered HTML:

```js
import { createProduct, createGraph } from 'schemaorg-kit';

const graph = createGraph([
  createProduct({
    name: 'Widget',
    offers: { '@type': 'Offer', price: 9.99, priceCurrency: 'USD', availability: 'InStock' },
  }),
]);

// Inject into <head>
const script = document.createElement('script');
script.type = 'application/ld+json';
script.textContent = JSON.stringify(graph.toJsonLd());
document.head.appendChild(script);
```

Or server-side in Node.js:

```js
import { createProduct } from 'schemaorg-kit';

const product = createProduct({ name: 'Widget' });

const html = `
<!DOCTYPE html>
<html>
  <head>
    ${product.toScript()}
  </head>
  <body>...</body>
</html>
`;
```
