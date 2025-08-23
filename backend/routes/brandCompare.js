// backend/routes/brandCompare.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { brandA, brandB } = req.body;

    const productsA = await Product.find({ brand: brandA });
    const productsB = await Product.find({ brand: brandB });

    const avgPriceA = productsA.reduce((a, b) => a + b.price, 0) / (productsA.length || 1);
    const avgPriceB = productsB.reduce((a, b) => a + b.price, 0) / (productsB.length || 1);

    const score = avgPriceA < avgPriceB ? `${brandA} is cheaper` : `${brandB} is cheaper`;

    res.json({ brandA: avgPriceA, brandB: avgPriceB, score });
  } catch (err) {
    res.status(500).json({ error: "Comparison failed" });
  }
});

export default router;
