import { Router } from 'express';
import {
    toggleBlogLike
} from "../controllers/like.controller.js"

const router = Router();

router.route("/toggle/v/:blogId").post(toggleBlogLike);

export default router