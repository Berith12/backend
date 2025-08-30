import mongoose from "mongoose";

const BorrowSchema = new mongoose.Schema(
    {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        borrowedDate: { type: Date, default: Date.now },
        returnDate: { type: Date, default: null },
    },
    { timestamps: true }
);

const Borrow = mongoose.model("Borrow", BorrowSchema);

export default Borrow;
export { BorrowSchema, Borrow };