import express from 'express'
import {
  loginUser,
  newUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  userProfile,
  updatePassword,
  updateProfile,
  getUsers,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js'
import { isAdmin, isAuthenticated } from '../middlewares/auth.js'
const router = express.Router()

router.route('/register').post(newUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)
router.route('/forgotPassword').post(forgotPassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/password/update').post(isAuthenticated, updatePassword)
router.route('/me').get(isAuthenticated, userProfile)
router.route('/me').put(isAuthenticated, updateProfile)
router.route('/admin/users').get(isAuthenticated, isAdmin, getUsers)
router
  .route('/admin/user/:id')
  .get(isAuthenticated, isAdmin, getUser)
  .put(isAuthenticated, isAdmin, updateUser)
  .delete(isAuthenticated, isAdmin, deleteUser)

export default router
