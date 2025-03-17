/*
  Warnings:

  - A unique constraint covering the columns `[user_uuid]` on the table `user_balance` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "created_at" SET DEFAULT date_trunc('second', now()),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "purchases" ALTER COLUMN "created_at" SET DEFAULT date_trunc('second', now()),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT date_trunc('second', now()),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- CreateIndex
CREATE UNIQUE INDEX "user_balance_user_uuid_key" ON "user_balance"("user_uuid");
