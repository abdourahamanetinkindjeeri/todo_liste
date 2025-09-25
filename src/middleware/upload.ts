import multer from "multer";
import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// On étend le type officiel Options["params"]
type CloudinaryParams = {
    folder?: string;
    resource_type?: "auto" | "image" | "video" | "raw";
    public_id?: string;
};

const storage = new CloudinaryStorage({
    cloudinary,
    params: (): CloudinaryParams => ({
        folder: "vocaux",
        resource_type: "auto",
    }),
});

const upload = multer({ storage });

export default upload;
