// backend/routes/aiSearch.js
import express from "express";
import Product from "../models/Product.js";
import { askGemini } from "../utils/geminiClient.js";

const router = express.Router();

// 🔹 Helper to clean and normalize keywords
function normalizeKeywords(aiResponse) {
  return aiResponse
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 0)
    .flatMap((k) => k.split(/\s+/))
    .map((k) => k.replace(/[^a-z0-9]/gi, "")) // Remove symbols
    .map((k) => (k.endsWith("s") ? k.slice(0, -1) : k)) // Remove plural s
    .filter((k) => k.length > 2);
}

// 🔹 Extract price from natural query
function extractPrice(query) {
  const match = query.match(/under\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

router.post("/", async (req, res) => {
  try {
    const { query, imageCaption } = req.body;
    const searchQuery = query || `Describe products similar to: ${imageCaption}`;

    // 🔥 Extract price limit if mentioned
    const maxPrice = extractPrice(searchQuery);

    // 🔹 Ask Gemini for keywords
    const aiResponse = await askGemini(
      `User search: ${searchQuery}.
       Return top product-related keywords, comma-separated.`
    );

    // 🔹 Normalize keywords
    const keywords = normalizeKeywords(aiResponse);

    // 🔹 Build search conditions
    const orQueries = keywords.flatMap((kw) => {
      const regex = new RegExp(kw, "i");
      return [
        { name: regex },
        { category: regex },
        { brand: regex },
        { occasion: regex },
        { colors: regex },
      ];
    });

    const mongoQuery = orQueries.length > 0 ? { $or: orQueries } : {};

    if (maxPrice) {
      mongoQuery.price = { $lte: maxPrice };
    }

    // 🔹 Primary search
    let products = await Product.find(mongoQuery).limit(50);

    // 🔹 Fallback: If no results, search by first word
    if (products.length === 0) {
      const fallbackRegex = new RegExp(searchQuery.split(" ")[0], "i");
      const fallbackQuery = {
        $or: [
          { name: fallbackRegex },
          { category: fallbackRegex },
          { occasion: fallbackRegex },
          { colors: fallbackRegex },
        ],
      };
      if (maxPrice) fallbackQuery.price = { $lte: maxPrice };
      products = await Product.find(fallbackQuery).limit(20);
    }

    res.json({ aiResponse, keywords, maxPrice, products });
  } catch (err) {
    console.error("AI Search Error:", err);
    res.status(500).json({ error: "AI search failed" });
  }
});

export default router;
