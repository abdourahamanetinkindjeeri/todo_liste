import multer from "multer";

export function configStorage(uploadPath: string = "./public/data/uploads/") {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });

  return multer({ storage });
}
