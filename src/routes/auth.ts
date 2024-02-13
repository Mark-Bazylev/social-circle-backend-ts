import express from "express";

const router = express.Router();

import {
  signIn,
  createAccount,
  changeEmail,
  changePassword,
  deleteUser,
} from "../controllers/auth";
import authenticateUser from "../middleware/authentication";
import { multerUpload } from "../middleware/image-handler";

router.route("/create").post(
  multerUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "avatarImage", maxCount: 1 },
  ]),
  createAccount,
);
router.route("/signIn").post(signIn);
router.route("/email").patch(authenticateUser, changeEmail);
router.route("/password").patch(authenticateUser, changePassword);
router.route("/delete").delete(authenticateUser, deleteUser);

export default router;
