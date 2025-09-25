import cloudinary from "../config/cloudinary.js";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  duration?: number;
  resourceType: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  resourceType?: "auto" | "image" | "video" | "raw";
  maxDuration?: number;
}

export class CloudinaryService {
  /**
   * Upload un fichier buffer vers Cloudinary
   */
  static async uploadFile(
    buffer: Buffer,
    options: CloudinaryUploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    const {
      folder = "todos",
      publicId,
      resourceType = "auto",
      maxDuration = 30,
    } = options;

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            public_id: publicId,
            resource_type: resourceType,
          },
          async (error, result) => {
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
                const resourceInfo = await cloudinary.api.resource(
                  result.public_id,
                  {
                    resource_type: result.resource_type,
                  }
                );

                if (
                  resourceInfo.duration &&
                  resourceInfo.duration > maxDuration
                ) {
                  // Supprimer le fichier si trop long
                  await cloudinary.uploader.destroy(result.public_id, {
                    resource_type: result.resource_type,
                  });
                  reject(
                    new Error(
                      `La durée du fichier dépasse ${maxDuration} secondes`
                    )
                  );
                  return;
                }
              }

              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                duration: result.duration,
                resourceType: result.resource_type,
              });
            } catch (durationError) {
              // Si on ne peut pas vérifier la durée, on continue
              console.warn("Impossible de vérifier la durée:", durationError);
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                duration: result.duration,
                resourceType: result.resource_type,
              });
            }
          }
        )
        .end(buffer);
    });
  }

  /**
   * Upload un fichier vocal
   */
  static async uploadVocal(
    buffer: Buffer,
    userId: number,
    context: string = "create"
  ): Promise<CloudinaryUploadResult> {
    const publicId = `vocal_${Date.now()}_${userId}_${context}`;

    return this.uploadFile(buffer, {
      folder: "todos/vocals",
      publicId,
      resourceType: "video", // Pour les fichiers audio
      maxDuration: 30,
    });
  }

  /**
   * Supprimer un fichier de Cloudinary
   */
  static async deleteFile(
    publicId: string,
    resourceType: "image" | "video" | "raw" = "image"
  ): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error) {
      console.error(
        `Erreur suppression fichier Cloudinary ${publicId}:`,
        error
      );
      throw new Error("Erreur lors de la suppression du fichier");
    }
  }

  /**
   * Extraire le public_id d'une URL Cloudinary
   */
  static extractPublicId(url: string): string | null {
    try {
      const matches = url.match(/\/v\d+\/(.+)\.[^.]+$/);
      return matches ? matches[1] : null;
    } catch (error) {
      console.error("Erreur extraction public_id:", error);
      return null;
    }
  }
}
