import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { AccountDetails } from "../models/Account";
import { AuthenticatedRequest } from "./authentication";

export interface AuthenticatedAccountRequest extends AuthenticatedRequest {
  body: AccountDetails & { files: FileList };
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../", process.env.IMAGE_UPLOAD_PATH!)); // Destination folder for uploaded files
  },
  filename: function (req: AuthenticatedAccountRequest, file, cb) {
    if (file) {
      const fileId = uuidv4();
      const uniqueImageName = fileId + path.extname(file.originalname);
      file.originalname = uniqueImageName;
      cb(null, uniqueImageName);
    }
  },
});
const multerUpload = multer({ storage: storage });
export { multerUpload };
