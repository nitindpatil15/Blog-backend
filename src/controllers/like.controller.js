import { asynchandler } from "../utils/asynchandler.js";
import { Like } from "../models/Like.model.js";
import Blog from "../models/Blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Comment} from "../models/Comment.model.js";

const toggleBlogLike = asynchandler(async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!blogId) {
      throw new ApiError(401, "Invalid id");
    }
    const { userId } = req.user?._id;
    const condition = { likedBy: userId, blog: blogId };

    const like = await Like.findOne(condition);

    const isvalidblog = await Blog.findById(blogId);
    if (!isvalidblog) {
      throw new ApiError(401, "Blog not found");
    }

    if (!like) {
      const newLike = await Like.create({ blog: blogId, likedBy: userId });
      await Blog.findByIdAndUpdate(blogId, { $inc: { likes: +1 } });

      if (!newLike) {
        throw new ApiError(401, "like not created");
      }
      return res
        .status(200)
        .json(new ApiResponse(200, newLike, "Liked a blog!"));
    } else {
      const removelike = await Like.findOneAndDelete(condition);
      await Blog.findByIdAndUpdate(blogId, { $inc: { likes: -1 } });

      if (!removelike) {
        throw new ApiError(401, "like not Removed");
      }

      return res
        .status(200)
        .json(new ApiResponse(200, removelike, "unliked a Blog"));
    }
  } catch (error) {
    throw new ApiError(500, "Newtwork problem");
  }
});

// To Do like comment
const toggleCommentLike = asynchandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) {
    throw new ApiError(401, "Select valid comment!");
  }

  const { userId } = req.user?._id;
  const condition = { likedBy: userId, comment: commentId };

  const like = await Like.findOne(condition);
  if (!like) {
    const newlike = await Like.create({ likedBy: userId, comment: commentId });
    await Comment.findByIdAndUpdate(commentId, { $inc: { likes: +1 } });
    if (!newlike) {
      throw new ApiError(401, "like not Created");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, newlike, "Liked a Comment"));
  } else {
    const removelike = await Like.findOneAndDelete(condition);
    await Comment.findByIdAndUpdate(commentId, { $inc: { likes: -1 } });

    if (!removelike) {
      throw new ApiError(401, "like not Removed");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, removelike, "Unliked a Comment"));
  }
});

export { toggleCommentLike, toggleBlogLike };
