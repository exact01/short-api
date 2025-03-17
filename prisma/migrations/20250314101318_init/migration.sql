-- CreateTable
CREATE TABLE "users" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT date_trunc('second', now()),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "products" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "market_hash_name" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "suggested_price" DOUBLE PRECISION NOT NULL,
    "item_page" TEXT NOT NULL,
    "market_page" TEXT NOT NULL,
    "min_price" DOUBLE PRECISION NOT NULL,
    "max_price" DOUBLE PRECISION NOT NULL,
    "meanPrice" DOUBLE PRECISION NOT NULL,
    "medianPrice" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT date_trunc('second', now()),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "products_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "purchases" (
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_uuid" UUID NOT NULL,
    "user_uuid" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT date_trunc('second', now()),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "userUuid" UUID,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_product_uuid_fkey" FOREIGN KEY ("product_uuid") REFERENCES "products"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
