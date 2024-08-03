import { Router } from 'express';
import verifyJWT from '../middleware/authMiddleware.js'
import {getBlogComments,addComment} from '../controllers/comment.controller.js'

const router = Router(verifyJWT);

router.route("/:blogId").get(getBlogComments).post(verifyJWT,addComment);

export default router