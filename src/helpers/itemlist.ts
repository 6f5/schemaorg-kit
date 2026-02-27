import { z, ZodRawShape } from "zod";
import { ItemListSchema } from "../types/intangibles/ItemList";
import { SchemaNode } from "../core/base";

type CarouselInput =
  | SchemaNode<ZodRawShape>
  | { url: string; name?: string };

/**
 * Ergonomic helper for Carousel structured data (ItemList).
 * Accepts either SchemaNode instances or plain `{ url, name }` objects.
 * Automatically assigns sequential `position` values.
 *
 * Supported item types for Google Carousel: Recipe, Course, Article, Movie, Restaurant.
 *
 * @example
 * createCarousel([
 *   createRecipe({ name: "Pasta", image: "..." }),
 *   createRecipe({ name: "Pizza", image: "..." }),
 * ])
 *
 * @example
 * createCarousel([
 *   { url: "https://example.com/recipe/1", name: "Pasta" },
 *   { url: "https://example.com/recipe/2", name: "Pizza" },
 * ])
 */
export function createCarousel(
  items: CarouselInput[]
): SchemaNode<typeof ItemListSchema.shape> {
  const elements = items.map((item, index) => {
    if (item instanceof SchemaNode) {
      return {
        "@type": "ListItem" as const,
        position: index + 1,
        item: item.toObject(),
      };
    }
    return {
      "@type": "ListItem" as const,
      position: index + 1,
      url: item.url,
      ...(item.name ? { name: item.name } : {}),
    };
  });

  const data = ItemListSchema.parse({ itemListElement: elements });
  return new SchemaNode(ItemListSchema, data);
}
