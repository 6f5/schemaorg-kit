/**
 * book.ts — Book Actions (ReadAction + BorrowAction)
 *
 * Demonstrates: Book work-level schema, individual editions as workExample,
 * ReadAction (paid + free/subscription), BorrowAction (library checkout),
 * multi-edition setup, and how to emit the final script tag.
 *
 * Note: Book Actions is an invite-only Google feature. Apply at:
 * https://developers.google.com/search/docs/appearance/structured-data/book
 */

import {
  createBook,
  BookEditionSchema,
  ReadActionSchema,
  BorrowActionSchema,
  BookFormatType,
} from "../src/index";

// ─── Paid eBook (ReadAction with price) ───────────────────────────────────────

const pragprog = createBook({
  name: "The Pragmatic Programmer, 20th Anniversary Edition",
  author: [
    { "@type": "Person", name: "David Thomas" },
    { "@type": "Person", name: "Andrew Hunt" },
  ],
  isbn: "9780135957059",
  description:
    "Your journey to mastery. Comprehensive, pragmatic advice for software developers " +
    "covering tools, techniques, and best practices that transcend language and framework.",
  image: "https://pragprog.com/covers/tpp20/the-pragmatic-programmer-20th-anniversary-edition.jpg",
  sameAs: [
    "https://www.worldcat.org/oclc/1104665380",
    "https://openlibrary.org/works/OL17935965W",
    "https://www.wikidata.org/wiki/Q3405025",
  ],
  workExample: [
    BookEditionSchema.parse({
      name: "The Pragmatic Programmer (eBook, 20th Anniversary)",
      bookFormat: "EBook",
      inLanguage: "en",
      isbn: "9780135957059",
      potentialAction: ReadActionSchema.parse({
        target: "https://pragprog.com/titles/tpp20/read",
        expectsAcceptanceOf: {
          "@type": "Offer",
          price: 49.95,
          priceCurrency: "USD",
          availability: "InStock",
          seller: { "@type": "Organization", name: "The Pragmatic Bookshelf" },
        },
      }),
    }),
    BookEditionSchema.parse({
      name: "The Pragmatic Programmer (Paperback, 20th Anniversary)",
      bookFormat: "Paperback",
      inLanguage: "en",
      isbn: "9780135957059",
      datePublished: "2019-09-13",
      potentialAction: BorrowActionSchema.parse({
        lender: {
          "@type": "LibrarySystem",
          name: "Open Library",
          "@id": "https://openlibrary.org",
        },
        target: "https://openlibrary.org/borrow/ia/pragmatic-programmer-20th",
      }),
    }),
  ],
});

console.log("=== The Pragmatic Programmer ===");
console.log(pragprog.toScript());

// ─── Free / Open Access (ReadAction, price: 0) ───────────────────────────────

const openBook = createBook({
  name: "Structure and Interpretation of Computer Programs",
  author: [
    { "@type": "Person", name: "Harold Abelson" },
    { "@type": "Person", name: "Gerald Jay Sussman" },
  ],
  isbn: "9780262510875",
  description:
    "The classic MIT computer science textbook — available free online. " +
    "Covers functional programming, data abstraction, and language design.",
  sameAs: [
    "https://www.worldcat.org/oclc/34988566",
    "https://openlibrary.org/works/OL2038736W",
  ],
  workExample: BookEditionSchema.parse({
    name: "SICP (HTML edition, free online)",
    bookFormat: "EBook",
    inLanguage: "en",
    potentialAction: ReadActionSchema.parse({
      target: "https://mitpress.mit.edu/sites/default/files/sicp/index.html",
      expectsAcceptanceOf: {
        "@type": "Offer",
        price: 0,
        priceCurrency: "USD",
        availability: "InStock",
      },
    }),
  }),
});

console.log("\n=== SICP (free/open access) ===");
console.log(openBook.toScript());

// ─── Audiobook ────────────────────────────────────────────────────────────────

const audioBook = createBook({
  name: "Clean Code",
  author: { "@type": "Person", name: "Robert C. Martin" },
  isbn: "9780132350884",
  description: "A handbook of agile software craftsmanship.",
  image: "https://example.com/covers/clean-code.jpg",
  sameAs: [
    "https://www.worldcat.org/oclc/71196630",
    "https://openlibrary.org/books/OL7353243M",
  ],
  workExample: [
    // Audiobook via subscription platform
    BookEditionSchema.parse({
      name: "Clean Code (Audiobook)",
      bookFormat: "AudioBook",
      inLanguage: "en",
      potentialAction: ReadActionSchema.parse({
        target: "https://audio.example.com/clean-code",
        expectsAcceptanceOf: {
          "@type": "Offer",
          price: 0,
          priceCurrency: "USD",
          // price 0 = included in subscription
          description: "Included with Audible membership",
          availability: "InStock",
        },
      }),
    }),
    // Library borrow
    BookEditionSchema.parse({
      name: "Clean Code (Hardcover)",
      bookFormat: "Hardcover",
      inLanguage: "en",
      isbn: "9780132350884",
      potentialAction: BorrowActionSchema.parse({
        lender: {
          "@type": "LibrarySystem",
          name: "San Francisco Public Library",
          "@id": "https://www.worldcat.org/wcpa/oclc/71196630",
        },
        target: "https://sfpl.org/catalog/borrow/clean-code",
      }),
    }),
  ],
});

console.log("\n=== Clean Code (audio + borrow) ===");
console.log(audioBook.toScript());

// ─── Multi-author book with all format types ──────────────────────────────────

// Verify all BookFormatType values parse correctly
const formats: string[] = ["EBook", "Hardcover", "Paperback", "AudioBook", "GraphicNovel"];
formats.forEach((f) => {
  const parsed = BookFormatType.parse(f);
  console.log(`\nBookFormatType "${parsed}" ✓`);
});
