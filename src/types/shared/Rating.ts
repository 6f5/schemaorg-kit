import { z } from "zod";
import { PersonOrOrgRef } from "./PersonOrOrgRef";

/**
 * schema.org/Rating
 * Base rating type.
 */
export const RatingSchema = z.object({
  "@type": z.literal("Rating").default("Rating"),
  ratingValue: z.union([z.number(), z.string()]),
  bestRating: z.union([z.number(), z.string()]).default(5),
  worstRating: z.union([z.number(), z.string()]).default(1),
  ratingExplanation: z.string().optional(),
  reviewAspect: z.string().optional(),
});

/**
 * schema.org/AggregateRating
 * Compiled rating from multiple users.
 * Google requires at least one of: reviewCount or ratingCount.
 */
export const AggregateRatingSchema = z.object({
  "@type": z.literal("AggregateRating").default("AggregateRating"),
  ratingValue: z.union([z.number(), z.string()]),
  reviewCount: z.number().int().nonnegative().optional(),
  ratingCount: z.number().int().nonnegative().optional(),
  bestRating: z.union([z.number(), z.string()]).default(5),
  worstRating: z.union([z.number(), z.string()]).default(1),
});

/**
 * schema.org/Review
 * An individual review of a Thing.
 * `itemReviewed` uses a passthrough lazy ref to avoid circular imports with Product.
 */
export const ReviewSchema = z.object({
  "@type": z.literal("Review").default("Review"),
  reviewBody: z.string().optional(),
  reviewRating: RatingSchema.optional(),
  author: PersonOrOrgRef,
  datePublished: z.string().optional(),        // ISO 8601 date
  publisher: PersonOrOrgRef.optional(),
  // itemReviewed: any Thing — kept loose to avoid circular imports
  itemReviewed: z.lazy(() =>
    z.object({ "@type": z.string() }).passthrough()
  ).optional(),
  name: z.string().optional(),                  // Review headline
  url: z.string().url().optional(),
});

/**
 * schema.org/EmployerAggregateRating
 * For employer/company pages in Google's job search experience.
 */
export const EmployerAggregateRatingSchema = AggregateRatingSchema.extend({
  "@type": z.literal("EmployerAggregateRating").default("EmployerAggregateRating"),
  itemReviewed: z.lazy(() =>
    z.object({ "@type": z.string(), name: z.string() }).passthrough()
  ).optional(),
});

export type Rating = z.infer<typeof RatingSchema>;
export type AggregateRating = z.infer<typeof AggregateRatingSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type EmployerAggregateRating = z.infer<typeof EmployerAggregateRatingSchema>;
