import express from "express";

const router = express.Router();
import { multerUpload } from "../middleware/image-handler";

import { getAccounts, getAccount, editAccount } from "../controllers/accounts";

router.route("/").get(getAccounts);
router.route("/:id").get(getAccount);
router.route("/edit").patch(
  multerUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "avatarImage", maxCount: 1 },
  ]),
  editAccount,
);

export default router;
