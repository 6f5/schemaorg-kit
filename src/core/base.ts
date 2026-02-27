import { z, ZodObject, ZodRawShape } from "zod";

export const withContext = <T extends ZodRawShape>(shape: T) =>
  z.object({
    "@context": z.literal("https://schema.org").default("https://schema.org"),
    ...shape,
  });

/**
 * Wraps a Zod schema with schema.org utility methods.
 * All types in the lib return a SchemaNode.
 */
export class SchemaNode<T extends ZodRawShape> {
  constructor(
    private readonly schema: ZodObject<T>,
    private readonly data: z.infer<ZodObject<T>>
  ) {}

  /** Returns the raw validated object */
  toObject(): z.infer<ZodObject<T>> {
    return this.data;
  }

  /** Returns a JSON-LD ready object with @context */
  toJsonLd(): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      ...this.data,
    };
  }

  /** Returns a <script type="application/ld+json"> tag string */
  toScript(): string {
    return `<script type="application/ld+json">\n${JSON.stringify(this.toJsonLd(), null, 2)}\n</script>`;
  }

  /** Returns prettified JSON string */
  toString(): string {
    return JSON.stringify(this.toJsonLd(), null, 2);
  }

  /** Validates and throws if invalid — useful in CI/build steps */
  validate(): this {
    this.schema.parse(this.data);
    return this;
  }

  /** Safe validation — returns errors without throwing */
  safeParse() {
    return this.schema.safeParse(this.data);
  }
}

/**
 * Factory to create a typed schema builder function.
 * Used internally by all type modules.
 *
 * @example
 * const PersonSchema = z.object({ "@type": z.literal("Person"), name: z.string() })
 * export const createPerson = makeFactory(PersonSchema)
 */
export function makeFactory<T extends ZodRawShape>(schema: ZodObject<T>) {
  return (data: Omit<z.input<ZodObject<T>>, "@context">): SchemaNode<T> => {
    const parsed = schema.parse(data);
    return new SchemaNode(schema, parsed);
  };
}
