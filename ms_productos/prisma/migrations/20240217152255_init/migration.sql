-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('NUEVO', 'USADO');

-- CreateEnum
CREATE TYPE "Colores" AS ENUM ('ROJO', 'NARANJA', 'AZUL', 'VERDE');

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "state" "Estado" NOT NULL DEFAULT 'NUEVO',
    "colors" "Colores" NOT NULL,
    "price" BIGINT NOT NULL,
    "stock" INTEGER NOT NULL,
    "features_text" TEXT,
    "features_rows" TEXT[],
    "features_special" TEXT[],
    "published" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" SERIAL NOT NULL,
    "external_id" INTEGER NOT NULL,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_external_id_key" ON "Proveedor"("external_id");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
