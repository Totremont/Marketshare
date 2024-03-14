/*
  Warnings:

  - The `colors` column on the `Producto` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "colors",
ADD COLUMN     "colors" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "features_rows" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "features_special" SET DEFAULT ARRAY[]::TEXT[];

-- DropEnum
DROP TYPE "Colores";
