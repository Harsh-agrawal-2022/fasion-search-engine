import express from 'express';
import Product from '../models/Product.js'; 
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';

const router = express.Router();

// --- Multer Setup for Image Uploads ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

async function getInfoFromImageAI(imageBuffer) {
    const prompt = "You are a fashion expert. Describe the clothing and accessories in this image in 5 to 7 keywords. Focus on item type, style, and color. Return only the keywords.";
    try {
        const imagePart = {
            inlineData: {
                data: imageBuffer.toString("base64"),
                mimeType: "image/jpeg",
            },
        };
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error analyzing image with AI:", error);
        return "";
    }
}

async function parseAndExpandQuery(userQuery) {
    if (!userQuery || !userQuery.trim()) return { searchTerms: '', filters: {}, suggestions: [] };
    
    const prompt = `
        You are an intelligent search query parser. Convert the user's query into JSON with keys: "searchTerms", "filters", "suggestions".
        Examples:
        - "red shirt under 100" -> {"searchTerms":"red shirt","filters":{"colors":["red"],"price":{"max":100}},"suggestions":["red tee","maroon top"]}
        - "blue jeans from Denim Co." -> {"searchTerms":"blue jeans","filters":{"colors":["blue"],"brands":["Denim Co."]},"suggestions":["light wash jeans"]}
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

router.post('/', upload.single('image'), async (req, res) => {
    try {
        const rawQuery = req.body.query || '';
        let manualFilters = {};
        if (req.body.filters) {
            manualFilters = typeof req.body.filters === 'string' ? JSON.parse(req.body.filters) : req.body.filters;
        }
        const { page = 1, limit = 12 } = req.body;

        let imageSearchTerms = '';
        if (req.file) {
            imageSearchTerms = await getInfoFromImageAI(req.file.buffer);
        }

        const textParsed = await parseAndExpandQuery(rawQuery);

        const combinedSearchTerms = `${imageSearchTerms} ${textParsed.searchTerms}`.trim();
        const combinedFilters = { ...textParsed.filters, ...manualFilters };

        const dbQuery = {};
        const filterConditions = [];

        // --- Text search ---
        if (combinedSearchTerms) dbQuery.$text = { $search: combinedSearchTerms };

        // --- Category, brand, color filters ---
        if (combinedFilters.categories?.length) filterConditions.push({ category: { $in: combinedFilters.categories } });
        if (combinedFilters.brands?.length) filterConditions.push({ brand: { $in: combinedFilters.brands } });
        if (combinedFilters.colors?.length) filterConditions.push({ colors: { $in: combinedFilters.colors } });

        // --- FIXED Price Filter ---
        if (combinedFilters.price) {
            let minPrice = null, maxPrice = null;

            if (combinedFilters.price.min != null) minPrice = Number(combinedFilters.price.min);
            if (combinedFilters.price.over != null) minPrice = Math.max(minPrice ?? 0, Number(combinedFilters.price.over));

            if (combinedFilters.price.max != null) maxPrice = Number(combinedFilters.price.max);
            if (combinedFilters.price.under != null) maxPrice = Math.min(maxPrice ?? Infinity, Number(combinedFilters.price.under));

            const priceCondition = {};
            if (minPrice != null) priceCondition.$gte = minPrice;
            if (maxPrice != null) priceCondition.$lte = maxPrice;

            if (Object.keys(priceCondition).length) filterConditions.push({ price: priceCondition });
        }

        if (filterConditions.length) dbQuery.$and = filterConditions;

        const projection = combinedSearchTerms ? { score: { $meta: "textScore" } } : {};
        const count = await Product.countDocuments(dbQuery);
        const productsQuery = Product.find(dbQuery, projection)
            .limit(limit)
            .skip(limit * (page - 1));

        if (combinedSearchTerms) productsQuery.sort({ score: { $meta: "textScore" } });
        else productsQuery.sort({ createdAt: -1 });

        const products = await productsQuery;

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
