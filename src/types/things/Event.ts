import { z } from "zod";
import { extendThing } from "./Thing";
import { makeFactory } from "../../core/base";
import { PostalAddressSchema } from "../shared/PostalAddress";
import { OfferSchema } from "../shared/Offer";
import { AggregateRatingSchema } from "../shared/Rating";
import { PersonOrOrgRef } from "../shared/PersonOrOrgRef";
import { ImageOrUrl } from "../shared/ImageObject";
import { VideoObjectSchema } from "../shared/VideoObject";

/**
 * Event status enum — transforms to full schema.org URLs.
 * Used in eventStatus field.
 */
export const EventStatusType = z
  .enum([
    "EventScheduled",
    "EventCancelled",
    "EventMovedOnline",
    "EventPostponed",
    "EventRescheduled",
  ])
  .transform((v) => `https://schema.org/${v}`);

/**
 * Event attendance mode enum — transforms to full schema.org URLs.
 */
export const EventAttendanceMode = z
  .enum([
    "OfflineEventAttendanceMode",
    "OnlineEventAttendanceMode",
    "MixedEventAttendanceMode",
  ])
  .transform((v) => `https://schema.org/${v}`);

const PlaceRef = z.union([
  z.string(),
  z.object({ "@id": z.string() }),
  z.object({
    "@type": z.literal("Place").default("Place"),
    name: z.string().optional(),
    address: z.union([z.string(), PostalAddressSchema]).optional(),
    url: z.url().optional(),
  }),
  z.object({
    "@type": z.literal("VirtualLocation").default("VirtualLocation"),
    url: z.url(),
    name: z.string().optional(),
  }),
  PostalAddressSchema,
]);

/**
 * schema.org/Event
 * Google required: name, startDate, location
 * Google recommended: endDate, eventStatus, image, offers, organizer, performer
 */
export const EventSchema = extendThing("Event", {
  // Required by Google:
  name: z.string(),
  startDate: z.string(), // ISO 8601
  // Recommended by Google:
  endDate: z.string().optional(), // ISO 8601
  location: PlaceRef.optional(),
  eventStatus: EventStatusType.optional(),
  eventAttendanceMode: EventAttendanceMode.optional(),
  offers: z.union([OfferSchema, z.array(OfferSchema)]).optional(),
  performer: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  organizer: z.union([PersonOrOrgRef, z.array(PersonOrOrgRef)]).optional(),
  image: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),
  description: z.string().optional(),
  previousStartDate: z.string().optional(), // ISO 8601 — for rescheduled events
  aggregateRating: AggregateRatingSchema.optional(),
  // Sub-events (accept @id refs for @graph cross-referencing):
  subEvent: z
    .lazy(() =>
      z.array(z.union([
        z.object({ "@id": z.string() }),
        z.object({ "@type": z.string() }).catchall(z.unknown()),
      ])),
    )
    .optional(),
  superEvent: z
    .union([
      z.object({ "@id": z.string() }),
      z.lazy(() => z.object({ "@type": z.string() }).catchall(z.unknown())),
    ])
    .optional(),
  // Additional:
  inLanguage: z
    .union([
      z.string(),
      z.object({
        "@type": z.literal("Language").default("Language"),
        name: z.string(),
      }),
    ])
    .optional(),
  isAccessibleForFree: z.boolean().optional(),
  maximumAttendeeCapacity: z.number().int().nonnegative().optional(),
  remainingAttendeeCapacity: z.number().int().nonnegative().optional(),
  typicalAgeRange: z.string().optional(),
  video: VideoObjectSchema.optional(),
});

export type Event = z.infer<typeof EventSchema>;

export const createEvent = makeFactory(EventSchema);
