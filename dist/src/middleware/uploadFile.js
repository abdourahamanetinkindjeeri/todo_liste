"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configStorage = configStorage;
const multer_1 = __importDefault(require("multer"));
function configStorage(uploadPath = "./public/data/uploads/") {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "_" + file.originalname);
        },
    });
    return (0, multer_1.default)({ storage });
}
