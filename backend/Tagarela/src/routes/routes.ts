import { Router } from "express";
import {
  createUserController,
  getAllUsersController,
  getUserByIdController,
  deleteUserController,
  getPostsWhereUserIsVictimController,
  getTopAuthorsController
} from "../controllers/userController";
import {
  createPostController,
  getAllPostsController
} from "../controllers/postController";

const router = Router();

// Users
router.post("/user", createUserController);
router.get("/user", getAllUsersController);
router.get("/user/top-authors", getTopAuthorsController);
router.get("/user/:id", getUserByIdController);
router.delete("/user/:id", deleteUserController);
router.get("/user/:id/victim-posts", getPostsWhereUserIsVictimController);

// Posts
router.post("/post", createPostController);
router.get("/post", getAllPostsController);

export default router;