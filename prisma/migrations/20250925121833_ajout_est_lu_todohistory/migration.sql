/*
  Warnings:

  - You are about to drop the column `dateDebut` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `tempsExecution` on the `Todo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TaskDelegation" DROP CONSTRAINT "TaskDelegation_todoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TaskDelegation" DROP CONSTRAINT "TaskDelegation_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TodoHistory" DROP CONSTRAINT "TodoHistory_todoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TodoHistory" DROP CONSTRAINT "TodoHistory_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Todo" DROP COLUMN "dateDebut",
DROP COLUMN "tempsExecution";

-- AlterTable
ALTER TABLE "public"."TodoHistory" ADD COLUMN     "estLu" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "public"."TaskDelegation" ADD CONSTRAINT "TaskDelegation_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "public"."Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskDelegation" ADD CONSTRAINT "TaskDelegation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TodoHistory" ADD CONSTRAINT "TodoHistory_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "public"."Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TodoHistory" ADD CONSTRAINT "TodoHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
