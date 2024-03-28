import { Response } from "../utils/response.js";
import { ApiError } from "../utils/error.js";
import { Category } from "../models/category.model.js";

const createCategory = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) { throw new ApiError(400, "title is required!"); }
        const category = await Category.create({
            title: title,
            description: description,
        });
        if (!category) { throw new ApiError(500, "Internal error in creating category"); }
        return res.status(200).json(new Response(200, { category: category }, "Category created"));
    } catch (error) {
        console.log(error);
    }
}

const songsByCategory = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) { throw new ApiError(400, "title is required!"); }
        const songs = await Category.aggregate([
            {
                $match: {
                    "title": title,
                }
            },
            {
                $lookup: {
                    from: "songs",
                    localField: "_id",
                    foreignField: "category",
                    as:"categorySongs",
                }
            },
            {
                $project: {
                    categorySongs:1,
                }
            }
        ]);
        if (!songs || songs.length === 0) { throw new ApiError(500, "Internal error in finding category songs"); }
        return res.status(200).json(new Response(200, { categorySongs: songs[0].categorySongs }, "category songs fetched!"));
    } catch (error) {
        console.log(error);
    }
}

export {
    createCategory,
    songsByCategory,
}