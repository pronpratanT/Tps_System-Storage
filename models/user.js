import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema(
    {
        userid: {
            type: String,
            required: false,
            default: "NONE",
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: false,
            default: "USER",
        },
    },
    {timestamps: true}
)

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;