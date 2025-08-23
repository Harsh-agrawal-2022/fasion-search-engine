import express from "express";
import Product from "../models/Product.js";
import { askGemini } from "../utils/geminiClient.js";

const router = express.Router();

// 🔹 Helper to normalize keywords
function normalizeKeywords(text) {
  return text
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 0)
    .flatMap((k) => k.split(/\s+/))
    .map((k) => k.replace(/[^a-z0-9]/gi, "")) // remove symbols
    .filter((k) => k.length > 2); // remove short words
}

router.post("/", async (req, res) => {
  try {
    const { userPreferences } = req.body;

    // 🔹 Ask AI (optional, can be used to display AI text)
    const aiText = await askGemini(`
      Based on these preferences: ${userPreferences},
      suggest 3 product recommendations from our store.
      Keep answers short and clear.
    `);

    // 🔹 Extract keywords from user input
    const keywords = normalizeKeywords(userPreferences);

    // 🔹 Build query to match name, category, or colors
    const orQueries = keywords.map((kw) => {
      const regex = new RegExp(kw, "i");
      return [
        { name: regex },
        { category: regex },
        { colors: regex }
      ];
    }).flat();

    const mongoQuery = orQueries.length > 0 ? { $or: orQueries } : {};

    // 🔹 Fetch matching products (limit to 10)
    const products = await Product.find(mongoQuery).limit(10);

    res.json({ aiText, products });
  } catch (err) {
    console.error("Recommendation Error:", err);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

export default router;
