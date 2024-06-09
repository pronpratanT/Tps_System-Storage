import mongoose from "mongoose";
import { Schema } from "mongoose";

const importPDSchema = new Schema(
    {
        dateImport: {
            type: String,
            required: true,
        },
        documentId: {
            type: String,
            required: true,
        },
        importVen: {
            type: String,
            required: true,
        },
        importEm: {
            type: String,
            required: false,
        },
    },
    {timestamps: true},
)

const ImportPD = mongoose.models.ImportPD || mongoose.model("ImportPD", importPDSchema);
export default ImportPD;