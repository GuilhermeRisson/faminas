import { Router } from "express";
import {
  createUserController,
  getAllUsersController,
  getUserByIdController
} from "../controllers/userController";
import {
  createPostController,
  getAllPostsController
} from "../controllers/postController";

const router = Router();

// Users
router.post("/user", createUserController);
router.get("/user", getAllUsersController);
router.get("/user/:id", getUserByIdController);

// Posts
router.post("/post", createPostController);
router.get("/post", getAllPostsController);

export default router;