import fs from "fs";
import path from "path";

export function deleteImageFile(imageName: string) {
  const filePath = path.join(__dirname, "../../", process.env.IMAGE_UPLOAD_PATH!, imageName);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return;
    }
    console.log("Image file deleted successfully:", filePath);
  });
}
