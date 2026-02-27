/**
 * recipe.ts — Recipe structured data with step-by-step instructions,
 * nutrition info, and a recipe carousel via @graph.
 */

import {
  createRecipe,
  createPerson,
  createCarousel,
  createGraph,
  HowToStepSchema,
  NutritionInformationSchema,
  VideoObjectSchema,
} from "../src/index";

const chef = createPerson({
  name: "Maria Rossi",
  url: "https://mariacooks.example.com",
});

// ─── Full Recipe with HowToSteps ──────────────────────────────────────────────

const pasta = createRecipe({
  name: "Classic Carbonara",
  image: [
    "https://mariacooks.example.com/img/carbonara-1200x900.jpg",
    "https://mariacooks.example.com/img/carbonara-1200x675.jpg",
    "https://mariacooks.example.com/img/carbonara-900x900.jpg",
  ],
  author: chef.toObject(),
  datePublished: "2024-10-15",
  description: "Authentic Roman carbonara — creamy, rich, and ready in under 30 minutes.",
  prepTime: "PT10M",
  cookTime: "PT20M",
  totalTime: "PT30M",
  recipeYield: "4 servings",
  recipeCategory: "Dinner",
  recipeCuisine: "Italian",
  recipeIngredient: [
    "400g spaghetti",
    "200g guanciale or pancetta, diced",
    "4 large egg yolks",
    "2 whole eggs",
    "100g Pecorino Romano, finely grated",
    "50g Parmigiano Reggiano, finely grated",
    "Freshly ground black pepper",
    "Kosher salt",
  ],
  recipeInstructions: [
    HowToStepSchema.parse({
      name: "Cook the pasta",
      text: "Bring a large pot of salted water to boil. Cook spaghetti 2 minutes less than package instructions. Reserve 1 cup pasta water.",
      url: "https://mariacooks.example.com/carbonara#step1",
    }),
    HowToStepSchema.parse({
      name: "Render the guanciale",
      text: "In a large skillet over medium heat, cook guanciale until crispy and fat has rendered, about 5–7 minutes. Remove from heat.",
      url: "https://mariacooks.example.com/carbonara#step2",
    }),
    HowToStepSchema.parse({
      name: "Make the egg sauce",
      text: "Whisk egg yolks, whole eggs, and Pecorino together until smooth. Season generously with black pepper.",
      url: "https://mariacooks.example.com/carbonara#step3",
    }),
    HowToStepSchema.parse({
      name: "Combine pasta and guanciale",
      text: "Add drained pasta to the skillet with guanciale. Toss over low heat to coat.",
      url: "https://mariacooks.example.com/carbonara#step4",
    }),
    HowToStepSchema.parse({
      name: "Add egg sauce",
      text: "Remove pan from heat. Pour egg mixture over pasta, tossing constantly and adding splashes of pasta water until sauce is creamy and coats every strand. Serve immediately.",
      url: "https://mariacooks.example.com/carbonara#step5",
    }),
  ],
  nutrition: NutritionInformationSchema.parse({
    calories: "650 calories",
    fatContent: "28g",
    saturatedFatContent: "11g",
    carbohydrateContent: "72g",
    proteinContent: "28g",
    sodiumContent: "620mg",
    servingSize: "1 serving",
  }),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    reviewCount: 847,
    bestRating: 5,
  },
  keywords: ["pasta", "Italian", "quick dinner", "comfort food"],
  video: VideoObjectSchema.parse({
    name: "How to Make Classic Carbonara",
    description: "Watch Maria make authentic Roman carbonara step by step.",
    thumbnailUrl: "https://mariacooks.example.com/video/carbonara-thumb.jpg",
    uploadDate: "2024-10-15",
    duration: "PT8M30S",
    contentUrl: "https://mariacooks.example.com/video/carbonara.mp4",
    embedUrl: "https://www.youtube.com/embed/abc123",
  }),
  inLanguage: "en",
});

console.log("=== Carbonara Recipe ===");
console.log(pasta.toScript());

// ─── A second recipe for the carousel ────────────────────────────────────────

const tiramisu = createRecipe({
  name: "Classic Tiramisu",
  image: "https://mariacooks.example.com/img/tiramisu.jpg",
  author: chef.toObject(),
  datePublished: "2024-11-05",
  description: "Silky, coffee-soaked Italian dessert — no baking required.",
  prepTime: "PT30M",
  totalTime: "PT4H30M",   // includes chilling time
  recipeYield: "8 servings",
  recipeCategory: "Dessert",
  recipeCuisine: "Italian",
  recipeIngredient: [
    "500g mascarpone",
    "6 egg yolks",
    "120g sugar",
    "300ml strong espresso, cooled",
    "30ml dark rum (optional)",
    "24 ladyfinger biscuits",
    "Cocoa powder for dusting",
  ],
  recipeInstructions: [
    {
      "@type": "HowToStep" as const,
      name: "Make the cream",
      text: "Beat egg yolks and sugar until pale. Fold in mascarpone until smooth.",
    },
    {
      "@type": "HowToStep" as const,
      name: "Dip the ladyfingers",
      text: "Mix espresso and rum. Briefly dip ladyfingers and layer in a dish.",
    },
    {
      "@type": "HowToStep" as const,
      name: "Layer and chill",
      text: "Spread mascarpone cream over ladyfingers. Repeat layers. Cover and refrigerate at least 4 hours.",
    },
    {
      "@type": "HowToStep" as const,
      name: "Serve",
      text: "Dust with cocoa powder just before serving.",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 5.0,
    reviewCount: 1204,
  },
});

// ─── Recipe Carousel via @graph ───────────────────────────────────────────────
// Google supports Recipe in carousels. Each recipe must have its own page URL.

const carousel = createCarousel([
  { url: "https://mariacooks.example.com/carbonara", name: "Classic Carbonara" },
  { url: "https://mariacooks.example.com/tiramisu", name: "Classic Tiramisu" },
]);

console.log("\n=== Recipe Carousel (ItemList) ===");
console.log(carousel.toScript());

// Full @graph with both recipes + carousel for a "recipes" collection page
const graph = createGraph([carousel, pasta, tiramisu]);

console.log("\n=== Recipe collection @graph ===");
console.log(graph.toScript());
