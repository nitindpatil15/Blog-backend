import {Router} from 'express'
import {getCurrentUser, logoutUser, registerUser, loginUser} from '../controllers/user.controller.js'
import { upload } from '../middleware/multerMiddleware.js';

const router = Router()

router.route("/register").post(
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      }
    ]),
    registerUser
  );

router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/profile').post(getCurrentUser)

export default router