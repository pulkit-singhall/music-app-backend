import express from "express";
import {
    createSong,
    getUserSongs,
    deleteSong,
    likeSong,
    getUserLikedSongs,
} from "../controllers/song.controller.js";

const songRouter = express.Router()

songRouter.route("/create").post(createSong)
songRouter.route("/delete/:songId").delete(deleteSong)
songRouter.route("/like/:songId").post(likeSong)
songRouter.route("/userLikedSongs").get(getUserLikedSongs)
songRouter.route("/userSongs").get(getUserSongs)

export default songRouter