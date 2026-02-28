---
title: Education Q&A
parent: Guides
nav_order: 18
---

# Education Q&A (Quiz) Rich Results
{: .no_toc }

Education Q&A structured data helps students discover flashcards and practice questions on Google Search. It uses the `Quiz` type with `Question` and `Answer` entities to represent study material.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## When to Use

- Flashcard pages (Quizlet-style)
- Practice question sets
- Study guide pages with Q&A pairs
- Educational worksheet pages

{: .warning }
> Education Q&A is different from FAQ. FAQ is for site-specific questions (e.g. "What is your return policy?"). Education Q&A is for educational practice questions (e.g. "What is the capital of France?").

---

## Quick Start

```ts
import { createQuiz } from 'schemaorg-kit';

const quiz = createQuiz({
  name: 'US History: Revolutionary War',
  educationalLevel: 'high school',
  about: { '@type': 'DefinedTerm', name: 'American Revolution' },
  hasPart: [
    {
      '@type': 'Question',
      name: 'When was the Declaration of Independence signed?',
      eduQuestionType: 'Flashcard',
      acceptedAnswer: { '@type': 'Answer', text: 'August 2, 1776' },
    },
    {
      '@type': 'Question',
      name: 'Who was the first President of the United States?',
      eduQuestionType: 'Flashcard',
      acceptedAnswer: { '@type': 'Answer', text: 'George Washington' },
    },
  ],
});

document.head.innerHTML += quiz.toScript();
```

---

## Google Required Fields

| Field | Description |
|-------|-------------|
| `hasPart` | Array of `Question` objects |
| `hasPart[].name` | The question text |
| `hasPart[].acceptedAnswer.text` | The correct answer text |

**Google recommended:** `name`, `educationalLevel`, `about`, `educationalAlignment`

---

## Educational Alignment

Link your quiz to educational standards using `AlignmentObject`:

```ts
import { createQuiz, AlignmentObjectSchema } from 'schemaorg-kit';

const quiz = createQuiz({
  name: 'AP Biology: Cell Division',
  educationalLevel: 'high school',
  about: { '@type': 'DefinedTerm', name: 'Mitosis and Meiosis' },
  educationalAlignment: [
    AlignmentObjectSchema.parse({
      alignmentType: 'educationalSubject',
      targetName: 'Biology',
      educationalFramework: 'Common Core',
    }),
    AlignmentObjectSchema.parse({
      alignmentType: 'educationalLevel',
      targetName: 'AP Biology',
      targetUrl: 'https://apcentral.collegeboard.org/courses/ap-biology',
    }),
  ],
  hasPart: [
    {
      '@type': 'Question',
      name: 'During which phase do chromosomes align at the cell equator?',
      eduQuestionType: 'Flashcard',
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

## Multiple-Choice Questions

Use `suggestedAnswer` to provide incorrect options alongside the `acceptedAnswer`:

```ts
const quiz = createQuiz({
  name: 'Chemistry: The Periodic Table',
  hasPart: [
    {
      '@type': 'Question',
      name: 'What is the chemical symbol for gold?',
      eduQuestionType: 'Flashcard',
      acceptedAnswer: { '@type': 'Answer', text: 'Au' },
      suggestedAnswer: [
        { '@type': 'Answer', text: 'Ag' },
        { '@type': 'Answer', text: 'Go' },
        { '@type': 'Answer', text: 'Gd' },
      ],
    },
  ],
});
```

---

## QAPage vs Quiz vs FAQ

| Type | Use case | Google feature |
|------|----------|---------------|
| `FAQPage` | Site-specific Q&A (returns, pricing) | FAQ accordion |
| `QAPage` | Community answers (StackOverflow-style) | Q&A snippet |
| `Quiz` | Educational practice questions | Education Q&A flashcards |

---

## Best Practices

- **Set `eduQuestionType`** to `"Flashcard"` for flashcard-style content
- **Include at least 2 questions** in `hasPart` for better rich result eligibility
- **Add `educationalLevel`** — Google uses this to match students' search intent
- **Keep answers concise** — flashcard answers should be short and factual

---

## Common Mistakes

{: .warning }
> **Don't use Quiz for FAQ content.** If the questions are about your business or product, use `FAQPage` instead.

{: .tip }
> The `about` field with a `DefinedTerm` helps Google categorize your quiz by subject. Always include it when possible.
