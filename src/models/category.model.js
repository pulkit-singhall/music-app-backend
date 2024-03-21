import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    }
}, { timestamps: false });

export const Category = mongoose.model("Category", categorySchema);