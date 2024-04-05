import { ApiError } from "../utils/error.js";
import { Response } from "../utils/response.js";
import { Album } from "../models/album.model.js";

const createAlbum = async (req, res) => {
    try {
        const user = req.user;
        const { title, description } = req.body;
        if (!title) { throw new ApiError(400, "title is required"); }
        const album = await Album.create({
            owner: user._id,
            title: title,
            description: description,
        })
        if (!album) { throw new ApiError(500, "internal error in creating the album"); }
        res.status(201).json(new Response(201, { album: album }, "album created successfully"));
    } catch (error) {
        console.log(error);
    }
}

const deleteAlbum = async (req, res) => {
    try {
        const user = req.user;
        const { albumId } = req.params;
        const album = await Album.findById(albumId);
        if (!album) { throw new ApiError(400, "wrong album id"); }
        if (album.owner != user._id) { throw new ApiError(412, "user not authorize"); }
        const deleted = await Album.findByIdAndDelete(albumId)
        if (!deleted) { throw new ApiError(500, "internal error in deleting the album"); }
        res.status(200).json(new Response(200, { deletedAlbum: deleted }, "album deleted successfully"));
    } catch (error) {
        console.log(error);
    }
}

const addSongToAlbum = async (req, res) => {
    try {
        const { songId, albumId } = req.params;
        const user = req.user;
        const album = await Album.findById(albumId)
        if (!album) { throw new ApiError(400, "album id is wrong"); }
        const songs = album.songs;
        const userId = user._id;
        if (album.owner != userId) { throw new ApiError(500, "user not authorize"); }
        if (songs.includes(songId)) { throw new ApiError(412, "song is already added in the album"); }
        songs.push(songId);
        album.songs = songs;
        const added = await album.save({ validateBeforeSave: false })
        if (!added) { throw new ApiError(500, "Internal error in adding song"); }
        res.status(201).json(new Response(201, { album: added }, "song added successfully"));
    } catch (error) {
        console.log(error);
    }
}

const removeSongFromAlbum = async (req, res) => {
    try {
        const { songId, albumId } = req.params;
        const user = req.user;
        const album = await Album.findById(albumId)
        if (!album) { throw new ApiError(400, "album id is wrong"); }
        const songs = album.songs;
        const userId = user._id;
        if (album.owner != userId) { throw new ApiError(500, "user not authorize"); }
        if (!songs.includes(songId)) { throw new ApiError(412, "song is not there in the album"); }
        const index = songs.indexOf(songId);
        songs.splice(index, 1);
        album.songs = songs;
        const removed = await album.save({ validateBeforeSave: false });
        if (!removed) { throw new ApiError(500, "internal error in removing the song"); }
        res.status(200).json(new Response(200, { removedSong: removed }, "song removed successfully"));
    } catch (error) {
        console.log(error);
    }
}

export {
    createAlbum,
    deleteAlbum,
    addSongToAlbum,
    removeSongFromAlbum,
}