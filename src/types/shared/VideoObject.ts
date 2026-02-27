import { z } from "zod";
import { makeFactory } from "../../core/base";
import { ImageOrUrl } from "./ImageObject";

/**
 * schema.org/Clip
 * A specific segment of a VideoObject.
 * Used by Google for Video key moments.
 */
export const ClipSchema = z.object({
  "@type": z.literal("Clip").default("Clip"),
  name: z.string(),
  startOffset: z.number(),             // seconds from start
  endOffset: z.number().optional(),    // seconds from start
  url: z.string().url().optional(),    // URL pointing to this clip
});

/**
 * schema.org/BroadcastEvent
 * Used for live-stream information.
 */
export const BroadcastEventSchema = z.object({
  "@type": z.literal("BroadcastEvent").default("BroadcastEvent"),
  isLiveBroadcast: z.boolean().optional(),
  startDate: z.string().optional(),    // ISO 8601
  endDate: z.string().optional(),
});

/**
 * schema.org/SeekToAction
 * Enables Video key moments with timestamp deep-links.
 * The 'startOffset-input' property is a Google-specific annotation.
 */
export const SeekToActionSchema = z.object({
  "@type": z.literal("SeekToAction").default("SeekToAction"),
  /** URL template with {seek_to_second_number} placeholder */
  target: z.string(),
  "startOffset-input": z
    .string()
    .default("required name=seek_to_second_number"),
});

export type SeekToAction = z.infer<typeof SeekToActionSchema>;

/**
 * schema.org/VideoObject
 * Shared by Recipe (video field) and standalone Video rich results.
 * Google required: name, thumbnailUrl, uploadDate
 * Google recommended: description, duration, contentUrl, embedUrl
 */
export const VideoObjectSchema = z.object({
  "@type": z.literal("VideoObject").default("VideoObject"),
  // Required by Google:
  name: z.string(),
  thumbnailUrl: z.union([z.string().url(), z.array(z.string().url())]),
  uploadDate: z.string(),              // ISO 8601 date
  // Recommended by Google:
  description: z.string().optional(),
  duration: z.string().optional(),     // ISO 8601 duration, e.g. "PT1M54S"
  contentUrl: z.string().url().optional(),
  embedUrl: z.string().url().optional(),
  // Optional:
  expires: z.string().optional(),      // ISO 8601 — when video is no longer available
  hasPart: z.array(ClipSchema).optional(),
  interactionStatistic: z.object({
    "@type": z.literal("InteractionCounter").default("InteractionCounter"),
    interactionType: z.literal("https://schema.org/WatchAction").default("https://schema.org/WatchAction"),
    userInteractionCount: z.number().int().nonnegative(),
  }).optional(),
  regionsAllowed: z.union([z.string(), z.array(z.string())]).optional(),
  ineligibleRegion: z.union([z.string(), z.array(z.string())]).optional(),
  requiresSubscription: z.boolean().optional(),
  isLiveBroadcast: z.boolean().optional(),
  publication: BroadcastEventSchema.optional(),
  thumbnail: ImageOrUrl.optional(),
  /** SeekToAction enables Video key moments via URL template */
  potentialAction: z
    .union([SeekToActionSchema, z.array(SeekToActionSchema)])
    .optional(),
});

export type Clip = z.infer<typeof ClipSchema>;
export type BroadcastEvent = z.infer<typeof BroadcastEventSchema>;
export type VideoObject = z.infer<typeof VideoObjectSchema>;

export const createVideoObject = makeFactory(VideoObjectSchema);
