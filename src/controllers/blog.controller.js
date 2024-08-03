import Blog from "../models/Blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/claudinary.js";
import User from "../models/User.model.js";

const getAllBlogs = asynchandler(async (req, res) => {
  try {
    const { page = 1, limit = 10, query, sortBy, sortType, owner } = req.query;
    
    // Define sort and query criteria
    let sortCriteria = {};
    let blogQuery = {};

    if (owner) {
      blogQuery.owner = owner;
    }

    if (query) {
      blogQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }

    if (sortBy && sortType) {
      sortCriteria[sortBy] = sortType === "desc" ? -1 : 1;
    }

    // Fetch blogs with the defined criteria
    const blogs = await Blog.find(blogQuery)
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', 'username avatar'); // Populate user data (username and avatar)

    if (!blogs) {
      throw new ApiError(400, "Error while fetching blogs");
    }

    // Map blog data to include user details
    const enrichedBlogs = blogs.map(blog => ({
      ...blog._doc,
      author: {
        username: blog.owner.username,
        avatar: blog.owner.avatar,
      },
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, { blogs: enrichedBlogs }, "Blogs fetched"));
  } catch (error) {
    throw new ApiError(500, "Server Error...");
  }
});

const publishABlog = asynchandler(async (req, res) => {
  try {
    const { title, content } = req.body;

    if ([title, content].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All Fields are Required");
    }

    // TODO: get blog, upload to cloudinary, create blog
    let imageLocalpath;
    if (
      req.files &&
      Array.isArray(req.files.image) &&
      req.files.image.length > 0
    ) {
      imageLocalpath = req.files.image[0].path;
    }

    const image = await uploadOnCloudinary(imageLocalpath);

    const createBlog = await Blog.create({
      image: image?.url || "",
      title,
      content,
    });

    createBlog.owner = req.user;
    createBlog.save();

    console.log(createBlog);

    return res
      .status(200)
      .json(new ApiResponse(200, createBlog, "Blog Uploaded Successfully"));
  } catch (error) {
    throw new ApiError(500,"something goes wrong ! try again after sometime");
  }
});

const getBlogById = asynchandler(async (req, res) => {
  try {
    const { blogId } = req.params;
    //TODO: change field req position

    const blogById = await Blog.findById(blogId);

    if (!blogById) {
      throw new ApiError("Error while fetching Blog");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, blogById, "Blog fetched by blogId"));
  } catch (error) {
    throw new ApiError(500, "Error in fetching blog by Id");
  }
});

const updateBlog = asynchandler(async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, content } = req.body;

    if (!blogId) {
      throw new ApiError("Id is required");
    }
    if (!title) {
      throw new ApiError("Title are required");
    }

    const blogUpdate = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        content,
      },
      {
        new: true,
      }
    );

    if (!blogUpdate) {
      throw new ApiError("Server Error try later!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { blogUpdate }, "Blog updated successfully!"));
  } catch (error) {
    throw new ApiError(500, "Error in Updating Blog");
  }
});

const deleteBlog = asynchandler(async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!blogId) {
      throw new ApiError("Id is required");
    }

    const removeblog = await Blog.findByIdAndDelete(blogId);

    if (!removeblog) {
      throw new ApiError("Invalid Id please check it or try again!!");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, removeblog, "Blog Deleted Successfully!!"));
  } catch (error) {
    throw new ApiError(500, "Error in Deleting Blog");
  }
});

const getCurrentUserBlogs = asynchandler(async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new ApiError("Unauthorized", 401);
    }

    const channelsallblogs = await Blog.find({ owner: userId });
    if (!channelsallblogs) {
      throw new ApiError("No Blogs found", 201);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelsallblogs,
          "All Blogs are fetched successfully!!!"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Server error , try after sometimes!!!");
  }
});

export {
  getAllBlogs,
  publishABlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getCurrentUserBlogs,
};
