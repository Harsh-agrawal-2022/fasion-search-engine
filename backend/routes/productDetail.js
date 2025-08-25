import express from 'express';
import Product from '../models/Product.js'; // Adjust path to your Product model if needed

const router = express.Router();

/**
 * @route   GET /api/products/:id
 * @desc    Fetch a single product by its ID and also find related products.
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        // Find the main product by its ID from the URL parameter
        const product = await Product.findById(req.params.id);

        // If no product is found with that ID, return a 404 error
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find up to 4 related products from the same category.
        // We exclude the current product from the results using `$ne` (not equal).
        const relatedProducts = await Product.find({
            category: product.category, // Match the category
            _id: { $ne: product._id }    // Exclude the product itself
        }).limit(4); // Limit to 4 related products

        // Send both the main product and the related products to the frontend
        res.json({
            product,
            relatedProducts
        });

    } catch (error) {
        console.error('Error fetching product details:', error);
        
        // Handle cases where the provided ID is not in a valid format
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(500).json({ error: 'Server error' });
    }
});

export default router