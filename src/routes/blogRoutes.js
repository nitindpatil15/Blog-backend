import { Router } from "express";
import { deleteBlog, getAllBlogs, getBlogById, getCurrentUserBlogs, publishABlog, updateBlog } from '../controllers/blog.controller.js'
import verifyJWT from '../middleware/authMiddleware.js'
import { upload } from "../middleware/multerMiddleware.js";

const router = Router();


router.route("/").get(getAllBlogs)
  router.route('/').post(
    upload.fields([
      {
        name: "image",
        maxCount: 1,
      }
    ]),verifyJWT,
    publishABlog
  );

router.route('/user/blogs').get(verifyJWT,getCurrentUserBlogs)
router
  .route("/:blogId")
  .get(getBlogById)
  .delete(verifyJWT,deleteBlog)
  .patch(verifyJWT,updateBlog);

export default router;