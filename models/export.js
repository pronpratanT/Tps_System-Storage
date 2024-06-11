import mongoose from "mongoose";
import { Schema } from "mongoose";

const exportPDSchema = new Schema(
    {
        dateExport: {
            type: String,
            required: true,
        },
        documentId: {
            type: String,
            required: true,
        },
        exportVen: {
            type: String,
            required: true,
        },
        exportEm: {
            type: String,
            required: false,
        },
    },
    {timestamps: true},
)

const ExportPD = mongoose.models.ExportPD || mongoose.model("ExportPD", exportPDSchema);
export default ExportPD;