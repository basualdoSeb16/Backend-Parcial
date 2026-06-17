/*
  Warnings:

  - You are about to alter the column `publishedYear` on the `book` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[title]` on the table `book` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `book` MODIFY `publishedYear` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `book_title_key` ON `book`(`title`);
