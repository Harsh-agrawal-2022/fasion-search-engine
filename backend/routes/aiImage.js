import express from 'express';
import Product from '../models/Product.js'; 
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';

const router = express.Router();

// --- Multer Setup for Image Uploads ---
// This will store the uploaded file in memory as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

/**
 * @description Analyzes an image to identify fashion items and generate search terms.
 * @param {Buffer} imageBuffer - The image file buffer from multer.
 * @returns {Promise<string>} - A descriptive string of search terms.
 */
async function getInfoFromImageAI(imageBuffer) {
    const prompt = "You are a fashion expert. Describe the clothing and accessories in this image in 5 to 7 keywords. Focus on item type, style, and color. For example: 'blue floral summer dress' or 'black leather biker jacket'. Return only the keywords.";
    
    try {
        const imagePart = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/jpeg", // Assuming jpeg, multer can provide the actual type
            },
        };
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error analyzing image with AI:", error);
        return ""; // Return empty string on error
    }
}


/**
 * @description Parses a text query and expands it with synonyms.
 * @param {string} userQuery - The text sentence from the user.
 * @returns {Promise<object>} - A structured object with search terms, filters, and suggestions.
 */
async function parseAndExpandQuery(userQuery) {
    // This function remains the same as before
    if (!userQuery || !userQuery.trim()) {
        return { searchTerms: '', filters: {}, suggestions: [] };
    }
    const prompt = `
        You are an intelligent search query parser. Your task is to convert a user's natural language query into a structured JSON object with three keys: "searchTerms", "filters", and "suggestions".
        - "searchTerms": Keywords and synonyms for a text search (e.g., "winter jacket coat outerwear").
        - "filters": Specific attributes like "colors", "brands", "price".
        - "suggestions": An array of 3-4 alternative search phrases.

        Examples:
        - User input: "red shirt under 100" -> {"searchTerms": "red shirt top tee", "filters": {"colors": ["red"], "price": {"max": 100}}, "suggestions": ["long sleeve red tops", "red blouses", "maroon t-shirts"]}
        - User input: "blue jeans from Denim Co." -> {"searchTerms": "blue jeans denim pants", "filters": {"colors": ["blue"], "brands": ["Denim Co."]}, "suggestions": ["light wash jeans", "Denim Co. skinny jeans", "blue trousers"]}

        Now, parse the following query. Return ONLY the raw JSON object.

        User input: "${userQuery}"
    `;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing query with AI:", error);
        return { searchTerms: userQuery, filters: {}, suggestions: [] };
    }
}


// --- UPDATED ROUTE: Now handles image uploads with `upload.single('image')` ---
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // req.body will contain text fields, req.file will contain the image
        const rawQuery = req.body.query || '';
        const manualFilters = req.body.filters ? JSON.parse(req.body.filters) : {};
        const { page = 1, limit = 12 } = req.body;

        let imageSearchTerms = '';
        if (req.file) {
            imageSearchTerms = await getInfoFromImageAI(req.file.buffer);
        }

        const textParsed = await parseAndExpandQuery(rawQuery);
        
        // Combine search terms from both image and text for a powerful search
        const combinedSearchTerms = `${imageSearchTerms} ${textParsed.searchTerms}`.trim();
        const combinedFilters = { ...textParsed.filters, ...manualFilters };
        
        // --- Database Query Logic (remains the same) ---
        const dbQuery = {};
        const filterConditions = [];

        if (combinedSearchTerms) {
            dbQuery.$text = { $search: combinedSearchTerms };
        }

        if (combinedFilters.categories && combinedFilters.categories.length > 0) {
            filterConditions.push({ category: { $in: combinedFilters.categories } });
        }
        if (combinedFilters.brands && combinedFilters.brands.length > 0) {
            filterConditions.push({ brand: { $in: combinedFilters.brands } });
        }
        if (combinedFilters.colors && combinedFilters.colors.length > 0) {
            filterConditions.push({ colors: { $in: combinedFilters.colors } });
        }
        if (combinedFilters.price) {
            const priceCondition = {};
            if (combinedFilters.price.min != null) priceCondition.$gte = Number(combinedFilters.price.min);
            if (combinedFilters.price.max != null) priceCondition.$lte = Number(combinedFilters.price.max);
            if (Object.keys(priceCondition).length > 0) {
                filterConditions.push({ price: priceCondition });
            }
        }
        
        if (filterConditions.length > 0) {
            dbQuery.$and = filterConditions;
        }

        const projection = { score: { $meta: "textScore" } };
        const count = await Product.countDocuments(dbQuery);
        const products = await Product.find(dbQuery, projection)
            .sort({ score: { $meta: "textScore" } })
            .limit(limit)
            .skip(limit * (page - 1));

        res.json({
            products,
            page,
            pages: Math.ceil(count / limit),
            count,
            suggestions: textParsed.suggestions
        });

    } catch (error) {
        console.error('Error in unified search:', error);
        res.status(500).json({ error: 'Server error during search' });
    }
});

export default router;
