import { z } from "zod";
import { makeFactory } from "../../core/base";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";

// ─── Claim ───────────────────────────────────────────────────────────────────

export const ClaimSchema = z.object({
  "@type": z.literal("Claim").default("Claim"),
  /** The author who made the claim */
  author: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  /** ISO 8601 date the claim was made */
  datePublished: z.string().optional(),
  /** URL of the first appearance of the claim */
  firstAppearance: z.string().url().optional(),
  /** URL(s) of other appearances of the claim */
  appearance: z
    .union([z.string().url(), z.array(z.string().url())])
    .optional(),
});

export type Claim = z.infer<typeof ClaimSchema>;

// ─── ClaimReview ─────────────────────────────────────────────────────────────

export const ClaimReviewSchema = z.object({
  "@type": z.literal("ClaimReview").default("ClaimReview"),
  /** Canonical URL of the fact-check article */
  url: z.string().url(),
  /** The text of the claim being evaluated */
  claimReviewed: z.string(),
  /** The rating given by the fact-checker */
  reviewRating: z.object({
    "@type": z.literal("Rating").default("Rating"),
    /** Human-readable label, e.g. "False", "Mostly True" */
    alternateName: z.string(),
    /** Numeric rating value (optional for fact-check) */
    ratingValue: z.union([z.number(), z.string()]).optional(),
    /** Maximum possible rating, e.g. 5 */
    bestRating: z.union([z.number(), z.string()]).optional(),
    /** Minimum possible rating, e.g. 1 */
    worstRating: z.union([z.number(), z.string()]).optional(),
    /** Name of the rating scale */
    name: z.string().optional(),
    /** URL of the rating explanation page */
    image: z.string().url().optional(),
  }),
  /** The fact-checking author / organization */
  author: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  /** The claim being reviewed */
  itemReviewed: ClaimSchema.optional(),
  /** ISO 8601 date the review was published */
  datePublished: z.string().optional(),
  /** ISO 8601 date the review was last modified */
  dateModified: z.string().optional(),
  /** Language code of the review, e.g. "en" */
  inLanguage: z.string().optional(),
});

export type ClaimReview = z.infer<typeof ClaimReviewSchema>;

export const createClaimReview = makeFactory(ClaimReviewSchema);
