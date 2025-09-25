-- AlterTable
ALTER TABLE "public"."Todo" ADD COLUMN     "dateDebut" TIMESTAMP(3),
ADD COLUMN     "tempsExecution" INTEGER NOT NULL DEFAULT 0;
