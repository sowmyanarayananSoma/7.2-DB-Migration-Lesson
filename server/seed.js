// Run this script to populate your local MongoDB with sample products
// Usage: node seed.js

import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const products = [
  {
    name: 'Classic White Tee',
    price: 24.99,
    category: 'Clothing',
    description: 'A comfortable everyday t-shirt',
    attributes: { colour: 'white', sizes: ['S', 'M', 'L', 'XL'], material: 'cotton' },
    inStock: true,
  },
  {
    name: 'ProBook 14 Laptop',
    price: 999.99,
    category: 'Electronics',
    description: 'Lightweight laptop for everyday use',
    attributes: { ram: '16GB', storage: '512GB SSD', os: 'Windows 11', screenSize: '14 inch' },
    inStock: true,
  },
  {
    name: 'Clean Code',
    price: 34.99,
    category: 'Books',
    description: 'A handbook of agile software craftsmanship',
    attributes: { author: 'Robert C. Martin', isbn: '978-0132350884', pages: 464, language: 'English' },
    inStock: true,
  },
  {
    name: 'Running Shoes X200',
    price: 89.99,
    category: 'Footwear',
    description: 'Lightweight running shoes with cushioned sole',
    attributes: { colour: 'black', sizes: [7, 8, 9, 10, 11], brand: 'SpeedFit' },
    inStock: true,
  },
  {
    name: 'Wireless Headphones',
    price: 149.99,
    category: 'Electronics',
    description: 'Over-ear headphones with noise cancellation',
    attributes: { batteryLife: '30 hours', connectivity: 'Bluetooth 5.0', colour: 'black' },
    inStock: false,
  },
];

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

await Product.deleteMany({});
console.log('🗑️  Cleared existing products');

await Product.insertMany(products);
console.log(`✅ Inserted ${products.length} products`);

await mongoose.disconnect();
console.log('👋 Done — you can now start the server');
