import { Router } from 'express';
import verifyJWT from '../middleware/authMiddleware.js'
import {getBlogComments,addComment} from '../controllers/comment.controller.js'

const router = Router(verifyJWT);

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:blogId").get(getBlogComments).post(addComment);

export default router