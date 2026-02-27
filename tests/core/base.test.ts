import { describe, it, expect } from "vitest";
import { createPerson, createOrganization, createLocalBusiness, schema } from "../../src/index";

describe("SchemaNode output methods", () => {
  const person = createPerson({ name: "Alice", url: "https://example.com/alice" });

  it("toObject() returns raw data without @context", () => {
    const obj = person.toObject();
    expect(obj["@type"]).toBe("Person");
    expect(obj.name).toBe("Alice");
    expect("@context" in obj).toBe(false);
  });

  it("toJsonLd() adds @context https://schema.org", () => {
    const ld = person.toJsonLd();
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Person");
  });

  it("toScript() wraps in <script type='application/ld+json'>", () => {
    const script = person.toScript();
    expect(script).toMatch(/^<script type="application\/ld\+json">/);
    expect(script).toMatch(/<\/script>$/);
    // The body must be valid JSON
    const body = script.replace(/<script[^>]*>/, "").replace(/<\/script>/, "").trim();
    expect(() => JSON.parse(body)).not.toThrow();
  });

  it("toString() returns pretty JSON string", () => {
    const str = person.toString();
    const parsed = JSON.parse(str);
    expect(parsed["@context"]).toBe("https://schema.org");
  });

  it("validate() returns this for valid data", () => {
    expect(person.validate()).toBe(person);
  });

  it("safeParse() returns success for valid data", () => {
    const result = person.safeParse();
    expect(result.success).toBe(true);
  });
});

describe("makeFactory — @type override", () => {
  it("allows omitting @type and uses schema default", () => {
    const p = createPerson({ name: "Bob" });
    expect(p.toObject()["@type"]).toBe("Person");
  });

  it("allows overriding @type union (LocalBusiness → HairSalon)", () => {
    const lb = createLocalBusiness({ "@type": "HairSalon", name: "Cuts & Co" });
    expect(lb.toObject()["@type"]).toBe("HairSalon");
  });
});

describe("schema() unified factory", () => {
  it("creates a Person via schema()", () => {
    const p = schema("Person", { name: "Carol" });
    expect(p.toObject()["@type"]).toBe("Person");
    expect(p.toObject().name).toBe("Carol");
  });

  it("creates a Product via schema()", () => {
    const p = schema("Product", { name: "Gadget" });
    expect(p.toObject()["@type"]).toBe("Product");
  });

  it("creates an Article via schema()", () => {
    const a = schema("Article", { headline: "Breaking news" });
    expect(a.toObject()["@type"]).toBe("Article");
  });
});
