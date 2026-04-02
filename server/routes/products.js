import express from 'express';
import Product from '../models/Product.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Conditionally apply auth middleware in production only
const authIfProd = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return requireAuth(req, res, next);
  }
  next();
};

// GET /api/products — open in both environments
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id — open in both environments
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products — requires login in production
router.post('/', authIfProd, async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/products/:id — requires login in production
router.delete('/:id', authIfProd, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
