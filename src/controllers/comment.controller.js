import mongoose from "mongoose";
import Blog from "../models/Blog.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import {Comment} from "../models/Comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const addComment = asynchandler(async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      throw new ApiError(402, "Invalid Video Id");
    }
    if (!content) {
      throw new ApiError(402, "All Fields Are required");
    }
    if (!userId) {
      throw new ApiError(401, "Unauthorized User");
    }

    const blogComment = await Comment.create({
      content,
      blog: blogId,
      owner: req.user?._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, blogComment, "Commented on Blog"));
  } catch (error) {
    throw new ApiError(500, "Server Error");
  }
});

const getBlogComments = asynchandler(async (req, res) => {
  try {
    const { blogId } = req.params; //blogId
    const { page = 1, limit = 10 } = req.params;

    const isValidVideo = await Blog.findById(blogId);

    if (!isValidVideo) {
      throw new ApiError(402, "Invalid Video");
    }

    const comments = await Comment.aggregate([
      {
        $match: { blog: new mongoose.Types.ObjectId(`${blogId}`) },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
    ]);

    if (!comments) {
      throw new ApiError(402, "No Comments");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Blog All Comments"));
  } catch (error) {
    throw new ApiError(401, "Server Error...");
  }
});

export { getBlogComments, addComment };
