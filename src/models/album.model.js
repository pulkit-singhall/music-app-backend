import mongoose from "mongoose";

const albumSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String, 
    },
    description: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",
        }
    ],
}, { timestamps: true });

export const Album = mongoose.model("Album", albumSchema);