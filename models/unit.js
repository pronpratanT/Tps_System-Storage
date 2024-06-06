import mongoose, {Schema} from 'mongoose'

const unitSchema = new Schema(
    {
        unitId: {
            type: String,
            required: true,
        },
        unitName: {
            type: String,
            required: true,
        }
    },
    {timestamps: true}
)

const Unit = mongoose.models.Unit || mongoose.model("Unit", unitSchema);
export default Unit;