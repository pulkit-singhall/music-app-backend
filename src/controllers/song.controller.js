import { Song } from "../models/song.model.js";
import { ApiError } from "../utils/error.js";
import { User } from "../models/user.model.js";
import { Response } from "../utils/response.js";
import { Like } from "../models/like.model.js";
import mongoose from "mongoose";

const createSong = async (req, res) => {
    try {
        const user = req.user;
        const { title, duration, audio, thumbnail } = req.body;
        if ([title, duration, audio, thumbnail].some((field) => {
            if (!field || field.trim() === "") { return true; }
        })) {
            throw new ApiError(400, "All fields are required!");
        }
        const song = await Song.create({
            title: title,
            duration: Number(duration),
            thumbnail: thumbnail,
            audio: audio,
            owner: user._id,
        });
        if (!song) {
            throw new ApiError(500, "Internal error in creating the song");
        }
        return res.status(200).json(new Response(200, { song: song }, "song created!"));
    } catch (error) {
        console.log(error);
    }
}

const getUserSongs = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.find({ username: username });
        if (!user) { throw new ApiError(410, "Invalid username"); }
        const songs = await User.aggregate([
            {
                $match: {
                    "_id": new mongoose.Types.ObjectId(user._id),
                }
            },
            {
                $lookup: {
                    from: "songs",
                    localField: "_id",
                    foreignField: "owner",
                    as: "userSongs",
                }
            },
            {
                $project: {
                    userSongs: 1,
                }
            }
        ]);
        if (!songs || songs.length === 0) { throw new ApiError(500, "Internal error in fetching songs"); }
        const userSongs = songs[0].userSongs;
        return res.status(200).json(new Response(200, { userSongs: userSongs }, "user songs fetched!"));
    } catch (error) {
        console.log(error);
    }
}

const deleteSong = async (req, res) => {
    try {
        const user = req.user;
        const { songId } = req.params;
        const id = user._id;
        if (!songId) { throw new ApiError(400, "song ID is required"); }
        const song = await Song.findById(songId);
        const owner = song.owner;
        if (!id.equals(owner)) { throw new ApiError(410, "User cant delete other songs"); }
        const deletedSong = await Song.findByIdAndDelete(song._id);
        if (!deletedSong) { throw new ApiError(500, "Internal error in deleting the song"); }
        return res.status(200).json(new Response(200, { deletedSong: deletedSong }, "Song deleted!"));
    } catch (error) {
        console.log(error);
    }
};

const likeSong = async (req, res) => {
    try {
        const user = req.user;
        const { songId } = req.params;
        const like = await Like.create({
            likedBy: user._id,
            likedTo: songId,
        });
        if (!like) { throw new ApiError(500, "Internal error in liking the song"); }
        return res.status(201).json(new Response(201, {}, "Song liked"));
    } catch (error) {
        console.log(error);
    }
}

const getUserLikedSongs = async (req, res) => {
    try {
        const user = req.user;
        const id = user._id;
        const songs = await User.aggregate([
            {
                $match: {
                    "_id": new mongoose.Types.ObjectId(id),
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "likedBy",
                    as: "likedSongs",
                }
            },
            {
                $project: {
                    likedSongs: 1,
                }
            }
        ]);
        if (!songs || songs.length === 0) { throw new ApiError(500, "Internal error in fetching liked songs"); }
        const likedSongs = songs[0].likedSongs;
        return res.status(200).json(new Response(200, { likedSongs: likedSongs }, "user liked songs fetched!"));
    } catch (error) {
        console.log(error);
    }
}

export {
    createSong,
    getUserSongs,
    deleteSong,
    likeSong,
    getUserLikedSongs,
}