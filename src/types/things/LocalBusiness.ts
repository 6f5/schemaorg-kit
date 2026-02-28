import { z } from "zod";
import { makeFactory } from "../../core/base";
import { PlaceSchema } from "./Place";
import { ContactPointSchema } from "../shared/ContactPoint";
import { ImageOrUrl } from "../shared/ImageObject";
import { AggregateRatingSchema, ReviewSchema, EmployerAggregateRatingSchema } from "../shared/Rating";
import { MerchantReturnPolicySchema } from "../shared/Offer";

/**
 * schema.org/LocalBusiness
 * Extends Place with business-specific fields.
 * Google required: name, address
 * Google recommended: aggregateRating, geo, openingHoursSpecification, telephone, url
 */
export const LocalBusinessSchema = PlaceSchema.extend({
  "@type": z.union([
    z.literal("LocalBusiness"),
    z.literal("Restaurant"),
    z.literal("Store"),
    z.literal("FoodEstablishment"),
    z.literal("HealthAndBeautyBusiness"),
    z.literal("MedicalBusiness"),
    z.literal("FinancialService"),
    z.literal("LegalService"),
    z.literal("RealEstateAgent"),
    z.literal("AutoDealer"),
    z.literal("DaySpa"),
    z.literal("HairSalon"),
    z.literal("Hotel"),
    z.literal("LodgingBusiness"),
    z.literal("GroceryStore"),
    z.literal("ShoppingCenter"),
    z.literal("TravelAgency"),
    // Google allows @type to be a string or array for multi-typed entities
    z.string(),
    z.array(z.string()),
  ]).default("LocalBusiness"),
  // Business identity:
  legalName: z.string().optional(),
  email: z.string().email().optional(),
  logo: ImageOrUrl.optional(),
  contactPoint: z.union([ContactPointSchema, z.array(ContactPointSchema)]).optional(),
  // Ratings & reviews:
  aggregateRating: z.union([AggregateRatingSchema, EmployerAggregateRatingSchema]).optional(),
  review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
  // Pricing:
  priceRange: z.string().optional(),             // e.g. "$$$"
  currenciesAccepted: z.string().optional(),
  paymentAccepted: z.string().optional(),
  // Food establishment specific:
  servesCuisine: z.union([z.string(), z.array(z.string())]).optional(),
  hasMenu: z.string().url().optional(),
  acceptsReservations: z.union([z.boolean(), z.string().url()]).optional(),
  // Merchant signals:
  vatID: z.string().optional(),
  iso6523Code: z.string().optional(),
  hasMerchantReturnPolicy: MerchantReturnPolicySchema.optional(),
  sameAs: z.union([z.string().url(), z.array(z.string().url())]).optional(),
  // Departments (nested LocalBusiness):
  department: z.lazy(() =>
    z.union([
      z.object({ "@type": z.string() }).catchall(z.unknown()),
      z.array(z.object({ "@type": z.string() }).catchall(z.unknown())),
    ])
  ).optional(),
  // Opening hours in string format (alternative to openingHoursSpecification):
  openingHours: z.union([z.string(), z.array(z.string())]).optional(),
});

export type LocalBusiness = z.infer<typeof LocalBusinessSchema>;

export const createLocalBusiness = makeFactory(LocalBusinessSchema);

export const createRestaurant = makeFactory(
  LocalBusinessSchema.extend({ "@type": z.literal("Restaurant").default("Restaurant") })
);

export const createHotel = makeFactory(
  LocalBusinessSchema.extend({ "@type": z.literal("Hotel").default("Hotel") })
);
