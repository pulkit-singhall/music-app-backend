import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
        required: true,
    },
}, { timestamps: true });

export const Like = mongoose.model("Like", likeSchema);