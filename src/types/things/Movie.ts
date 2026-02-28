import { z } from "zod";
import { extendThing } from "./Thing";
import { makeFactory } from "../../core/base";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";
import { AggregateRatingSchema, ReviewSchema } from "../shared/Rating";
import { ImageOrUrl } from "../shared/ImageObject";
import { VideoObjectSchema } from "../shared/VideoObject";

/**
 * schema.org/Movie
 * Used in Google's Movie carousel rich result.
 * Google recommended: name, image, aggregateRating, director
 */
export const MovieSchema = extendThing("Movie", {
  // Recommended by Google:
  director: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  actor: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  author: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  producer: PersonOrOrgRef.optional(),
  musicBy: PersonOrOrgRef.optional(),
  duration: z.string().optional(), // ISO 8601, e.g. "PT2H15M"
  dateCreated: z.string().optional(), // ISO 8601
  datePublished: z.string().optional(), // ISO 8601
  countryOfOrigin: z.string().optional(), // ISO 3166
  inLanguage: z
    .union([
      z.string(),
      z.object({
        "@type": z.literal("Language").default("Language"),
        name: z.string(),
      }),
    ])
    .optional(),
  aggregateRating: AggregateRatingSchema.optional(),
  review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
  trailer: VideoObjectSchema.optional(),
  image: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),
  // Classification:
  contentRating: z.string().optional(), // e.g. "MPAA PG-13"
  genre: z.union([z.string(), z.array(z.string())]).optional(),
  // For carousels: itemListElement links
  sameAs: z.union([z.url(), z.array(z.url())]).optional(),
});

export type Movie = z.infer<typeof MovieSchema>;

export const createMovie = makeFactory(MovieSchema);
