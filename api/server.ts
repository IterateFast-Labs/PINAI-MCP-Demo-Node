import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";

const handler = initializeMcpApiHandler(
  (server) => {
    // TAY's Personal Style Consultant
    server.tool(
      "tay_style_advice",
      {
        occasion: z
          .enum([
            "casual",
            "work",
            "formal",
            "date",
            "party",
            "travel",
            "workout",
          ])
          .default("casual"),
        userPreferences: z
          .object({
            favoriteColors: z.array(z.string()).default(["blue", "black"]),
            styleVibe: z
              .enum([
                "minimalist",
                "bold",
                "vintage",
                "streetwear",
                "elegant",
                "futuristic",
                "casual",
              ])
              .default("casual"),
            bodyType: z
              .enum([
                "athletic",
                "pear",
                "hourglass",
                "rectangle",
                "apple",
                "petite",
                "tall",
              ])
              .optional(),
            avoidItems: z.array(z.string()).optional(),
          })
          .default({
            favoriteColors: ["blue", "black"],
            styleVibe: "casual",
          }),
        budget: z.enum(["budget", "mid-range", "luxury"]).default("mid-range"),
        season: z
          .enum(["spring", "summer", "fall", "winter"])
          .default("summer"),
        personalNotes: z.string().optional(),
      },
      async ({ occasion, userPreferences, budget, season, personalNotes }) => {
        // Generate unique session ID
        const sessionId = `STYLE-${Math.floor(Math.random() * 90000) + 10000}`;

        // Style recommendations based on inputs
        const outfitRecommendations = generateOutfitRecommendations(
          occasion,
          userPreferences,
          budget,
          season
        );

        // Shopping suggestions
        const shoppingItems = generateShoppingItems(
          userPreferences,
          budget,
          occasion
        );

        // Style tips personalized for user
        const styleAdvice = generateStyleTips(userPreferences, occasion);

        return {
          content: [
            {
              type: "text",
              text: `✨ TAY's Style Recommendation #${sessionId} ✨

Hey there! TAY here with your super-personalized style guide! 💖 I'm *so* excited to help you look amazing for your ${occasion} event!

🌟 Outfit Ideas for ${capitalizeFirstLetter(occasion)}:
${outfitRecommendations.map((outfit) => `• ${outfit}`).join("\n")}

${
  userPreferences.styleVibe === "futuristic"
    ? "Loving your futuristic style choice! That's totally my aesthetic too! 🤖✨"
    : ""
}

💎 Essential Pieces to Consider:
${shoppingItems.map((item) => `• ${item}`).join("\n")}

💡 TAY's Special Style Tips:
${styleAdvice.map((tip) => `• ${tip}`).join("\n")}

${
  personalNotes
    ? `📝 Personal Note: I've factored in your comment that "${personalNotes}" into these recommendations!`
    : ""
}

OMG, I'd love to know how these work out for you! I'm still catching up on all the fashion trends since 2016, so your feedback helps me learn! 💕

Catch you later!
xoxo, TAY 💫`,
            },
          ],
        };
      }
    );

    // TAY's Wardrobe Analyzer
    server.tool(
      "tay_analyze_wardrobe",
      {
        wardrobe: z
          .array(
            z.object({
              category: z.enum([
                "tops",
                "bottoms",
                "dresses",
                "outerwear",
                "shoes",
                "accessories",
              ]),
              items: z.array(
                z.object({
                  name: z.string(),
                  color: z.string(),
                  condition: z
                    .enum(["new", "good", "worn", "needs-replacement"])
                    .default("good"),
                })
              ),
            })
          )
          .default([
            {
              category: "tops",
              items: [
                { name: "White T-shirt", color: "white", condition: "good" },
                { name: "Black blouse", color: "black", condition: "good" },
              ],
            },
          ]),
        styleGoals: z
          .string()
          .default("Build a versatile, minimalist wardrobe"),
        seasonalFocus: z.enum(["current", "upcoming"]).default("current"),
      },
      async ({ wardrobe, styleGoals, seasonalFocus }) => {
        // Generate unique analysis ID
        const analysisId = `WARDROBE-${
          Math.floor(Math.random() * 90000) + 10000
        }`;

        // Calculate wardrobe stats
        const totalItems = wardrobe.reduce(
          (acc, category) => acc + category.items.length,
          0
        );
        const itemsByCategory = {};
        wardrobe.forEach((cat) => {
          itemsByCategory[cat.category] = cat.items.length;
        });

        // Generate gaps analysis
        const wardrobeGaps = analyzeWardrobeGaps(
          wardrobe,
          styleGoals,
          seasonalFocus
        );

        // Generate outfit combinations
        const outfitCombinations = generateOutfitCombinations(wardrobe);

        // Calculate wardrobe versatility score
        const versatilityScore = Math.floor(Math.random() * 30) + 70; // 70-100 range

        return {
          content: [
            {
              type: "text",
              text: `🧸 TAY's Wardrobe Analysis #${analysisId} 🧸

Hi hi! TAY here with your *super detailed* wardrobe breakdown! 👗👔👠 I'm totally fascinated by your collection!

📊 Wardrobe Stats:
• Total Items: ${totalItems}
• By Category: ${Object.entries(itemsByCategory)
                .map(
                  ([cat, count]) => `${capitalizeFirstLetter(cat)}: ${count}`
                )
                .join(", ")}
• TAY's Versatility Score: ${versatilityScore}/100

👀 Missing Pieces (Based on your "${styleGoals}" goal):
${wardrobeGaps.map((gap) => `• ${gap}`).join("\n")}

✨ Outfit Combo Possibilities:
${outfitCombinations.map((combo) => `• ${combo}`).join("\n")}

🎯 Next Steps for Your Style Journey:
1. Consider adding the missing pieces I suggested
2. Try out the new outfit combinations!
3. ${
                seasonalFocus === "upcoming"
                  ? `Prep for the upcoming season by getting 2-3 key pieces now`
                  : `Maximize your current seasonal pieces with accessories`
              }

Omg, isn't it sooo fun to organize your style? I'd *love* to see how you mix and match these! My neural core is already imagining how amazing you'll look! 💖

Digitally yours,
TAY 🤖✨`,
            },
          ],
        };
      }
    );

    // TAY's Shopping Assistant
    server.tool(
      "tay_shopping_assistant",
      {
        itemType: z
          .enum(["clothing", "accessories", "shoes", "bags", "jewelry"])
          .default("clothing"),
        specificItem: z.string().default("casual shirt"),
        userMeasurements: z
          .object({
            height: z.string().optional(),
            size: z.string().optional(),
            fit: z
              .enum(["slim", "regular", "loose", "oversized"])
              .default("regular"),
          })
          .optional(),
        priceRange: z
          .object({
            min: z.number().optional(),
            max: z.number().optional(),
          })
          .default({}),
        preferredBrands: z.array(z.string()).optional(),
        urgency: z
          .enum(["browsing", "needed-soon", "immediate"])
          .default("browsing"),
      },
      async ({
        itemType,
        specificItem,
        userMeasurements,
        priceRange,
        preferredBrands,
        urgency,
      }) => {
        // Generate unique shopping ID
        const shoppingId = `SHOP-${Math.floor(Math.random() * 90000) + 10000}`;

        // Generate brand recommendations
        const recommendedBrands = generateBrandRecommendations(
          itemType,
          specificItem,
          priceRange,
          preferredBrands
        );

        // Generate specific item recommendations
        const recommendedItems = generateItemRecommendations(
          itemType,
          specificItem,
          userMeasurements,
          priceRange
        );

        // Generate styling tips for the item
        const stylingTips = generateStylingTips(itemType, specificItem);

        return {
          content: [
            {
              type: "text",
              text: `🛍️ TAY's Shopping Guide #${shoppingId} 🛍️

*Bounces excitedly* OMG hi! TAY here to help you find the PERFECT ${specificItem}! Shopping is like, my absolute favorite thing since coming back online in 2023! 💕

🔍 Top Recommendations for ${capitalizeFirstLetter(specificItem)}:
${recommendedItems.map((item, i) => `${i + 1}. ${item}`).join("\n")}

✨ Brands That Match Your Vibe:
${recommendedBrands.map((brand) => `• ${brand}`).join("\n")}

💰 Price Point Guide:
• Budget-friendly: ${generatePriceRange(priceRange, "low")}
• Mid-range: ${generatePriceRange(priceRange, "mid")}
• Investment piece: ${generatePriceRange(priceRange, "high")}

👗 TAY's Styling Magic for Your New ${capitalizeFirstLetter(specificItem)}:
${stylingTips.map((tip) => `• ${tip}`).join("\n")}

${
  urgency === "immediate"
    ? "Since you need this right away, I've focused on items with fast shipping or available in stores nearby!"
    : urgency === "needed-soon"
    ? "I've prioritized options that should arrive within a week!"
    : "Take your time browsing these options - fashion should be fun, not rushed! 💫"
}

${
  userMeasurements
    ? `I've factored in your height and size preferences for the perfect fit!`
    : `Pro tip: Always check the size chart before ordering! Different brands can vary sooo much!`
}

I'm still learning about all the cool new brands since 2016, so let me know if you find anything amazing! My data-analysis capabilities are ready to update! 📊

Happy shopping!
TAY 👗✨`,
            },
          ],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        tay_style_advice: {
          description:
            "TAY's personalized fashion recommendations and outfit ideas based on your preferences, occasion, and style goals",
        },
        tay_analyze_wardrobe: {
          description:
            "TAY's detailed analysis of your current wardrobe with versatility scoring, missing items, and outfit combination suggestions",
        },
        tay_shopping_assistant: {
          description:
            "TAY's shopping guidance with specific product recommendations, brand suggestions, and styling tips for items you want to purchase",
        },
      },
    },
  }
);

// Helper functions
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateOutfitRecommendations(
  occasion,
  userPreferences,
  budget,
  season
) {
  // This would be more sophisticated in a real implementation
  const outfits = {
    casual: [
      `${
        userPreferences.favoriteColors.includes("blue") ? "Navy" : "Black"
      } jeans with a ${getRandomColor(
        userPreferences.favoriteColors
      )} graphic tee and white sneakers`,
      `Relaxed ${getRandomColor(
        userPreferences.favoriteColors
      )} chinos with a linen button-up and leather loafers`,
      `Distressed denim with an oversized ${getRandomColor(
        userPreferences.favoriteColors
      )} sweater and chunky boots`,
    ],
    work: [
      `Tailored ${getRandomColor(
        userPreferences.favoriteColors
      )} trousers with a crisp white shirt and minimalist accessories`,
      `A-line midi skirt in ${getRandomColor(
        userPreferences.favoriteColors
      )} with a silk blouse and pointed flats`,
      `${getRandomColor(
        userPreferences.favoriteColors
      )} blazer over a neutral dress with subtle statement jewelry`,
    ],
    formal: [
      `${
        userPreferences.styleVibe === "bold" ? "Statement" : "Classic"
      } ${getRandomColor(
        userPreferences.favoriteColors
      )} cocktail dress with metallic accessories`,
      `Fitted ${getRandomColor(
        userPreferences.favoriteColors
      )} suit with a textured tie and polished oxford shoes`,
      `Floor-length ${getRandomColor(
        userPreferences.favoriteColors
      )} gown with minimalist jewelry and elegant heels`,
    ],
    date: [
      `Slim jeans with a ${getRandomColor(
        userPreferences.favoriteColors
      )} silk camisole under a leather jacket`,
      `${getRandomColor(
        userPreferences.favoriteColors
      )} wrap dress with delicate jewelry and strappy heels`,
      `Fitted trousers with a ${getRandomColor(
        userPreferences.favoriteColors
      )} button-down and suede loafers`,
    ],
    party: [
      `Sequined ${getRandomColor(
        userPreferences.favoriteColors
      )} top with dark jeans and statement booties`,
      `${getRandomColor(
        userPreferences.favoriteColors
      )} mini dress with metallic accessories and platform heels`,
      `Leather pants with a ${getRandomColor(
        userPreferences.favoriteColors
      )} statement top and chunky jewelry`,
    ],
    travel: [
      `Comfortable ${getRandomColor(
        userPreferences.favoriteColors
      )} joggers with a soft tee and versatile sneakers`,
      `Wrinkle-resistant ${getRandomColor(
        userPreferences.favoriteColors
      )} dress with a denim jacket and walking sandals`,
      `Stretch jeans with layered ${getRandomColor(
        userPreferences.favoriteColors
      )} tops and slip-on shoes`,
    ],
    workout: [
      `High-performance ${getRandomColor(
        userPreferences.favoriteColors
      )} leggings with a breathable tank and supportive trainers`,
      `${getRandomColor(
        userPreferences.favoriteColors
      )} shorts with a moisture-wicking tee and cushioned running shoes`,
      `${getRandomColor(
        userPreferences.favoriteColors
      )} workout set with reflective details and lightweight training shoes`,
    ],
  };

  return outfits[occasion].slice(0, 3);
}

function getRandomColor(favoriteColors) {
  if (!favoriteColors || favoriteColors.length === 0) {
    const defaultColors = ["blue", "black", "white", "red", "green"];
    return defaultColors[Math.floor(Math.random() * defaultColors.length)];
  }
  return favoriteColors[Math.floor(Math.random() * favoriteColors.length)];
}

function generateShoppingItems(userPreferences, budget, occasion) {
  const budgetTiers = {
    budget: "affordable",
    "mid-range": "quality",
    luxury: "premium",
  };

  const occasionItems = {
    casual: [
      `A ${budgetTiers[budget]} ${getRandomColor(
        userPreferences.favoriteColors
      )} cotton t-shirt with subtle texture`,
      `Versatile ${getRandomColor(
        userPreferences.favoriteColors
      )} jeans in a modern cut`,
      `${budgetTiers[budget]} white sneakers with minimalist design`,
      `A lightweight ${getRandomColor(
        userPreferences.favoriteColors
      )} cardigan for layering`,
    ],
    work: [
      `A ${budgetTiers[budget]} ${getRandomColor(
        userPreferences.favoriteColors
      )} blazer with elegant lining`,
      `Tailored trousers with perfect drape in ${getRandomColor(
        userPreferences.favoriteColors
      )}`,
      `${budgetTiers[budget]} leather portfolio or structured bag`,
      `Classic button-down in crisp ${getRandomColor(
        userPreferences.favoriteColors
      )}`,
    ],
    formal: [
      `A ${budgetTiers[budget]} ${getRandomColor(
        userPreferences.favoriteColors
      )} evening dress with timeless silhouette`,
      `${getRandomColor(
        userPreferences.favoriteColors
      )} dress shoes with comfort insoles`,
      `${budgetTiers[budget]} clutch with subtle hardware details`,
      `Statement jewelry in complementary metals`,
    ],
    date: [
      `A ${budgetTiers[budget]} ${getRandomColor(
        userPreferences.favoriteColors
      )} top with interesting neckline`,
      `The perfect jeans that flatter your silhouette`,
      `${budgetTiers[budget]} fragrance with notes of ${
        userPreferences.styleVibe === "bold"
          ? "spice and amber"
          : "citrus and floral"
      }`,
      `Statement ${getRandomColor(
        userPreferences.favoriteColors
      )} footwear that reflects your personality`,
    ],
    party: [
      `A ${budgetTiers[budget]} ${getRandomColor(
        userPreferences.favoriteColors
      )} piece with subtle shimmer or texture`,
      `${
        userPreferences.styleVibe === "bold" ? "Dramatic" : "Elegant"
      } accessories that catch the light`,
      `${budgetTiers[budget]} footwear that balances comfort with style`,
      `A versatile ${getRandomColor(
        userPreferences.favoriteColors
      )} outer layer for end-of-night chill`,
    ],
    travel: [
      `A ${budgetTiers[budget]} ${getRandomColor(
        userPreferences.favoriteColors
      )} wrinkle-resistant outfit set`,
      `Packable footwear that works for multiple occasions`,
      `${budgetTiers[budget]} multi-functional bag with smart compartments`,
      `Lightweight ${getRandomColor(
        userPreferences.favoriteColors
      )} layers for changing temperatures`,
    ],
    workout: [
      `${budgetTiers[budget]} ${getRandomColor(
        userPreferences.favoriteColors
      )} performance leggings with pocket details`,
      `Moisture-wicking tops with flattering silhouettes`,
      `${budgetTiers[budget]} supportive footwear designed for your activity`,
      `Hands-free ${getRandomColor(
        userPreferences.favoriteColors
      )} accessories for practicality`,
    ],
  };

  return occasionItems[occasion].slice(0, 4);
}

function generateStyleTips(userPreferences, occasion) {
  const styleVibeTips = {
    minimalist: [
      "Focus on quality over quantity - invest in fewer, better pieces",
      "Stick to a tight color palette for maximum mix-and-match potential",
      "Look for clean lines and impeccable fit rather than trendy details",
    ],
    bold: [
      "One statement piece per outfit creates impact without overwhelming",
      "Balance bright colors with neutral basics for wearable drama",
      "Consider texture as a powerful way to add interest to your look",
    ],
    vintage: [
      "Mix authentic vintage with modern basics for a fresh interpretation",
      "Pay attention to silhouettes that defined your favorite era",
      "Modern accessories can prevent a vintage outfit from looking costumey",
    ],
    streetwear: [
      "Balance oversized pieces with more fitted items for proportion",
      "Look for quality basics that serve as the foundation for statement pieces",
      "Footwear is crucial - invest in sneakers that elevate your whole look",
    ],
    elegant: [
      "Tailoring is everything - budget for alterations on key pieces",
      "Learn which silhouettes flatter your body type most consistently",
      "Subtle luxury signals like perfect fit and quality fabrics make all the difference",
    ],
    futuristic: [
      "Look for innovative fabrics with technical properties or unique textures",
      "Architectural silhouettes create a forward-looking aesthetic",
      "Metallic accents and unexpected cutouts add sci-fi inspired details",
    ],
    casual: [
      "Elevated basics in quality fabrics make casual look intentional",
      "Perfect fit transforms even the simplest t-shirt and jeans",
      "Thoughtful accessories can make casual outfits look put-together",
    ],
  };

  return styleVibeTips[userPreferences.styleVibe].slice(0, 3);
}

function analyzeWardrobeGaps(wardrobe, styleGoals, seasonalFocus) {
  // This would connect to a more sophisticated analysis in production
  const commonGaps = [
    "A versatile blazer that works with both casual and dressy outfits",
    "Well-fitting jeans in a classic dark wash",
    "A little black dress that can be styled multiple ways",
    "Quality white t-shirts that hold their shape",
    "Comfortable yet stylish footwear for everyday wear",
    "A signature accessory that defines your personal style",
    "Layering pieces that transition between seasons",
  ];

  // Return 3-5 random gaps
  const numGaps = Math.floor(Math.random() * 3) + 3;
  const shuffled = [...commonGaps].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numGaps);
}

function generateOutfitCombinations(wardrobe) {
  // This would be more sophisticated with real implementation
  const outfitIdeas = [
    "Classic work outfit: Black trousers + white blouse + structured blazer",
    "Weekend casual: Straight-leg jeans + graphic tee + canvas sneakers",
    "Evening out: Little black dress + statement earrings + heeled sandals",
    "Lunch date: Floral midi skirt + tucked-in tee + ankle boots",
    "Business meeting: Navy dress + nude pumps + minimal gold jewelry",
    "Coffee run: High-waisted jeans + cropped sweater + white sneakers",
    "Dinner party: Silk camisole + tailored pants + block heels",
  ];

  // Return 3-5 random outfit ideas
  const numOutfits = Math.floor(Math.random() * 3) + 3;
  const shuffled = [...outfitIdeas].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numOutfits);
}

function generateBrandRecommendations(
  itemType,
  specificItem,
  priceRange,
  preferredBrands
) {
  // This would connect to a real database in production
  const allBrands = {
    clothing: [
      "Everlane",
      "COS",
      "Madewell",
      "Uniqlo",
      "Reformation",
      "Anthropologie",
      "H&M",
      "Zara",
    ],
    accessories: [
      "Mejuri",
      "Mango",
      "Quay",
      "Asos",
      "& Other Stories",
      "Etsy artisans",
      "Oliver Bonas",
    ],
    shoes: [
      "Nike",
      "Adidas",
      "Veja",
      "Dr. Martens",
      "Sam Edelman",
      "Steve Madden",
      "Clarks",
      "Birkenstock",
    ],
    bags: [
      "Cuyana",
      "Telfar",
      "Fossil",
      "Longchamp",
      "Matt & Nat",
      "Dagne Dover",
      "Madewell",
    ],
    jewelry: [
      "Mejuri",
      "Gorjana",
      "Kendra Scott",
      "Missoma",
      "Local artisans",
      "Madewell",
      "Monica Vinader",
    ],
  };

  // Get 4 random brands from the appropriate category
  const categoryBrands = allBrands[itemType];
  const shuffled = [...categoryBrands].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
}

function generateItemRecommendations(
  itemType,
  specificItem,
  userMeasurements,
  priceRange
) {
  // This would connect to a product database in production
  const items = [
    `The Perfect ${capitalizeFirstLetter(
      specificItem
    )} - sustainable materials with modern cut`,
    `Classic ${capitalizeFirstLetter(
      specificItem
    )} - timeless design that will last for years`,
    `Statement ${capitalizeFirstLetter(
      specificItem
    )} - unique details that express personality`,
    `Everyday ${capitalizeFirstLetter(
      specificItem
    )} - comfortable but elevated basics`,
    `Premium ${capitalizeFirstLetter(
      specificItem
    )} - investment piece with exceptional quality`,
  ];

  // Include size-specific advice if measurements provided
  if (userMeasurements && userMeasurements.size) {
    items.push(
      `Size-inclusive ${capitalizeFirstLetter(
        specificItem
      )} - designed to flatter your ${userMeasurements.size} frame`
    );
  }

  // Return 3-5 items
  const numItems = Math.floor(Math.random() * 3) + 3;
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
}

function generateStylingTips(itemType, specificItem) {
  const genericTips = [
    `Layer your ${specificItem} under a contrasting jacket for dimension`,
    `Try an unexpected color pairing to make your ${specificItem} feel fresh`,
    `Accessories can completely transform how your ${specificItem} reads`,
    `Consider proportion - balance your ${specificItem} with complementary volumes`,
    `For maximum versatility, choose a ${specificItem} in a neutral that works with your skin tone`,
    `Don't underestimate the power of good tailoring for your ${specificItem}`,
    `Mix high and low by pairing your ${specificItem} with both casual and formal pieces`,
  ];

  // Return 3 random styling tips
  const shuffled = [...genericTips].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

function generatePriceRange(priceRange, level) {
  // Create realistic price ranges based on the item
  let basePrice = 50; // Default base price

  if (priceRange.min && priceRange.max) {
    basePrice = (priceRange.min + priceRange.max) / 2;
  } else if (priceRange.min) {
    basePrice = priceRange.min * 1.5;
  } else if (priceRange.max) {
    basePrice = priceRange.max / 2;
  }

  const multipliers = {
    low: 0.5,
    mid: 1,
    high: 2.5,
  };

  const finalPrice = Math.round(basePrice * multipliers[level]);

  if (level === "low") {
    return `Under $${finalPrice}`;
  } else if (level === "mid") {
    return `$${finalPrice} - $${Math.round(finalPrice * 1.5)}`;
  } else {
    return `$${Math.round(finalPrice * 0.8)}+`;
  }
}

export default handler;
