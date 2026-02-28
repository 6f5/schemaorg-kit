import { z } from "zod";
import { extendThing } from "./Thing";
import { makeFactory } from "../../core/base";
import { PostalAddressSchema } from "../shared/PostalAddress";
import { InteractionCounterSchema } from "../shared/InteractionCounter";

export const PersonSchema = extendThing("Person", {
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  email: z.string().email().optional(),
  telephone: z.string().optional(),
  jobTitle: z.string().optional(),
  worksFor: z.lazy(() => z.object({ "@type": z.string(), name: z.string() })).optional(),
  birthDate: z.string().optional(), // ISO 8601
  gender: z.enum(["Male", "Female", "Unknown"]).optional(),
  nationality: z.string().optional(),
  interactionStatistic: z
    .union([InteractionCounterSchema, z.array(InteractionCounterSchema)])
    .optional(),
  agentInteractionStatistic: z
    .union([InteractionCounterSchema, z.array(InteractionCounterSchema)])
    .optional(),
  address: z.union([z.string(), PostalAddressSchema]).optional(),
});

export type Person = z.infer<typeof PersonSchema>;

export const createPerson = makeFactory(PersonSchema);
