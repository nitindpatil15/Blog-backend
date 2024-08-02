import { Router } from 'express';
import {
    toggleCommentLike,
    toggleBlogLike
} from "../controllers/like.controller.js"
import verifyJWT from "../middleware/authMiddleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:blogId").post(toggleBlogLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);

export default router