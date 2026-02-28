import { z } from "zod";
import { extendThing } from "./Thing";
import { makeFactory } from "../../core/base";
import { OfferSchema, AggregateOfferSchema, MerchantReturnPolicySchema } from "../shared/Offer";
import { AggregateRatingSchema, ReviewSchema } from "../shared/Rating";
import { ImageOrUrl } from "../shared/ImageObject";

// ─── Certification ───────────────────────────────────────────────────────────

/**
 * schema.org/Certification
 * Used on Product.hasCertification for regulatory / quality certifications
 * (e.g. CE mark, Energy Star, Fair Trade, organic certifications).
 * Google may display certification badges in Product Merchant Listings.
 */
export const CertificationSchema = z.object({
  "@type": z.literal("Certification").default("Certification"),
  name: z.string(),
  url: z.string().url().optional(),
  issuedBy: z.object({
    "@type": z.literal("Organization").default("Organization"),
    name: z.string(),
    url: z.string().url().optional(),
  }).optional(),
  certificationRatingValue: z.string().optional(),
  certificationStatus: z.string().optional(),
  validFrom: z.string().optional(),
  validThrough: z.string().optional(),
});

export type Certification = z.infer<typeof CertificationSchema>;

// ─── 3DModel ─────────────────────────────────────────────────────────────────

/**
 * schema.org/3DModel
 * Used on Product.subjectOf for 3D product models.
 * Google displays interactive 3D views for eligible products in Search and Images.
 */
export const ThreeDModelSchema = z.object({
  "@type": z.literal("3DModel").default("3DModel"),
  contentUrl: z.string().url(),
  /** MIME type, e.g. "model/gltf-binary", "model/gltf+json" */
  encodingFormat: z.string().optional(),
  name: z.string().optional(),
});

// Loose refs for mutual circular relationship between Product and ProductGroup
const LooseProductRef = z.lazy(() =>
  z.object({ "@type": z.string() }).catchall(z.unknown())
);
const LooseProductGroupRef = z.lazy(() =>
  z.object({ "@type": z.string() }).catchall(z.unknown())
);

// ─── SizeSpecification ───────────────────────────────────────────────────────

export const SizeSpecificationSchema = z.object({
  "@type": z.literal("SizeSpecification").default("SizeSpecification"),
  name: z.string().optional(),
  /** Size system, e.g. "US", "EU", "UK", "JP" */
  sizeSystem: z.string().optional(),
  /** Size group, e.g. "Petite", "Plus", "Maternity", "Regular", "Tall" */
  sizeGroup: z.union([z.string(), z.array(z.string())]).optional(),
});

export type SizeSpecification = z.infer<typeof SizeSpecificationSchema>;

// ─── PeopleAudience ──────────────────────────────────────────────────────────

export const PeopleAudienceSchema = z.object({
  "@type": z.literal("PeopleAudience").default("PeopleAudience"),
  /** "Male", "Female", "Unknown" */
  suggestedGender: z.string().optional(),
  suggestedMinAge: z.number().optional(),
  suggestedMaxAge: z.number().optional(),
});

export type PeopleAudience = z.infer<typeof PeopleAudienceSchema>;

export const ProductSchema = extendThing("Product", {
  sku: z.string().optional(),
  // GTIN identifiers (Google Product requirement):
  gtin: z.string().optional(),
  gtin8: z.string().optional(),
  gtin12: z.string().optional(),
  gtin13: z.string().optional(),
  gtin14: z.string().optional(),
  mpn: z.string().optional(),                    // Manufacturer Part Number
  brand: z.union([
    z.string(),
    z.object({
      "@type": z.union([z.literal("Brand"), z.literal("Organization")]),
      name: z.string(),
    }),
  ]).optional(),
  offers: z.union([
    OfferSchema,
    AggregateOfferSchema,
    z.array(z.union([OfferSchema, AggregateOfferSchema])),
  ]).optional(),
  aggregateRating: AggregateRatingSchema.optional(),
  review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  weight: z.object({
    "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
    value: z.number(),
    unitCode: z.string(),
  }).optional(),
  image: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),
  hasMerchantReturnPolicy: MerchantReturnPolicySchema.optional(),
  isVariantOf: LooseProductGroupRef.optional(),
  /** Certifications (CE, Energy Star, Fair Trade, etc.) */
  hasCertification: z.union([CertificationSchema, z.array(CertificationSchema)]).optional(),
  /** 3D models for interactive product views in Google Search/Images */
  subjectOf: z.union([ThreeDModelSchema, z.array(ThreeDModelSchema)]).optional(),
  /** Pattern design, e.g. "Polka dots", "Stripes" */
  pattern: z.string().optional(),
  /** Size as a string or structured SizeSpecification */
  size: z.union([z.string(), SizeSpecificationSchema]).optional(),
  /** Target audience (gender, age range) */
  audience: PeopleAudienceSchema.optional(),
  /** Positive aspects as an ItemList */
  positiveNotes: z
    .object({
      "@type": z.literal("ItemList").default("ItemList"),
      itemListElement: z.array(
        z.object({
          "@type": z.literal("ListItem").default("ListItem"),
          position: z.number().int().positive(),
          name: z.string(),
        })
      ),
    })
    .optional(),
  /** Negative aspects as an ItemList */
  negativeNotes: z
    .object({
      "@type": z.literal("ItemList").default("ItemList"),
      itemListElement: z.array(
        z.object({
          "@type": z.literal("ListItem").default("ListItem"),
          position: z.number().int().positive(),
          name: z.string(),
        })
      ),
    })
    .optional(),
  /** ID of the ProductGroup this variant belongs to */
  inProductGroupWithID: z.string().optional(),
});

/**
 * schema.org/ProductGroup
 * Groups product variants (by size, color, etc.)
 */
export const ProductGroupSchema = extendThing("ProductGroup", {
  variesBy: z.union([z.string(), z.array(z.string())]).optional(),
  hasVariant: z.array(LooseProductRef).optional(),
  productGroupID: z.string().optional(),
  sku: z.string().optional(),
  gtin: z.string().optional(),
  brand: z.union([
    z.string(),
    z.object({
      "@type": z.union([z.literal("Brand"), z.literal("Organization")]),
      name: z.string(),
    }),
  ]).optional(),
  offers: z.union([OfferSchema, z.array(OfferSchema)]).optional(),
  aggregateRating: AggregateRatingSchema.optional(),
  review: z.union([ReviewSchema, z.array(ReviewSchema)]).optional(),
  audience: PeopleAudienceSchema.optional(),
  image: z.union([ImageOrUrl, z.array(ImageOrUrl)]).optional(),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductGroup = z.infer<typeof ProductGroupSchema>;
export type ThreeDModel = z.infer<typeof ThreeDModelSchema>;

// Re-export shared types for backward compatibility
export { OfferSchema, AggregateOfferSchema, MerchantReturnPolicySchema } from "../shared/Offer";
export { AggregateRatingSchema } from "../shared/Rating";
export type { Offer, AggregateOffer, MerchantReturnPolicy } from "../shared/Offer";
export type { AggregateRating } from "../shared/Rating";

export const createProduct = makeFactory(ProductSchema);
export const createProductGroup = makeFactory(ProductGroupSchema);
export { createOffer } from "../shared/Offer";
