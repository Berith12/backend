import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, select: false },
    role: { type: String, enum: ["Librarian", "Borrower"], default: "Borrower" },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
export { UserSchema, User };