-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_articleId_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
