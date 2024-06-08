import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema(
    {
        productId: {
            type: String,
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        productUnit: {
            type: String,
            required: true,
        },
        storeHouse: {
            type: String,
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
    },
    {timestamps: true},
)

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;