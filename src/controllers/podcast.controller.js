import { ApiError } from "../utils/error.js";
import { Podcast } from "../models/podcast.model.js";
import { User } from "../models/user.model.js";
import { Response } from "../utils/response.js";
import mongoose from "mongoose";

const createPodcast = async (req, res) => {
    try {
        const user = req.user;
        const { title, duration, audio, thumbnail } = req.body;
        if ([title, duration, audio, thumbnail].some((field) => {
            if (!field || field.trim() === "") { return true; }
        })) {
            throw new ApiError(400, "All fields are required!");
        }
        const podcast = await Podcast.create({
            title: title,
            duration: Number(duration),
            thumbnail: thumbnail,
            audio: audio,
            owner: user._id,
        });
        if (!podcast) {
            throw new ApiError(500, "Internal error in creating the podcast");
        }
        return res.status(200).json(new Response(200, { podcast: podcast }, "podcast created!"));
    } catch (error) {
        console.log(error);
    }
}

const getUserPodcasts = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.find({ username: username });
        if (!user) { throw new ApiError(410, "Invalid username"); }
        const podcasts = await User.aggregate([
            {
                $match: {
                    "_id": new mongoose.Types.ObjectId(user._id),
                }
            },
            {
                $lookup: {
                    from: "podcasts",
                    localField: "_id",
                    foreignField: "owner",
                    as: "userPodcasts",
                }
            },
            {
                $project: {
                    userPodcasts: 1,
                }
            }
        ]);
        if (!podcasts || podcasts.length === 0) { throw new ApiError(500, "Internal error in fetching podcasts"); }
        const userPodcasts = podcasts[0].userPodcasts;
        return res.status(200).json(new Response(200, { userPodcasts: userPodcasts }, "user podcasts fetched!"));
    } catch (error) {
        console.log(error);
    }
}

const deletePodcast = async (req, res) => {
    try {
        const user = req.user;
        const { podcastId } = req.params;
        const id = user._id;
        if (!podcastId) { throw new ApiError(400, "Podcast ID is required"); }
        const podcast = await Podcast.findById(podcastId);
        const owner = podcast.owner;
        if (!id.equals(owner)) { throw new ApiError(410, "User cant delete other podcasts"); }
        const deletedPodcast = await Podcast.findByIdAndDelete(podcast._id);
        if (!deletedPodcast) { throw new ApiError(500, "Internal error in deleting the podcast"); }
        return res.status(200).json(new Response(200, { deletedPodcast: deletedPodcast }, "Podcast deleted!"));
    } catch (error) {
        console.log(error);
    }
};

export {
    createPodcast,
    getUserPodcasts,
    deletePodcast,
}