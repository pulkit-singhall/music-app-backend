import express from "express";
import { addSongToAlbum, createAlbum, deleteAlbum, removeSongFromAlbum } from "../controllers/album.controller";

const albumRouter = express.Router()

albumRouter.route("/create").post(createAlbum)
albumRouter.route("/delete").delete(deleteAlbum)
albumRouter.route("/addSong/:songId/:albumId").patch(addSongToAlbum)
albumRouter.route("/removeSong/:songId/:albumId").patch(removeSongFromAlbum)

export default albumRouter