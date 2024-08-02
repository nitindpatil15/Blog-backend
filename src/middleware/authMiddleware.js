import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ACCESS_TOKEN_SECRET } from "../constant.js";

const verifyJWT = asynchandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      throw new ApiError(401, "UnAuthorized request");
    }
    const decodedJWT = jwt.verify(token, ACCESS_TOKEN_SECRET);
    console.log(`Decoded JWT: ${decodedJWT}`);

    if (!decodedJWT) {
      throw new ApiError(401, "Unauthorized request from middleware");
    }

    const user = await User.findById(decodedJWT?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export default verifyJWT;
