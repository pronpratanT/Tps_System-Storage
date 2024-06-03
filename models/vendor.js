import mongoose from "mongoose";
import { Schema } from "mongoose";

const vendorSchema = new Schema(
    {
        vendorId: {
            type: String,
            required: true,
        },
        vendorName: {
            type: String,
            required: true,
        },
    },
    {timestamps: true},
)

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
export default Vendor;