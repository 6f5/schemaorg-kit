import { describe, it, expect } from "vitest";
import {
  createGraph,
  createPerson,
  createOrganization,
  createWebPage,
  createBreadcrumbList,
} from "../../src/index";

describe("SchemaGraph / createGraph", () => {
  const person = createPerson({ name: "Alice" });
  const org = createOrganization({ name: "Acme" });

  it("toArray() returns array of plain objects", () => {
    const graph = createGraph([person, org]);
    const arr = graph.toArray();
    expect(Array.isArray(arr)).toBe(true);
    expect(arr).toHaveLength(2);
    expect(arr[0]?.["@type"]).toBe("Person");
    expect(arr[1]?.["@type"]).toBe("Organization");
  });

  it("toJsonLd() produces { @context, @graph }", () => {
    const graph = createGraph([person, org]);
    const ld = graph.toJsonLd();
    expect(ld["@context"]).toBe("https://schema.org");
    expect(Array.isArray(ld["@graph"])).toBe(true);
    expect((ld["@graph"] as unknown[]).length).toBe(2);
  });

  it("toScript() produces valid JSON-LD script tag", () => {
    const graph = createGraph([person]);
    const script = graph.toScript();
    expect(script).toContain('<script type="application/ld+json">');
    expect(script).toContain("</script>");
    const body = script.replace(/<script[^>]*>/, "").replace(/<\/script>/, "").trim();
    const parsed = JSON.parse(body);
    expect(parsed["@graph"]).toBeDefined();
  });

  it("toString() is pretty JSON", () => {
    const graph = createGraph([org]);
    const str = graph.toString();
    expect(() => JSON.parse(str)).not.toThrow();
  });

  it("add() fluent API appends nodes", () => {
    const graph = createGraph([person]);
    graph.add(org);
    expect(graph.toArray()).toHaveLength(2);
  });

  it("accepts plain objects in addition to SchemaNodes", () => {
    const plain = { "@type": "BreadcrumbList", itemListElement: [] };
    const graph = createGraph([plain]);
    const arr = graph.toArray();
    expect(arr[0]?.["@type"]).toBe("BreadcrumbList");
  });

  it("nodes in @graph do NOT include @context", () => {
    const graph = createGraph([person, org]);
    const items = graph.toJsonLd()["@graph"] as Record<string, unknown>[];
    for (const item of items) {
      expect("@context" in item).toBe(false);
    }
  });

  it("handles mixed SchemaNodes and plain objects", () => {
    const breadcrumb = createBreadcrumbList([{ name: "Home", url: "https://example.com" }]);
    const graph = createGraph([person, breadcrumb]);
    const arr = graph.toArray();
    expect(arr).toHaveLength(2);
  });
});
