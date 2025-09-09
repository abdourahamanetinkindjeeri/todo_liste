-- CreateTable
CREATE TABLE "public"."TaskDelegation" (
    "id" SERIAL NOT NULL,
    "todoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TaskDelegation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TaskDelegation" ADD CONSTRAINT "TaskDelegation_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "public"."Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskDelegation" ADD CONSTRAINT "TaskDelegation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
