"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_js_1 = __importDefault(require("../config/cloudinary.js"));
class CloudinaryService {
    /**
     * Upload un fichier buffer vers Cloudinary
     */
    static uploadFile(buffer_1) {
        return __awaiter(this, arguments, void 0, function* (buffer, options = {}) {
            const { folder = "todos", publicId, resourceType = "auto", maxDuration = 30, } = options;
            return new Promise((resolve, reject) => {
                cloudinary_js_1.default.uploader
                    .upload_stream({
                    folder,
                    public_id: publicId,
                    resource_type: resourceType,
                }, (error, result) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        reject(new Error(`Erreur upload Cloudinary: ${error.message}`));
                        return;
                    }
                    if (!result) {
                        reject(new Error("Aucun résultat retourné par Cloudinary"));
                        return;
                    }
                    try {
                        // Vérifier la durée pour les fichiers audio/video
                        if (resourceType === "video" && maxDuration > 0) {
                            const resourceInfo = yield cloudinary_js_1.default.api.resource(result.public_id, {
                                resource_type: result.resource_type,
                            });
                            if (resourceInfo.duration &&
                                resourceInfo.duration > maxDuration) {
                                // Supprimer le fichier si trop long
                                yield cloudinary_js_1.default.uploader.destroy(result.public_id, {
                                    resource_type: result.resource_type,
                                });
                                reject(new Error(`La durée du fichier dépasse ${maxDuration} secondes`));
                                return;
                            }
                        }
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                            duration: result.duration,
                            resourceType: result.resource_type,
                        });
                    }
                    catch (durationError) {
                        // Si on ne peut pas vérifier la durée, on continue
                        console.warn("Impossible de vérifier la durée:", durationError);
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                            duration: result.duration,
                            resourceType: result.resource_type,
                        });
                    }
                }))
                    .end(buffer);
            });
        });
    }
    /**
     * Upload un fichier vocal
     */
    static uploadVocal(buffer_1, userId_1) {
        return __awaiter(this, arguments, void 0, function* (buffer, userId, context = "create") {
            const publicId = `vocal_${Date.now()}_${userId}_${context}`;
            return this.uploadFile(buffer, {
                folder: "todos/vocals",
                publicId,
                resourceType: "video", // Pour les fichiers audio
                maxDuration: 30,
            });
        });
    }
    /**
     * Supprimer un fichier de Cloudinary
     */
    static deleteFile(publicId_1) {
        return __awaiter(this, arguments, void 0, function* (publicId, resourceType = "image") {
            try {
                yield cloudinary_js_1.default.uploader.destroy(publicId, {
                    resource_type: resourceType,
                });
            }
            catch (error) {
                console.error(`Erreur suppression fichier Cloudinary ${publicId}:`, error);
                throw new Error("Erreur lors de la suppression du fichier");
            }
        });
    }
    /**
     * Extraire le public_id d'une URL Cloudinary
     */
    static extractPublicId(url) {
        try {
            const matches = url.match(/\/v\d+\/(.+)\.[^.]+$/);
            return matches ? matches[1] : null;
        }
        catch (error) {
            console.error("Erreur extraction public_id:", error);
            return null;
        }
    }
}
exports.CloudinaryService = CloudinaryService;
