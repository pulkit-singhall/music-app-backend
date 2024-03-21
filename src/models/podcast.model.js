import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    plays: {
        type: Number,
        default: 0,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    audio: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", 
    }
}, { timestamps: true });

export const Podcast = mongoose.model("Podcast", podcastSchema);