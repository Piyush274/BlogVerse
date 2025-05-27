import { prisma } from "@/lib/prisma";

export const fetchArticleByQuery = async (searchText: string, skip: number, take: number) => {
  const [articles, total] = await prisma.$transaction([
    prisma.articles.findMany({
      where: {
        OR: [
          { title: { contains: searchText, mode: 'insensitive' } }, //capital small doesn't matter
          { category: { contains: searchText, mode: 'insensitive' } },
        ],
      },
      include: {
        author: {
          select: { name: true, imageUrl: true, email: true },
        },
      },
      skip: skip,
      take: take,
    }),
    prisma.articles.count({
      where: {
        OR: [
          { title: { contains: searchText, mode: 'insensitive' } },
          { category: { contains: searchText, mode: 'insensitive' } },
        ],
      },
    }),
  ]);

  return { articles, total };
};