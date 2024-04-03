import express from "express";
import { createCategory, songsByCategory } from "../controllers/category.controller";

const categoryRouter = express.Router()

categoryRouter.route("/create").post(createCategory)
categoryRouter.route("/categorySongs").get(songsByCategory)

export default categoryRouter