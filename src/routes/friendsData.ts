import express from "express";
const router = express.Router();

import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendsData,
} from "../controllers/friendsData";

router.route("/").get(getFriendsData);
router.route("/send").post(sendFriendRequest);
router.route("/accept").post(acceptFriendRequest);

export default router;
