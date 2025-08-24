import express from 'express';
import Product from '../models/Product.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function getAIRecommendations(userQuery) {
    if (!userQuery) return [];
    const prompt = `
        You are a fashion search engine AI. Based on the user query "${userQuery}", 
        list up to 20 product names and styles from a hypothetical fashion catalog that would be a great match.
        Return ONLY a comma-separated list of these product names. 
        For example: "Floral Maxi Dress, High-Waisted Denim Shorts, Linen Button-Up Shirt".
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text.split(',').map(item => item.trim()).filter(item => item.length > 0);
    } catch (error) {
        console.error("Error fetching recommendations from Gemini:", error);
        return [];
    }
}

router.post('/', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing.' });
        }

        const { query, filters = {}, page = 1, limit = 12 } = req.body;

        // --- Step 1: Get AI Recommendations (if a query exists) ---
        const recommendedProductNames = await getAIRecommendations(query);

        // --- Step 2: Build a More Robust Database Query ---
        const dbQuery = {};
        
        // **NEW LOGIC:** Use an $or operator to combine a direct text search with AI results.
        // This ensures that even if the AI finds nothing, we still search for the user's term.
        if (query) {
            const queryRegex = new RegExp(query, 'i');
            const searchConditions = [
                { name: queryRegex },
                { description: queryRegex },
                { brand: queryRegex },
                { category: queryRegex },
                { colors: queryRegex } // Search in the colors array
            ];
            
            // If AI provides recommendations, add them to the search conditions
            if (recommendedProductNames.length > 0) {
                const aiRegexList = recommendedProductNames.map(name => new RegExp(name, 'i'));
                searchConditions.push({ name: { $in: aiRegexList } });
            }
            
            dbQuery.$or = searchConditions;
        }

        // --- Step 3: Apply Structured Filters ---
        // Filters are applied with $and to narrow down the results from the $or search.
        const filterConditions = [];
        if (filters.categories && filters.categories.length > 0) {
            filterConditions.push({ category: { $in: filters.categories } });
        }
        if (filters.brands && filters.brands.length > 0) {
            filterConditions.push({ brand: { $in: filters.brands } });
        }
        if (filters.colors && filters.colors.length > 0) {
            filterConditions.push({ colors: { $in: filters.colors } });
        }
        if (filters.sizes && filters.sizes.length > 0) {
            filterConditions.push({ availableSizes: { $in: filters.sizes } });
        }
        if (filters.price) {
            const priceCondition = {};
            if (filters.price.min != null) priceCondition.$gte = Number(filters.price.min);
            if (filters.price.max != null) priceCondition.$lte = Number(filters.price.max);
            if (Object.keys(priceCondition).length > 0) {
                filterConditions.push({ price: priceCondition });
            }
        }

        // If there are any filter conditions, add them to the main query
        if (filterConditions.length > 0) {
            dbQuery.$and = filterConditions;
        }

        // --- Step 4: Execute Query with Pagination ---
        const count = await Product.countDocuments(dbQuery);
        const products = await Product.find(dbQuery)
            .limit(limit)
            .skip(limit * (page - 1))
            .sort({ createdAt: -1 });

        res.json({
            products,
            page,
            pages: Math.ceil(count / limit),
            count
        });

    } catch (error) {
        console.error('Error in unified search:', error);
        res.status(500).json({ error: 'Server error during search' });
    }
});

export default router;
