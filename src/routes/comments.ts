import express from "express";
const router = express.Router();

import {
  createComment,
  getMyComments,
  getPostComments,
  getComment,
  getCommentLikes,
  toggleLikeComment,
} from "../controllers/comments";

router.route("/").get(getMyComments).post(createComment);
router.route("/:id").get(getComment);
router.route("/post/:id").get(getPostComments);
router.route("/likes/:id").get(getCommentLikes);
router.route("/likes/toggleLike/:id").post(toggleLikeComment);

export default router;
