import { z } from "zod";
import { extendThing } from "./Thing";
import { makeFactory } from "../../core/base";
import { PostalAddressSchema } from "../shared/PostalAddress";
import { GeoCoordinatesSchema } from "../shared/GeoCoordinates";
import { OpeningHoursSpecificationSchema } from "../shared/OpeningHoursSpecification";
import { ImageOrUrl } from "../shared/ImageObject";

/**
 * schema.org/Place
 * Base type for physical locations.
 * Extended by LocalBusiness, VacationRental, etc.
 */
export const PlaceSchema = extendThing("Place", {
  address: z.union([z.string(), PostalAddressSchema]).optional(),
  geo: GeoCoordinatesSchema.optional(),
  hasMap: z.url().optional(),
  photo: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),
  telephone: z.string().optional(),
  faxNumber: z.string().optional(),
  openingHoursSpecification: z
    .union([
      OpeningHoursSpecificationSchema,
      z.array(OpeningHoursSpecificationSchema),
    ])
    .optional(),
  specialOpeningHoursSpecification: z
    .union([
      OpeningHoursSpecificationSchema,
      z.array(OpeningHoursSpecificationSchema),
    ])
    .optional(),
  maximumAttendeeCapacity: z.number().int().nonnegative().optional(),
  isAccessibleForFree: z.boolean().optional(),
  publicAccess: z.boolean().optional(),
  amenityFeature: z
    .array(
      z.object({
        "@type": z
          .literal("LocationFeatureSpecification")
          .default("LocationFeatureSpecification"),
        name: z.string(),
        value: z.union([z.boolean(), z.string(), z.number()]),
      }),
    )
    .optional(),
  containedInPlace: z
    .lazy(() =>
      z
        .object({ "@type": z.string(), name: z.string().optional() })
        .catchall(z.unknown()),
    )
    .optional(),
});

export type Place = z.infer<typeof PlaceSchema>;

export const createPlace = makeFactory(PlaceSchema);
