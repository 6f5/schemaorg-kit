import { z } from "zod";
import { makeFactory } from "../../core/base";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";
import { ImageOrUrl } from "../shared/ImageObject";
import { OfferSchema } from "../shared/Offer";

// ─── BookFormatType ──────────────────────────────────────────────────────────

export const BookFormatType = z.enum([
  "EBook",
  "Hardcover",
  "Paperback",
  "AudioBook",
  "GraphicNovel",
]);

export type BookFormatType = z.infer<typeof BookFormatType>;

// ─── EntryPoint ───────────────────────────────────────────────────────────────

const EntryPointSchema = z.object({
  "@type": z.literal("EntryPoint").default("EntryPoint"),
  /** URL template with optional {isbn} / {id} placeholder, or a plain URL */
  urlTemplate: z.string(),
  /** MIME type of the action target */
  encodingType: z.string().optional(),
  /** HTTP method */
  httpMethod: z.string().optional(),
});

// ─── ReadAction ───────────────────────────────────────────────────────────────

export const ReadActionSchema = z.object({
  "@type": z.literal("ReadAction").default("ReadAction"),
  /** Where the book can be read */
  target: z.union([EntryPointSchema, z.string()]),
  /** Offer describing subscription / purchase required to read */
  expectsAcceptanceOf: OfferSchema.optional(),
});

export type ReadAction = z.infer<typeof ReadActionSchema>;

// ─── BorrowAction ─────────────────────────────────────────────────────────────

export const BorrowActionSchema = z.object({
  "@type": z.literal("BorrowAction").default("BorrowAction"),
  /** Library system or library lending this book */
  lender: z.object({
    "@type": z.union([
      z.literal("LibrarySystem"),
      z.literal("Library"),
    ]),
    name: z.string(),
    url: z.string().url().optional(),
    /** Unique identifier for the library system */
    "@id": z.string().optional(),
  }),
  /** Where the borrow action is performed */
  target: z.union([EntryPointSchema, z.string()]),
});

export type BorrowAction = z.infer<typeof BorrowActionSchema>;

// ─── BookEdition (workExample) ────────────────────────────────────────────────

/**
 * A specific edition / format of a Book (e.g. hardcover ISBN, ebook ASIN).
 * Used as `workExample` entries on the parent BookSchema.
 * Google Book Actions require at least one edition with a `potentialAction`.
 */
export const BookEditionSchema = z.object({
  "@type": z.literal("Book").default("Book"),
  /** Unique stable URL identifying this edition */
  "@id": z.string().optional(),
  /** Edition title — may differ from the work title */
  name: z.string().optional(),
  /** Physical/digital format */
  bookFormat: BookFormatType.optional(),
  /** BCP 47 language tag, e.g. "en", "fr" */
  inLanguage: z.string().optional(),
  /** ISBN-13 preferred; ISBN-10 also accepted */
  isbn: z.string().optional(),
  /** OCLC number (for library systems) */
  sameAs: z.union([z.string(), z.array(z.string())]).optional(),
  /** Edition number, e.g. "2nd" */
  bookEdition: z.string().optional(),
  /** Publication date for this edition */
  datePublished: z.string().optional(),
  /** Landing page for this edition */
  url: z.string().url().optional(),
  /** Authors of this edition (may differ from work author) */
  author: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  /** ReadAction or BorrowAction for Google Book Actions */
  potentialAction: z.union([
    ReadActionSchema,
    BorrowActionSchema,
    z.array(z.union([ReadActionSchema, BorrowActionSchema])),
  ]).optional(),
  /** Offer — purchase price */
  offers: z.union([OfferSchema, z.array(OfferSchema)]).optional(),
});

export type BookEdition = z.infer<typeof BookEditionSchema>;

// ─── Book (Work) ──────────────────────────────────────────────────────────────

/**
 * schema.org/Book — the intellectual work (all editions combined).
 * Google Book Actions use a two-level structure:
 *   - This schema describes the work (name, author, etc.)
 *   - `workExample` entries describe individual editions with `potentialAction`
 *
 * Book Actions are invite-only. Register at:
 * https://developers.google.com/search/docs/appearance/structured-data/book
 */
export const BookSchema = z.object({
  "@type": z.literal("Book").default("Book"),
  /** Stable URL identifying this work */
  "@id": z.string().optional(),
  name: z.string(),
  /** Primary author(s) of the work */
  author: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]),
  /** Canonical URL for the book's landing page */
  url: z.string().url().optional(),
  /** Cover image */
  image: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),
  description: z.string().optional(),
  /** ISBN of the primary edition */
  isbn: z.string().optional(),
  /** Same-as links (e.g., Open Library, WorldCat) */
  sameAs: z.union([z.string(), z.array(z.string())]).optional(),
  /** Specific editions — each may have ReadAction / BorrowAction */
  workExample: z.union([BookEditionSchema, z.array(BookEditionSchema)]).optional(),
  /** Publisher of the primary edition */
  publisher: z.object({
    "@type": z.union([z.literal("Organization"), z.literal("Person")]),
    name: z.string(),
    url: z.string().url().optional(),
  }).optional(),
  /** Number of pages */
  numberOfPages: z.number().int().positive().optional(),
  /** Original publication year */
  datePublished: z.string().optional(),
  /** Genres */
  genre: z.union([z.string(), z.array(z.string())]).optional(),
  /** BCP 47 language tag */
  inLanguage: z.string().optional(),
  /** Aggregate rating across editions */
  aggregateRating: z.lazy(() =>
    z.object({ "@type": z.string() }).catchall(z.unknown())
  ).optional(),
});

export type Book = z.infer<typeof BookSchema>;

export const createBook = makeFactory(BookSchema);
