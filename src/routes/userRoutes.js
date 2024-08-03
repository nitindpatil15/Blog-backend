import {Router} from 'express'
import {getCurrentUser, logoutUser, registerUser, loginUser} from '../controllers/user.controller.js'
import verifyJWT from '../middleware/authMiddleware.js';
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
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/profile').post(verifyJWT,getCurrentUser)

export default router