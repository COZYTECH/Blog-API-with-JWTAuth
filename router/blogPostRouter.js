import express from "express";
import {
  createBlogPost,
  getAllBlogPost,
} from "./../controller/blogPostController.js";

const router = express.Router();

router.get("/blogpost", getAllBlogPost);
router.post("/createblog", createBlogPost);

export default router;
