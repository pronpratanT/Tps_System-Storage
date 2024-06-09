import mongoose from "mongoose";
import { Schema } from "mongoose";

const roleSchema = new Schema(
    {
        role: {
            type: String,
            required: true,
        },
    },
    {timestamps: true},
)

const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);
export default Role;