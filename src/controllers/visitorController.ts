import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }
  return req.socket.remoteAddress || "127.0.0.1";
}

export async function trackPostView(req: Request, res: Response): Promise<void> {
  try {
    const postId = Number(req.params.postId);
    const { category = "Blog" } = req.body;
    const ip = getClientIp(req);

    const existing = await prisma.visitor.findFirst({
      where: {
        postId,
        point: category,
        visitorIp: ip,
      },
    });

    if (!existing) {
      await prisma.visitor.create({
        data: {
          postId,
          point: category,
          visitorIp: ip,
        },
      });
    }

    const count = await prisma.visitor.count({
      where: {
        postId,
        point: category,
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: { views: count },
    });

    res.json({ success: true, views: count });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function trackChapterView(req: Request, res: Response): Promise<void> {
  try {
    const chapterId = Number(req.params.chapterId);
    const ip = getClientIp(req);

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: { storyId: true },
    });

    if (!chapter) {
      res.status(404).json({ success: false, error: "Chapter not found." });
      return;
    }

    const existing = await prisma.visitor.findFirst({
      where: {
        postId: chapterId,
        point: "Story",
        visitorIp: ip,
      },
    });

    if (!existing) {
      await prisma.visitor.create({
        data: {
          postId: chapterId,
          point: "Story",
          visitorIp: ip,
        },
      });
    }

    const count = await prisma.visitor.count({
      where: {
        postId: chapterId,
        point: "Story",
      },
    });

    await prisma.chapter.update({
      where: { id: chapterId },
      data: { views: count },
    });

    const aggregate = await prisma.chapter.aggregate({
      where: { storyId: chapter.storyId },
      _sum: { views: true },
    });

    const totalViews = aggregate._sum.views || 0;
    await prisma.story.update({
      where: { id: chapter.storyId },
      data: { views: totalViews },
    });

    res.json({ success: true, chapterViews: count, storyViews: totalViews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
