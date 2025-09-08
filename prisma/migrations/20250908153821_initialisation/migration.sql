/*
  Warnings:

  - Added the required column `derniereModif` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Todo" ADD COLUMN     "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "derniereModif" TIMESTAMP(3) NOT NULL;
