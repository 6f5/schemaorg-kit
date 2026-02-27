---
title: FAQ
parent: Guides
nav_order: 6
---

# FAQ Rich Results
{: .no_toc }

FAQ structured data generates an expandable accordion of questions and answers directly beneath your listing in Google Search — dramatically increasing the amount of SERP real estate your page occupies.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

- Product pages with common questions
- Support / help center articles
- Policy pages (returns, shipping, privacy)
- Service pages with pricing or process questions

{: .warning }
> Google's guidelines say FAQs should contain questions that users actually ask. Creating fake FAQs just to get rich results may result in a manual action.

---

## Quick Start

The ergonomic `createFAQPage` helper is the easiest way to generate FAQ structured data:

```ts
import { createFAQPage } from 'schemaorg-kit';

const faq = createFAQPage([
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day hassle-free return policy on all unused items.',
  },
  {
    question: 'Do you offer free shipping?',
    answer: 'Yes! Free standard shipping on all orders over $50.',
  },
  {
    question: 'How do I track my order?',
    answer: 'You will receive a tracking number via email within 24 hours of shipping.',
  },
]);

document.head.innerHTML += faq.toScript();
```

---

## HTML Answers

Answers support a limited subset of HTML tags:

```ts
const faq = createFAQPage([
  {
    question: 'What payment methods do you accept?',
    answer: '<ul><li>Visa, Mastercard, AmEx</li><li>PayPal</li><li>Apple Pay / Google Pay</li><li>Bank transfer (orders over $500)</li></ul>',
  },
  {
    question: 'Where do you ship?',
    answer: 'We ship to <strong>50+ countries</strong>. See our <a href="/shipping">shipping page</a> for the full list.',
  },
]);
```

**Allowed HTML:** `<h2>`–`<h6>`, `<br>`, `<ol>`, `<ul>`, `<li>`, `<a>`, `<p>`, `<div>`, `<b>`, `<strong>`, `<i>`, `<em>`

---

## Best Practices

**Ideal answer length:** 50–300 words. Google truncates answers in the snippet but links to the full page.

**Add at least 3 questions.** Short FAQ lists may not qualify for rich results.

**Keep questions as users actually phrase them.** "What is your return policy?" (natural) vs "Return Policy Information" (not a question).

---

## FAQ + Article Together

Combine FAQ markup with Article markup on the same page using `@graph`:

```ts
import { createGraph, createArticle, createFAQPage } from 'schemaorg-kit';

const graph = createGraph([
  createArticle({
    headline: 'Everything You Need to Know About Our Subscription Plans',
    author: { '@type': 'Person', name: 'Support Team' },
    datePublished: '2025-04-01',
    image: 'https://example.com/subscriptions.jpg',
  }),
  createFAQPage([
    { question: 'Can I cancel my subscription anytime?', answer: 'Yes. Cancel at any time from your account settings. No cancellation fees.' },
    { question: 'What happens to my data if I cancel?', answer: 'Your data is retained for 30 days after cancellation. You can export it anytime.' },
    { question: 'Can I switch plans?', answer: 'Yes, you can upgrade or downgrade at any time. Changes take effect on your next billing cycle.' },
  ]),
]);
```

---

## Q&A Page (Different from FAQ)

For community-style pages where multiple people answer a single question, use `QAPage` instead:

```ts
import { createQAPage } from 'schemaorg-kit';

const qaPage = createQAPage({
  mainEntity: {
    '@type': 'Question',
    name: 'What is the best way to learn TypeScript?',
    text: 'I know JavaScript. How should I approach learning TypeScript?',
    answerCount: 3,
    upvoteCount: 42,
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Start with the official TypeScript Handbook. Then build a small project using strict mode.',
      upvoteCount: 28,
      url: 'https://forum.example.com/questions/1#answer-5',
      author: { '@type': 'Person', name: 'TypeScript Expert' },
    },
    suggestedAnswer: [
      {
        '@type': 'Answer',
        text: 'Take the TypeScript path on Codecademy or Frontend Masters.',
        upvoteCount: 15,
        url: 'https://forum.example.com/questions/1#answer-7',
      },
    ],
  },
});
```

---

## Common Mistakes

{: .warning }
> **Don't add FAQ schema to a page where the FAQ is not visible.** Google requires the structured data to match visible on-page content.

{: .tip }
> Place the `<script>` tag in `<head>` before `</head>` for fastest Google discovery.

{: .tip }
> If your FAQ page already uses `WebPage` schema, add the `FAQPage` in a `@graph` alongside it — don't nest them.
