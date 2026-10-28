import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export async function getStories(_req: Request, res: Response): Promise<void> {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { id: "desc" },
      include: {
        chapters: {
          select: { id: true, title: true, views: true, createdAt: true },
          orderBy: { id: "asc" },
        },
      },
    });

    res.json({ success: true, data: stories });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getStoryById(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid story ID." });
      return;
    }

    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        chapters: {
          orderBy: { id: "asc" },
        },
      },
    });

    if (!story) {
      res.status(404).json({ success: false, error: "Story not found." });
      return;
    }

    res.json({ success: true, data: story });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getChapterById(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid chapter ID." });
      return;
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id },
      include: {
        story: {
          select: { id: true, title: true },
        },
      },
    });

    if (!chapter) {
      res.status(404).json({ success: false, error: "Chapter not found." });
      return;
    }

    // Get sibling chapters for navigation
    const allChapters = await prisma.chapter.findMany({
      where: { storyId: chapter.storyId },
      orderBy: { id: "asc" },
      select: { id: true, title: true },
    });

    const currentIndex = allChapters.findIndex((c) => c.id === id);
    const prev = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
    const next =
      currentIndex >= 0 && currentIndex < allChapters.length - 1
        ? allChapters[currentIndex + 1]
        : null;

    res.json({
      success: true,
      data: {
        chapter,
        story: chapter.story,
        prev,
        next,
        allChapters,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getStoryCover(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const story = await prisma.story.findUnique({
      where: { id },
      select: { cover: true, title: true },
    });

    if (story?.cover && story.cover.length > 0) {
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(story.cover);
      return;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f1f5f9;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-size="24" fill="#475569">
        ${story?.title ? story.title.slice(0, 30) : "Hannah Montemayor"}
      </text>
      <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#94a3b8">
        Novel &amp; Stories
      </text>
    </svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(svg);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createStory(req: Request, res: Response): Promise<void> {
  try {
    const { title, desc, tags, genre } = req.body;
    const file = req.file;

    if (!title || !desc) {
      res.status(400).json({ success: false, error: "Title and description are required." });
      return;
    }

    const newStory = await prisma.story.create({
      data: {
        title,
        desc,
        tags: tags || null,
        genre: genre || null,
        cover: file?.buffer ? (file.buffer as unknown as Uint8Array<ArrayBuffer>) : null,
        views: 0,
        totalChapters: 0,
      },
    });

    res.status(201).json({ success: true, data: newStory });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateStory(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { title, desc, tags, genre } = req.body;
    const file = req.file;

    const dataToUpdate: any = {};
    if (title) dataToUpdate.title = title;
    if (desc) dataToUpdate.desc = desc;
    if (tags !== undefined) dataToUpdate.tags = tags;
    if (genre !== undefined) dataToUpdate.genre = genre;
    if (file?.buffer) dataToUpdate.cover = file.buffer as unknown as Uint8Array<ArrayBuffer>;

    const updated = await prisma.story.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteStory(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    await prisma.story.delete({
      where: { id },
    });

    res.json({ success: true, message: "Story deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createChapter(req: Request, res: Response): Promise<void> {
  try {
    const storyId = Number(req.params.storyId);
    const { title, content } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: "Chapter title is required." });
      return;
    }

    const chapter = await prisma.chapter.create({
      data: {
        storyId,
        title,
        content: content || "",
        views: 0,
      },
    });

    const totalChapters = await prisma.chapter.count({
      where: { storyId },
    });

    await prisma.story.update({
      where: { id: storyId },
      data: { totalChapters },
    });

    res.status(201).json({ success: true, data: chapter });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateChapter(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    const chapter = await prisma.chapter.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    res.json({ success: true, data: chapter });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteChapter(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const chapter = await prisma.chapter.findUnique({
      where: { id },
      select: { storyId: true },
    });

    if (!chapter) {
      res.status(404).json({ success: false, error: "Chapter not found." });
      return;
    }

    await prisma.chapter.delete({
      where: { id },
    });

    const totalChapters = await prisma.chapter.count({
      where: { storyId: chapter.storyId },
    });

    await prisma.story.update({
      where: { id: chapter.storyId },
      data: { totalChapters },
    });

    res.json({ success: true, message: "Chapter deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
