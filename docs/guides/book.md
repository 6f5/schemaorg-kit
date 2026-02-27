---
title: Book Actions
parent: Guides
nav_order: 14
---

# Book Actions
{: .no_toc }

`Book` structured data with `ReadAction` and `BorrowAction` enables Google to display "Read" and "Borrow" buttons directly in search results, linking users to online reading platforms or library catalog pages.

{: .warning }
> **Book Actions is an invite-only Google feature.** You must apply to Google's Book Actions program before your structured data will generate rich results. See [Google's Book documentation](https://developers.google.com/search/docs/appearance/structured-data/book).

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## How Book Actions Work

Google uses a two-level schema:

1. **Work** (`Book`) — the canonical book entity (`name`, `author`, `isbn`, `sameAs` to WorldCat/Open Library)
2. **Edition** (`BookEdition`, also `@type: "Book"`) — individual formats in `workExample`, each with a `potentialAction`:
   - `ReadAction` — links to an online reading platform (purchase or subscription)
   - `BorrowAction` — links to a library catalog for borrowing

---

## Required Fields

| Field | Notes |
|-------|-------|
| `name` | Book title |
| `author` | At least one `Person` or `Organization` |
| `workExample` | At least one edition with a `potentialAction` |

---

## ReadAction — Read Online

Use `ReadAction` when users can read the book on your platform (paid, subscription, or free):

```ts
import { createBook, BookEditionSchema, ReadActionSchema } from 'schemaorg-kit';

const book = createBook({
  name: 'The Pragmatic Programmer',
  author: [
    { '@type': 'Person', name: 'David Thomas' },
    { '@type': 'Person', name: 'Andrew Hunt' },
  ],
  isbn: '9780135957059',
  description: 'Your journey to mastery.',
  image: 'https://example.com/covers/pragprog.jpg',
  sameAs: [
    'https://www.worldcat.org/oclc/1104665380',
    'https://openlibrary.org/works/OL17935965W',
  ],
  workExample: BookEditionSchema.parse({
    name: 'The Pragmatic Programmer (eBook)',
    bookFormat: 'EBook',
    inLanguage: 'en',
    isbn: '9780135957059',
    potentialAction: ReadActionSchema.parse({
      target: 'https://pragprog.com/titles/tpp20/read',
      expectsAcceptanceOf: {
        '@type': 'Offer',
        price: 49.95,
        priceCurrency: 'USD',
        availability: 'InStock',
      },
    }),
  }),
});
```

### Free to read

For open-access books, set `price: 0`:

```ts
potentialAction: ReadActionSchema.parse({
  target: 'https://example.com/books/free-book/read',
  expectsAcceptanceOf: {
    '@type': 'Offer',
    price: 0,
    priceCurrency: 'USD',
    availability: 'InStock',
  },
}),
```

---

## BorrowAction — Library Checkout

Use `BorrowAction` for library catalog integrations. The `lender` is the `LibrarySystem` (consortium) or `Library` (individual branch):

```ts
import { createBook, BookEditionSchema, BorrowActionSchema } from 'schemaorg-kit';

const book = createBook({
  name: 'The Great Gatsby',
  author: { '@type': 'Person', name: 'F. Scott Fitzgerald' },
  isbn: '9780743273565',
  workExample: BookEditionSchema.parse({
    bookFormat: 'Hardcover',
    inLanguage: 'en',
    isbn: '9780743273565',
    potentialAction: BorrowActionSchema.parse({
      lender: {
        '@type': 'LibrarySystem',
        name: 'New York Public Library',
        '@id': 'https://www.worldcat.org/wcpa/oclc/185152',
      },
      target: 'https://catalog.nypl.org/borrow/gatsby',
    }),
  }),
});
```

---

## Multiple Editions

A book can have many editions — each with its own `potentialAction`:

```ts
import {
  createBook,
  BookEditionSchema,
  ReadActionSchema,
  BorrowActionSchema,
} from 'schemaorg-kit';

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
    // eBook — paid read online
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
    // AudioBook — subscription access
    BookEditionSchema.parse({
      name: 'Clean Code (Audiobook)',
      bookFormat: 'AudioBook',
      inLanguage: 'en',
      potentialAction: ReadActionSchema.parse({
        target: 'https://audio.example.com/clean-code',
        expectsAcceptanceOf: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
      }),
    }),
    // Hardcover — borrow from library
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

document.head.innerHTML = book.toScript();
```

---

## BookFormatType Values

| Value | Use for |
|-------|---------|
| `"EBook"` | Digital book file (epub, pdf, mobi) |
| `"Hardcover"` | Physical hardback edition |
| `"Paperback"` | Physical softcover edition |
| `"AudioBook"` | Narrated audio format |
| `"GraphicNovel"` | Comic / graphic novel format |

---

## Common Mistakes

{: .warning }
> **Book Actions requires Google approval.** Structured data alone does not activate the feature — apply at Google's [Book partner program](https://developers.google.com/search/docs/appearance/structured-data/book).

{: .tip }
> Include `sameAs` links to WorldCat (`worldcat.org`), Open Library (`openlibrary.org`), and Wikidata. This helps Google merge your book entity with its existing knowledge graph nodes.

{: .tip }
> `isbn` should be ISBN-13 (13 digits). Include it at both the work level and each edition level for maximum disambiguation.

{: .tip }
> For library integrations, use `'@type': 'LibrarySystem'` (a consortium covering multiple branches) rather than `'Library'` (a single branch) — this gives users access across all branches.
