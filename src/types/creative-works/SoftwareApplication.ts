import { z } from "zod";
import { makeFactory } from "../../core/base";
import { CreativeWorkSchema } from "./CreativeWork";
import { OfferSchema } from "../shared/Offer";
import { AggregateRatingSchema, ReviewSchema } from "../shared/Rating";
import { ImageOrUrl } from "../shared/ImageObject";

/**
 * Application category values supported by Google.
 */
export const ApplicationCategory = z.enum([
  "GameApplication",
  "SocialNetworkingApplication",
  "TravelApplication",
  "ShoppingApplication",
  "SportsApplication",
  "LifestyleApplication",
  "BusinessApplication",
  "DesignApplication",
  "DeveloperApplication",
  "DriverApplication",
  "EducationalApplication",
  "HealthApplication",
  "FinanceApplication",
  "SecurityApplication",
  "BrowserApplication",
  "CommunicationApplication",
  "DesktopEnhancementApplication",
  "EntertainmentApplication",
  "MultimediaApplication",
  "HomeApplication",
  "UtilitiesApplication",
  "ReferenceApplication",
]);

/**
 * schema.org/SoftwareApplication
 * Google required: name, offers.price, and at least one of aggregateRating or review
 * Google recommended: applicationCategory, operatingSystem
 */
export const SoftwareApplicationSchema = CreativeWorkSchema.extend({
  "@type": z.union([
    z.literal("SoftwareApplication"),
    z.literal("MobileApplication"),
    z.literal("WebApplication"),
    z.literal("VideoGame"),
  ]).default("SoftwareApplication"),
  // Required by Google:
  name: z.string(),
  // Recommended by Google:
  operatingSystem: z.union([z.string(), z.array(z.string())]).optional(),
  applicationCategory: z.union([ApplicationCategory, z.string()]).optional(),
  offers: z.union([OfferSchema, z.array(OfferSchema)]).optional(),
  aggregateRating: AggregateRatingSchema.optional(),
  review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
  // Optional:
  softwareVersion: z.string().optional(),
  fileSize: z.string().optional(),
  downloadUrl: z.url().optional(),
  screenshot: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),
  featureList: z.union([z.string(), z.array(z.string())]).optional(),
  installUrl: z.url().optional(),
  softwareRequirements: z.string().optional(),
  permissions: z.string().optional(),
  // WebApplication specific:
  browserRequirements: z.string().optional(),
  // MobileApplication specific:
  countriesSupported: z.union([z.string(), z.array(z.string())]).optional(),
  countriesNotSupported: z.union([z.string(), z.array(z.string())]).optional(),
  availableOnDevice: z.union([z.string(), z.array(z.string())]).optional(),
  // VideoGame specific:
  gamePlatform: z.union([z.string(), z.array(z.string())]).optional(),
  playMode: z.string().optional(),
  genre: z.union([z.string(), z.array(z.string())]).optional(),
});

export type SoftwareApplication = z.infer<typeof SoftwareApplicationSchema>;

export const createSoftwareApplication = makeFactory(SoftwareApplicationSchema);

export const createMobileApplication = makeFactory(
  SoftwareApplicationSchema.extend({
    "@type": z.literal("MobileApplication").default("MobileApplication"),
  })
);

export const createWebApplication = makeFactory(
  SoftwareApplicationSchema.extend({
    "@type": z.literal("WebApplication").default("WebApplication"),
  })
);
