import { ZodRawShape } from "zod";
import { SchemaNode } from "./base";

type AnySchemaNode = SchemaNode<ZodRawShape>;
type GraphItem = Record<string, unknown>;

/**
 * Holds multiple schema nodes and outputs them as a JSON-LD @graph.
 * Use this when you want to include multiple structured data entities in a
 * single <script> tag — the recommended approach for pages with multiple schemas.
 *
 * @example
 * const graph = createGraph([
 *   createOrganization({ name: "Acme Corp" }),
 *   createWebPage({ name: "Home Page" }),
 *   createBreadcrumbList([{ name: "Home", url: "https://example.com" }]),
 * ]);
 * document.head.innerHTML += graph.toScript();
 */
export class SchemaGraph {
  private readonly items: GraphItem[] = [];

  /**
   * Add a SchemaNode or plain object to the graph.
   * Returns `this` for fluent chaining.
   */
  add(node: AnySchemaNode | GraphItem): this {
    if (node instanceof SchemaNode) {
      this.items.push(node.toObject() as GraphItem);
    } else {
      this.items.push(node);
    }
    return this;
  }

  /** Returns the raw array of graph items (without @context). */
  toArray(): GraphItem[] {
    return [...this.items];
  }

  /** Returns the full JSON-LD object with @context and @graph. */
  toJsonLd(): { "@context": "https://schema.org"; "@graph": GraphItem[] } {
    return {
      "@context": "https://schema.org",
      "@graph": this.items,
    };
  }

  /** Returns a <script type="application/ld+json"> tag string. */
  toScript(): string {
    return `<script type="application/ld+json">\n${JSON.stringify(this.toJsonLd(), null, 2)}\n</script>`;
  }

  /** Returns prettified JSON string. */
  toString(): string {
    return JSON.stringify(this.toJsonLd(), null, 2);
  }
}

/**
 * Functional API: create a graph from an array of schema nodes or plain objects.
 * Equivalent to creating a `new SchemaGraph()` and calling `.add()` on each item.
 *
 * @example
 * const graph = createGraph([
 *   createOrganization({ name: "Acme" }),
 *   createWebPage({ name: "Home" }),
 * ]);
 * graph.toScript(); // <script>...{ "@graph": [...] }...</script>
 */
export function createGraph(nodes: Array<AnySchemaNode | GraphItem>): SchemaGraph {
  const graph = new SchemaGraph();
  for (const node of nodes) {
    graph.add(node);
  }
  return graph;
}
