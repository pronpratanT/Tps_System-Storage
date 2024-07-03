import mongoose from "mongoose";
import { Schema } from "mongoose";

const exportProduct = new Schema(
    {
        exProId: String,
        exProName: String,
        export: String,
    }
)

const exportDbSchema = new Schema(
    {
        dateExport: { 
            type: String, 
            required: true 
        },
        documentId: { 
            type: String, 
            required: true 
        },
        exportVen: { 
            type: String, 
            required: true 
        },
        exportEm: { 
            type: String, 
            required: false 
        },
        selectedProduct: [exportProduct]
    }
)

const ExportDb = mongoose.models.ExportDb || mongoose.model("ExportDb", exportDbSchema);
export default ExportDb