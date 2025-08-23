import Product from '../models/Product.js';

/**
 * GET /api/products
 * Query params:
 *  - search (text)
 *  - brand
 *  - category
 *  - occasion
 *  - color
 *  - price_gte, price_lte
 *  - min_rating
 *  - page, limit, sort (price_asc, price_desc, rating_desc)
 */
export const listProducts = async (req, res) => {
  try {
    const {
      search, brand, category, occasion, color,
      price_gte, price_lte, min_rating,
      page = 1, limit = 24, sort
    } = req.query;

    const query = {};

    if (search) query.$text = { $search: search };
    if (brand) query.brand = new RegExp(`^${brand}$`, 'i');
    if (category) query.category = new RegExp(`^${category}$`, 'i');
    if (occasion) query.occasion = new RegExp(`^${occasion}$`, 'i');
    if (color) query.colors = { $in: [ new RegExp(`^${color}$`, 'i') ] };
    if (price_gte || price_lte) {
      query.price = {};
      if (price_gte) query.price.$gte = Number(price_gte);
      if (price_lte) query.price.$lte = Number(price_lte);
    }
    if (min_rating) query.rating = { $gte: Number(min_rating) };

    const skip = (Number(page) - 1) * Number(limit);

    let cursor = Product.find(query);

    // sorting
    if (sort === 'price_asc') cursor = cursor.sort({ price: 1 });
    else if (sort === 'price_desc') cursor = cursor.sort({ price: -1 });
    else if (sort === 'rating_desc') cursor = cursor.sort({ rating: -1 });
    else cursor = cursor.sort({ createdAt: -1 });

    const [total, items] = await Promise.all([
      Product.countDocuments(query),
      cursor.skip(skip).limit(Number(limit))
    ]);

    res.json({ total, page: Number(page), limit: Number(limit), items });
  } catch (err) {
    console.error('listProducts', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Product not found' });
    res.json(item);
  } catch (err) {
    console.error('getProductById', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const productsByOccasion = async (req, res) => {
  try {
    const { occasion } = req.params;
    const items = await Product.find({ occasion: new RegExp(`^${occasion}$`, 'i') }).limit(100);
    res.json(items);
  } catch (err) {
    console.error('productsByOccasion', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const distinctBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands);
  } catch (err) {
    console.error('distinctBrands', err);
    res.status(500).json({ message: 'Server error' });
  }
};
