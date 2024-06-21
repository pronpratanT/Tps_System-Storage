import mongoose from "mongoose";
import { Schema } from "mongoose";

const importProduct = new Schema(
  {
    imProId: String,
    imProName: String,
    import: String,
  }
)

const importDbSchema = new Schema(
    {
        dateImport: { 
            type: String, 
            required: true 
        },
        documentId: { 
            type: String, 
            required: true 
        },
        importVen: { 
            type: String, 
            required: true 
        },
        importEm: { 
            type: String, 
            required: false 
        },
        selectedProduct: [importProduct]
    }
)

const ImportDb = mongoose.models.ImportDb || mongoose.model("ImportDb", importDbSchema);
export default ImportDb;