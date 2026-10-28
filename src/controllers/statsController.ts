import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export async function getOverviewStats(_req: Request, res: Response): Promise<void> {
  try {
    const [
      storiesCount,
      blogCount,
      randomCount,
      draftsCount,
      totalStoryReads,
    ] = await Promise.all([
      prisma.story.count(),
      prisma.post.count({
        where: {
          status: "published",
          OR: [{ category: "Blog" }, { category: "Both" }],
        },
      }),
      prisma.post.count({
        where: {
          status: "published",
          OR: [{ category: "Random" }, { category: "Both" }],
        },
      }),
      prisma.post.count({
        where: { status: "draft" },
      }),
      prisma.story.aggregate({
        _sum: { views: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        stories: storiesCount,
        blogPosts: blogCount,
        randomThoughts: randomCount,
        drafts: draftsCount,
        totalStoryReads: totalStoryReads._sum.views || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
