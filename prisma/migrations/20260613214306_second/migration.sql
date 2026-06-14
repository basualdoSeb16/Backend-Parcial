/*
  Warnings:

  - Added the required column `price` to the `book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` ADD COLUMN `price` DOUBLE NOT NULL,
    MODIFY `publishedYear` VARCHAR(191) NOT NULL;
