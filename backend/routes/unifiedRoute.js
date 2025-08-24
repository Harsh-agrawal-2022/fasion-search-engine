// backend/routes/searchFlexible.js
import express from "express";
import multer from "multer";
import Product from "../models/Product.js";
import { askGemini } from "../utils/geminiClient.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: normalize keywords
function normalizeKeywords(text) {
  return text
    .split(",")
    .map(k => k.trim().toLowerCase())
    .filter(k => k.length > 0)
    .flatMap(k => k.split(/\s+/))
    .map(k => k.replace(/[^a-z0-9]/gi, ""))
    .filter(k => k.length > 2);
}

// Helper: extract max price from query text
function extractPrice(query) {
  const match = query?.match(/under\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

// Recommendations: by category or brand
async function getRecommendations(product) {
  if (!product) return [];
  return Product.find({
    _id: { $ne: product._id },
    $or: [
      { category: product.category },
      { brand: product.brand }
    ]
  }).limit(5);
}

// Comparisons: similar price range
async function getComparisons(product) {
  if (!product) return [];
  return Product.find({
    _id: { $ne: product._id },
    price: { $gte: product.price - 100, $lte: product.price + 100 }
  }).limit(5);
}

// POST /api/search/flexible
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { query } = req.body;
    const imageFile = req.file;

    let imageKeywords = [];
    if (imageFile) {
      const base64Image = imageFile.buffer.toString("base64");
      const aiText = await askGemini(
        `Describe this product image in keywords: ${base64Image}`
      );
      imageKeywords = normalizeKeywords(aiText);
    }

    const textKeywords = query ? normalizeKeywords(query) : [];
    const maxPrice = extractPrice(query);

    // Combine keywords from image + text
    const combinedKeywords = [...new Set([...imageKeywords, ...textKeywords])];

    // --- Structured Filters ---
    const filters = [];

    // Category filter
    const categoryKeywords = ["shirt","dress","kurta","shoes","top","handbag","gown","saree","jeans"];
    const categoryMatch = textKeywords.find(k => categoryKeywords.includes(k));
    if (categoryMatch) filters.push({ category: categoryMatch });

    // Color filter
    const colorKeywords = ["red","blue","green","black","white","pink","yellow","brown","purple","grey","maroon"];
    const colorMatch = textKeywords.find(k => colorKeywords.includes(k));
    if (colorMatch) filters.push({ colors: colorMatch });

    // Price filter
    if (maxPrice) filters.push({ price: { $lte: maxPrice } });

    // Other keywords (name, brand, occasion)
    const otherKeywords = combinedKeywords.filter(k => k !== categoryMatch && k !== colorMatch);
    if (otherKeywords.length) {
      const orQueries = otherKeywords.map(kw => ({
        $or: [
          { name: new RegExp(kw, "i") },
          { brand: new RegExp(kw, "i") },
          { occasion: new RegExp(kw, "i") }
        ]
      }));
      filters.push(...orQueries);
    }

    const mongoQuery = filters.length ? { $and: filters } : {};

    // Fetch products
    const products = await Product.find(mongoQuery).limit(50);
    const mainProduct = products[0] || null;

    // Recommendations & Comparisons
    const recommendations = await getRecommendations(mainProduct);
    const comparisons = await getComparisons(mainProduct);

    res.json({
      success: true,
      query,
      imageUploaded: !!imageFile,
      mode: imageFile && query ? "image+text" : imageFile ? "image-only" : "text-only",
      imageKeywords,
      textKeywords,
      combinedKeywords,
      maxPrice,
      products,
      recommendations,
      comparisons
    });

  } catch (err) {
    console.error("Flexible Search Error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
