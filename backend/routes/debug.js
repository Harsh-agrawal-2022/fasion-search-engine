// backend/routes/debugRoutes.js
import express from "express";
import Product from "../models/Product.js";
import { askGemini } from "../utils/geminiClient.js";

const router = express.Router();

/**
 * Normalize keywords from AI response
 */
function normalizeKeywords(aiResponse) {
  return aiResponse
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 0)
    .flatMap((k) => k.split(/\s+/))
    .map((k) => k.replace(/[^a-z0-9]/gi, "")) // Remove special chars
    .filter((k) => k.length > 2); // Keep words with at least 3 chars
}

/**
 * Extract max price from query (e.g., "under 200")
 */
function extractPrice(query) {
  const match = query?.match(/under\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Build prioritized search query
 */
async function buildSearchQuery(keywords, query, maxPrice) {
  const mongoQuery = {};
  const orQueries = [];

  const categoryKeywords = [
    "shirt", "top", "dress", "gown", "kurta", "saree", "jeans", "jacket", "shoes", "handbag"
  ];
  const occasionKeywords = [
    "party", "wedding", "birthday", "casual", "office", "sports", "festive"
  ];
  const colorKeywords = [
    "red", "blue", "green", "black", "white", "pink", "maroon", "yellow", "purple", "brown", "grey"
  ];

  const category = keywords.find(k => categoryKeywords.includes(k));
  const occasion = keywords.find(k => occasionKeywords.includes(k));
  const color = keywords.find(k => colorKeywords.includes(k));

  if (category) mongoQuery.category = new RegExp(category, "i");
  if (occasion) mongoQuery.occasion = new RegExp(occasion, "i");
  if (color) mongoQuery.colors = new RegExp(color, "i");
  if (maxPrice) mongoQuery.price = { $lte: maxPrice };
  if (!products.length) {
  const wildcardRegex = new RegExp(query, "i");
  products = await Product.find({
    $or: [
      { name: wildcardRegex },
      { category: wildcardRegex },
      { occasion: wildcardRegex },
      { colors: wildcardRegex },
    ],
    ...(maxPrice && { price: { $lte: maxPrice } }),
  }).limit(Number(limit));
}


  if (!category && !occasion && !color) {
    keywords.forEach((kw) => {
      const regex = new RegExp(kw, "i");
      orQueries.push(
        { name: regex },
        { category: regex },
        { brand: regex },
        { occasion: regex },
        { colors: regex }
      );
    });
    if (orQueries.length) mongoQuery.$or = orQueries;
  }

  return mongoQuery;
}

/**
 * Fetch recommendations based on category/brand
 */
async function getRecommendations(product) {
  if (!product) return [];
  return Product.find({
    _id: { $ne: product._id },
    $or: [
      { category: product.category },
      { brand: product.brand },
    ],
  }).limit(5);
}

/**
 * Compare a product with similar priced products
 */
async function getComparison(product) {
  if (!product) return [];
  return Product.find({
    _id: { $ne: product._id },
    price: { $gte: product.price - 100, $lte: product.price + 100 },
  }).limit(5);
}

/**
 * Main debug route
 */
router.get("/all", async (req, res) => {
  try {
    const { productId, occasion, query, limit = 20 } = req.query;
    const maxPrice = extractPrice(query || "");
    let products = [];
    let aiResponse = "";
    let keywords = [];
    let mainProduct = null;

    // 🔹 1. Get product by ID if passed
    if (productId) {
      mainProduct = await Product.findById(productId);
      if (mainProduct) products = [mainProduct];
    }

    // 🔹 2. Search by occasion
    if (!products.length && occasion) {
      products = await Product.find({ occasion }).limit(Number(limit));
    }

    // 🔹 3. AI-powered search
    if (!products.length && query) {
      aiResponse = await askGemini(
        `User search: ${query}. Return top product keywords, comma separated.`
      );

      keywords = normalizeKeywords(aiResponse);
      const mongoQuery = buildSearchQuery(keywords, query, maxPrice);

      products = await Product.find(mongoQuery).limit(Number(limit));

      // 🔹 Fallback if no results
      if (!products.length) {
        const firstWord = query.split(" ")[0];
        const fallbackRegex = new RegExp(firstWord, "i");
        const fallbackQuery = {
          $or: [
            { name: fallbackRegex },
            { category: fallbackRegex },
            { occasion: fallbackRegex },
            { colors: fallbackRegex },
          ],
        };
        if (maxPrice) fallbackQuery.price = { $lte: maxPrice };
        products = await Product.find(fallbackQuery).limit(Number(limit));
      }
    }

    if (!mainProduct && products.length) {
      mainProduct = products[0];
    }

    // 🔹 4. Brands list
    const brands = await Product.distinct("brand");

    // 🔹 5. Recommendations & Comparisons
    const recommendations = await getRecommendations(mainProduct);
    const comparisons = await getComparison(mainProduct);

    res.json({
      success: true,
      searchMeta: {
        productId,
        occasion,
        query,
        aiResponse,
        keywords,
        maxPrice,
      },
      brands,
      products,
      recommendations,
      comparisons,
    });
  } catch (err) {
    console.error("Debug Route Error:", err);
    res.status(500).json({ error: "Debug search failed" });
  }
});

export default router;
