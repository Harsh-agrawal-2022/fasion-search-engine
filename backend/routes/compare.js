import express from 'express';
import Product from '../models/Product.js'; // Ensure this path is correct
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * @description A helper function to retry an async operation with exponential backoff.
 * @param {Function} asyncFn The async function to retry.
 * @param {number} retries The maximum number of retries.
 * @param {number} delay The initial delay in ms.
 * @returns {Promise<any>} The result of the async function.
 */
const withRetry = async (asyncFn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await asyncFn();
        } catch (error) {
            // Check if it's a rate limit error (status 429)
            if (error.status === 429) {
                console.log(`Rate limit exceeded. Retrying in ${delay / 1000}s... (${i + 1}/${retries})`);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2; // Exponential backoff
            } else {
                throw error; // Re-throw other errors immediately
            }
        }
    }
    throw new Error("Max retries reached. Could not complete the request.");
};


/**
 * @description Uses AI to compare a list of products and generate a summary.
 * @param {Array<Object>} products - An array of product objects from the database.
 * @returns {Promise<Object>} - An object containing the AI-generated comparison summary.
 */
async function compareProductsWithAI(products) {
    if (!products || products.length < 2) {
        return { summary: "Comparison requires at least two products.", products: [] };
    }

    const productDetails = products.map(p => ({
        id: p._id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        description: p.description,
        category: p.category
    }));

    const prompt = `
        You are a fashion shopping assistant. Based on the following JSON data of products, provide a comparison.

        Your response must be a single JSON object with two keys: "summary" and "products".
        - "summary": A brief, one-paragraph overview highlighting the key differences and which product might be better for different types of users.
        - "products": An array of objects, one for each product. Each object should have three keys: "id", "pros" (an array of 2-3 strings), and "cons" (an array of 1-2 strings).

        Analyze the products based on their name, brand, price, and description to infer their strengths and weaknesses.

        Here is the product data:
        ${JSON.stringify(productDetails)}

        Return ONLY the raw JSON object and nothing else.
    `;

    try {
        // --- NEW: Wrap the API call in the retry helper ---
        const result = await withRetry(() => model.generateContent(prompt));
        
        const response = await result.response;
        const text = response.text();
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error comparing products with AI after multiple retries:", error);
        return { summary: "Could not generate an AI comparison at this time.", products: [] };
    }
}


/**
 * @route   POST /api/compare
 * @desc    Fetch product details and generate an AI comparison for a list of product IDs
 * @access  Public
 * @body    { "productIds": ["id1", "id2", "id3"] }
 */
router.post('/', async (req, res) => {
    try {
        const { productIds } = req.body;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ error: 'An array of productIds is required.' });
        }

        const products = await Product.find({ '_id': { $in: productIds } });

        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'No products found for the given IDs.' });
        }

        const aiComparison = await compareProductsWithAI(products);

        const enhancedProducts = products.map(product => {
            const aiData = aiComparison.products.find(p => p.id === product._id.toString());
            return {
                ...product.toObject(),
                pros: aiData ? aiData.pros : [],
                cons: aiData ? aiData.cons : []
            };
        });

        res.json({ 
            products: enhancedProducts,
            summary: aiComparison.summary 
        });

    } catch (error) {
        console.error('Error in compare route:', error);
        res.status(500).json({ error: 'Server error while fetching comparison data.' });
    }
});

export default router;