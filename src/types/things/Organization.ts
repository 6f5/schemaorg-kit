import { z } from "zod";
import { extendThing } from "./Thing";
import { makeFactory } from "../../core/base";
import { PostalAddressSchema } from "../shared/PostalAddress";
import { ContactPointSchema } from "../shared/ContactPoint";
import { ImageOrUrl } from "../shared/ImageObject";
import { MerchantReturnPolicySchema } from "../shared/Offer";
import { InteractionCounterSchema } from "../shared/InteractionCounter";
import { MemberProgramSchema } from "../shared/MemberProgram";
import { ShippingServiceSchema } from "../shared/ShippingService";

// Loose reference for nested org references (avoids circular type inference)
const NestedOrgRef = z.lazy(() =>
  z.object({ "@type": z.string(), name: z.string().optional() }).catchall(z.unknown())
);

export const OrganizationSchema = extendThing("Organization", {
  legalName: z.string().optional(),
  email: z.email().optional(),
  telephone: z.string().optional(),
  logo: ImageOrUrl.optional(),
  foundingDate: z.string().optional(),           // ISO 8601 date
  numberOfEmployees: z.object({
    "@type": z.literal("QuantitativeValue").default("QuantitativeValue"),
    value: z.number(),
  }).optional(),
  address: z.union([z.string(), PostalAddressSchema]).optional(),
  contactPoint: z.union([ContactPointSchema, z.array(ContactPointSchema)]).optional(),
  // Google Organization requirements:
  vatID: z.string().optional(),
  iso6523Code: z.string().optional(),            // e.g. "0060:123456789" (DUNS)
  taxID: z.string().optional(),
  leiCode: z.string().optional(),
  duns: z.string().optional(),
  globalLocationNumber: z.string().optional(),   // GS1 GLN
  naics: z.string().optional(),                  // NAICS industry code
  // Merchant-related (Google seller identity signals):
  hasMerchantReturnPolicy: MerchantReturnPolicySchema.optional(),
  hasShippingService: z
    .union([ShippingServiceSchema, z.array(ShippingServiceSchema)])
    .optional(),
  // Loyalty program:
  hasMemberProgram: z
    .union([MemberProgramSchema, z.array(MemberProgramSchema)])
    .optional(),
  // Interaction statistics:
  interactionStatistic: z
    .union([InteractionCounterSchema, z.array(InteractionCounterSchema)])
    .optional(),
  agentInteractionStatistic: z
    .union([InteractionCounterSchema, z.array(InteractionCounterSchema)])
    .optional(),
  // Hierarchical organization (loose refs to avoid circular type inference):
  subOrganization: NestedOrgRef.optional(),
  parentOrganization: NestedOrgRef.optional(),
  sameAs: z.union([z.string().url(), z.array(z.string().url())]).optional(),
});

export type Organization = z.infer<typeof OrganizationSchema>;

export const createOrganization = makeFactory(OrganizationSchema);

export const createNGO = makeFactory(
  OrganizationSchema.extend({ "@type": z.literal("NGO").default("NGO") })
);

export const createCorporation = makeFactory(
  OrganizationSchema.extend({ "@type": z.literal("Corporation").default("Corporation") })
);

/**
 * schema.org/OnlineStore — an e-commerce store operating online.
 * Google uses this for the Organization knowledge panel for online retailers.
 */
export const createOnlineStore = makeFactory(
  OrganizationSchema.extend({ "@type": z.literal("OnlineStore").default("OnlineStore") })
);

/**
 * schema.org/OnlineBusiness — an organization operating primarily online.
 * Use for SaaS companies, marketplaces, and other digital-first businesses.
 */
export const createOnlineBusiness = makeFactory(
  OrganizationSchema.extend({ "@type": z.literal("OnlineBusiness").default("OnlineBusiness") })
);
