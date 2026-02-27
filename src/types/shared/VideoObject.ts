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
  url: z.url().optional(),             // URL pointing to this clip
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
 * schema.org/VideoObject
 * Shared by Recipe (video field) and standalone Video rich results.
 * Google required: name, thumbnailUrl, uploadDate
 * Google recommended: description, duration, contentUrl, embedUrl
 */
export const VideoObjectSchema = z.object({
  "@type": z.literal("VideoObject").default("VideoObject"),
  // Required by Google:
  name: z.string(),
  thumbnailUrl: z.union([z.url(), z.array(z.url())]),
  uploadDate: z.string(),              // ISO 8601 date
  // Recommended by Google:
  description: z.string().optional(),
  duration: z.string().optional(),     // ISO 8601 duration, e.g. "PT1M54S"
  contentUrl: z.url().optional(),
  embedUrl: z.url().optional(),
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
});

export type Clip = z.infer<typeof ClipSchema>;
export type BroadcastEvent = z.infer<typeof BroadcastEventSchema>;
export type VideoObject = z.infer<typeof VideoObjectSchema>;

export const createVideoObject = makeFactory(VideoObjectSchema);
