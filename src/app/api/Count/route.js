// pages/api/counts.js
import { connectMongoDB } from '../../../../lib/mongodb';
import Product from '@/../../models/product';

export default async function handler(req, res) {
  try {
    await connectMongoDB();
    const productCount = await Product.countDocuments({});

    res.status(200).json({ productCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product count' });
  }
}