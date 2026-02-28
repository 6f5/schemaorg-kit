/**
 * A branded string representing a JSON-LD @id value.
 * Format: "{origin}/#{fragment}" (URL hash fragment convention).
 *
 * SchemaId is assignable to `string` (works with `@id: z.string().optional()`),
 * but a plain `string` cannot be assigned to `SchemaId` without the factory.
 */
export type SchemaId = string & { readonly __brand: "SchemaId" };

/**
 * Centralized ID generator for JSON-LD @id values.
 * Produces URL hash-fragment IDs following the "{origin}/#{fragment}" convention.
 *
 * Use this to avoid typos and inconsistency when cross-referencing entities
 * in a @graph array via their @id fields.
 *
 * @example
 * const ids = new SchemaIds("https://example.com");
 *
 * const graph = createGraph([
 *   createOrganization({ "@id": ids.organization(), name: "Acme Corp" }),
 *   createWebSite({ "@id": ids.website(), publisher: ids.ref("organization") }),
 * ]);
 */
export class SchemaIds {
  constructor(public readonly origin: string) {}

  /** @internal Build an ID from origin + fragment */
  private id(fragment: string): SchemaId {
    return `${this.origin}/#${fragment}` as SchemaId;
  }

  // ── Well-known entity IDs ───────────────────────────────────────────────

  // Things
  organization(): SchemaId { return this.id("organization"); }
  localBusiness(): SchemaId { return this.id("localbusiness"); }
  person(): SchemaId { return this.id("person"); }
  product(): SchemaId { return this.id("product"); }
  event(): SchemaId { return this.id("event"); }
  place(): SchemaId { return this.id("place"); }
  movie(): SchemaId { return this.id("movie"); }

  // Creative works
  website(): SchemaId { return this.id("website"); }
  webpage(): SchemaId { return this.id("webpage"); }
  article(): SchemaId { return this.id("article"); }
  breadcrumb(): SchemaId { return this.id("breadcrumb"); }
  dataset(): SchemaId { return this.id("dataset"); }
  recipe(): SchemaId { return this.id("recipe"); }
  course(): SchemaId { return this.id("course"); }
  softwareApplication(): SchemaId { return this.id("softwareapplication"); }

  // Intangibles & other
  faqPage(): SchemaId { return this.id("faqpage"); }
  jobPosting(): SchemaId { return this.id("jobposting"); }
  vacationRental(): SchemaId { return this.id("vacationrental"); }
  profilePage(): SchemaId { return this.id("profilepage"); }

  // ── Custom IDs ──────────────────────────────────────────────────────────

  /**
   * Generate an ID with any custom fragment.
   * @example ids.custom("hero-banner") // "https://example.com/#hero-banner"
   */
  custom(fragment: string): SchemaId {
    return this.id(fragment);
  }

  /**
   * Generate an ID scoped to a specific page path.
   * @example ids.forPath("/about", "webpage") // "https://example.com/about#webpage"
   */
  forPath(path: string, fragment: string): SchemaId {
    return `${this.origin}${path}#${fragment}` as SchemaId;
  }

  // ── Reference helper ────────────────────────────────────────────────────

  /**
   * Returns a `{ "@id": "..." }` reference object for cross-referencing
   * entities within a @graph. Pass to fields like publisher, organizer, etc.
   *
   * @example
   * createWebSite({ publisher: ids.ref("organization"), ... })
   */
  ref(fragment: string): { "@id": SchemaId } {
    return { "@id": this.id(fragment) };
  }
}
