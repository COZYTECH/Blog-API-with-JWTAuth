import express from "express";
import {
  commentController,
  updateCommentControllerById,
  getAllComment,
  deleteCommentById,
} from "./../controller/commentController.js";
const router = express.Router();
router.post("/comments", commentController);
router.put("/comments/:id", updateCommentControllerById);
router.get("/comments", getAllComment);
router.delete("/comments/:id", deleteCommentById);

export default router;
