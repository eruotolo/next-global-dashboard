/*
  Warnings:

  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PageRole" DROP CONSTRAINT "PageRole_pageId_fkey";

-- DropForeignKey
ALTER TABLE "PageRole" DROP CONSTRAINT "PageRole_roleId_fkey";

-- DropTable
DROP TABLE "Page";

-- DropTable
DROP TABLE "PageRole";
