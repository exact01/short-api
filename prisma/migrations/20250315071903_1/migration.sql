/*
  Warnings:

  - You are about to drop the column `meanPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `medianPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `userUuid` on the `purchases` table. All the data in the column will be lost.
  - Added the required column `mean_price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `median_price` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_userUuid_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "meanPrice",
DROP COLUMN "medianPrice",
ADD COLUMN     "mean_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "median_price" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT date_trunc('second', now()),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "purchases" DROP COLUMN "userUuid",
ALTER COLUMN "created_at" SET DEFAULT date_trunc('second', now()),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT date_trunc('second', now()),
ALTER COLUMN "updated_at" SET DEFAULT now();

-- CreateTable
CREATE TABLE "user_balance" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "balance" DOUBLE PRECISION NOT NULL,
    "user_uuid" UUID NOT NULL,

    CONSTRAINT "user_balance_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "user_balance" ADD CONSTRAINT "user_balance_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
