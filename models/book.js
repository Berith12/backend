import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        author: { type: String, required: true, trim: true },
        isbn: { type: String, required: true, unique: true, trim: true },
        quantity: { type: Number, required: true, min: 0 },
        available: { type: Number, required: true, min: 0 },
        // fields used by the current frontend UI
        cover: { type: String, default: "" },
        genres: { type: [String], default: [] },
        type: { type: String, default: "LIGHT NOVEL" },
        status: { type: String, default: "Ongoing" },
        rating: { type: Number, min: 0, max: 10, default: 0 },
        summary: { type: String, default: "" },
        recommended: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);

export default Book;
export { BookSchema, Book };