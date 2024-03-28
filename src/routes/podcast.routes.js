import express from "express";
import {
    createPodcast,
    getUserPodcasts,
    deletePodcast,
} from "../controllers/podcast.controller.js";

const podcastRoute = express.Router()

podcastRoute.route("/create").post(createPodcast);
podcastRoute.route("/delete/:podcastId").delete(deletePodcast);
podcastRoute.route("/getUserPodcasts/:username").get(getUserPodcasts);

export default podcastRoute