import mongoose from 'mongoose';

// Products use a flexible schema because different categories
// have completely different attributes — a t-shirt vs a laptop vs a book.
// The `attributes` field stores whatever extra fields a product needs.
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    // Mixed type = any shape — { sizes: ['S','M','L'] } or { ram: '16GB' }
    attributes: { type: mongoose.Schema.Types.Mixed, default: {} },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
