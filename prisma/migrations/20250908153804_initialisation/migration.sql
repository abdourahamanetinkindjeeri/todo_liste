/*
  Warnings:

  - You are about to drop the column `dateCreation` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `derniereModif` on the `Todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Todo" DROP COLUMN "dateCreation",
DROP COLUMN "derniereModif";
