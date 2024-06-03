import mongoose, {Schema} from 'mongoose'

const unitSchema = new Schema(
    {
        unitid: {
            type: String,
            required: true,
        },
        unitname: {
            type: String,
            required: true,
        }
    },
    {timestamps: true}
)

const Unit = mongoose.models.Unit || mongoose.model("Unit", unitSchema);
export default Unit;