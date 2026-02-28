import { z } from "zod";
import { makeFactory } from "../../core/base";
import { LocalBusinessSchema } from "../things/LocalBusiness";
import { OfferSchema } from "../shared/Offer";
import { ImageOrUrl } from "../shared/ImageObject";

// ─── BedDetails ──────────────────────────────────────────────────────────────

/** Google's exact BedType values per the Vacation Rental spec */
export const BedTypeEnum = z.enum([
  "CaliforniaKing",
  "King",
  "Queen",
  "Full",
  "Double",
  "SemiDouble",
  "Single",
]);

export const BedDetailsSchema = z.object({
  "@type": z.literal("BedDetails").default("BedDetails"),
  numberOfBeds: z.number().int().positive().optional(),
  typeOfBed: z.union([BedTypeEnum, z.string()]).optional(),
});

export type BedDetails = z.infer<typeof BedDetailsSchema>;

// ─── LocationFeatureSpecification ────────────────────────────────────────────

const LocationFeatureSpecificationSchema = z.object({
  "@type": z.literal("LocationFeatureSpecification").default("LocationFeatureSpecification"),
  name: z.string(),
  value: z.union([z.boolean(), z.string(), z.number()]).optional(),
});

// ─── Accommodation ───────────────────────────────────────────────────────────

/**
 * schema.org/Accommodation
 * Represents a specific unit within a VacationRental (bedroom, suite, etc.).
 * Used as `containsPlace` on VacationRentalSchema — required by Google for
 * Vacation Rental rich results.
 */
export const AccommodationSchema = z.object({
  "@type": z.literal("Accommodation").default("Accommodation"),
  name: z.string().optional(),
  occupancy: z.object({
    "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
    value: z.number().int().positive().optional(),
    maxValue: z.number().int().positive().optional(),
    minValue: z.number().int().positive().optional(),
  }).optional(),
  numberOfRooms: z.number().int().nonnegative().optional(),
  numberOfBedrooms: z.number().int().nonnegative().optional(),
  numberOfBathroomsTotal: z.number().int().nonnegative().optional(),
  floorSize: z.object({
    "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
    value: z.number(),
    /** "MTK" = sq metres, "FTK" = sq ft */
    unitCode: z.string().optional(),
  }).optional(),
  bed: z.union([BedDetailsSchema, z.array(BedDetailsSchema)]).optional(),
  amenityFeature: z.union([
    LocationFeatureSpecificationSchema,
    z.array(LocationFeatureSpecificationSchema),
  ]).optional(),
  petsAllowed: z.union([z.boolean(), z.string()]).optional(),
  url: z.string().url().optional(),
  /** "EntirePlace", "PrivateRoom", or "SharedRoom" */
  additionalType: z.string().optional(),
});

export type Accommodation = z.infer<typeof AccommodationSchema>;

/**
 * schema.org/VacationRental (a LodgingBusiness subtype)
 * Used by Google's Vacation Rental rich result.
 * Google recommended: name, description, image, address, geo, offers, aggregateRating
 */
export const VacationRentalSchema = LocalBusinessSchema.extend({
  "@type": z.literal("VacationRental").default("VacationRental"),
  // Required by Google:
  name: z.string(),
  // Recommended by Google:
  description: z.string().optional(),
  image: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),
  // Lodging-specific:
  petsAllowed: z.union([z.boolean(), z.string()]).optional(),
  checkinTime: z.string().optional(),            // e.g. "15:00"
  checkoutTime: z.string().optional(),           // e.g. "11:00"
  numberOfRooms: z.union([
    z.number(),
    z.object({
      "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
      value: z.number(),
    }),
  ]).optional(),
  occupancy: z.object({
    "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
    maxValue: z.number(),
    minValue: z.number().optional(),
  }).optional(),
  starRating: z.object({
    "@type": z.literal("Rating").default("Rating"),
    ratingValue: z.number().min(0).max(5),
  }).optional(),
  offers: z.union([OfferSchema, z.array(OfferSchema)]).optional(),
  leaseLength: z.union([z.string(), z.object({
    "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
    value: z.number(),
    unitCode: z.string().optional(),
  })]).optional(),
  floorSize: z.object({
    "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
    value: z.number(),
    unitCode: z.string().optional(),             // e.g. "MTK" (square meters), "FTK" (sq ft)
  }).optional(),
  numberOfBathroomsTotal: z.number().int().nonnegative().optional(),
  numberOfBedrooms: z.number().int().nonnegative().optional(),
  tourBookingPage: z.string().url().optional(),
  /** Accommodation unit(s) within the rental property — required by Google */
  containsPlace: z.union([AccommodationSchema, z.array(AccommodationSchema)]).optional(),
  brand: z
    .union([
      z.string(),
      z.object({
        "@type": z.union([z.literal("Brand"), z.literal("Organization")]),
        name: z.string(),
      }),
    ])
    .optional(),
  /** Language(s) the host speaks — ISO 639-1 codes or language names */
  knowsLanguage: z.union([z.string(), z.array(z.string())]).optional(),
  /** "EntirePlace", "PrivateRoom", or "SharedRoom" */
  additionalType: z.string().optional(),
});

export type VacationRental = z.infer<typeof VacationRentalSchema>;

export const createVacationRental = makeFactory(VacationRentalSchema);
