import z, { boolean, date, string } from "zod";

export const CreateSchemaTodo = z.object({
  libelle: z
    .string()
    .min(
      4,
      "Le libelle est requis et doit avoir au moins quatre (4) caractères"
    ),
  description: z.string().optional(),
  estAcheve: z.boolean().optional(),
});

export const UpdateSchemaTodo = z.object({
  id: z.number().int().positive("L'id doit être un entier positif").optional(),
  libelle: z
    .string()
    .min(4, "Le libelle doit avoir au moins quatre (4) caractères")
    .optional(),
  description: z.string().optional(),
  estAcheve: z.boolean().optional(),
});
