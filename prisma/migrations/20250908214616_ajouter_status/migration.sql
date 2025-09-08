-- CreateEnum
CREATE TYPE "public"."Statut" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'TERMINEE');

-- AlterTable
ALTER TABLE "public"."Todo" ADD COLUMN     "status" "public"."Statut" NOT NULL DEFAULT 'EN_COURS',
ALTER COLUMN "description" DROP NOT NULL;
