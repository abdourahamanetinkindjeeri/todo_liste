import z from "zod";

export const CreateSchemaUser = z.object({
  nom: z
    .string()
    .min(2, "Le nom est requis et doit avoir au moins deux caractères"),
  prenom: z
    .string()
    .min(2, "Le prénom doit avoir au moins deux caractères")
    .optional(),
  email: z.string().email("L'email doit être valide"),
  password: z
    .string()
    .min(6, "Le mot de passe est requis et doit avoir au moins 6 caractères"),
  role: z.enum(["USER", "PROPRIETAIRE"]).optional(),
});

export const UpdateSchemaUser = z.object({
  id: z.number().int().positive("L'id doit être un entier positif").optional(),
  nom: z
    .string()
    .min(2, "Le nom doit avoir au moins deux caractères")
    .optional(),
  prenom: z
    .string()
    .min(2, "Le prénom doit avoir au moins deux caractères")
    .optional(),
  email: z.string().email("L'email doit être valide").optional(),
  role: z.enum(["USER", "PROPRIETAIRE"]).optional(),
});
