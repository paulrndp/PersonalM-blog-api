import { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export async function getPosts(req: Request, res: Response): Promise<void> {
  try {
    const { category, status = "published", limit } = req.query;

    const whereClause: any = {};
    if (status !== "all") {
      whereClause.status = String(status);
    }

    if (category && category !== "All") {
      whereClause.OR = [{ category: String(category) }, { category: "Both" }];
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: { id: "desc" },
      take: limit ? Number(limit) : undefined,
    });

    res.json({ success: true, data: posts });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getPostById(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, error: "Invalid post ID." });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      res.status(404).json({ success: false, error: "Post not found." });
      return;
    }

    const next = await prisma.post.findFirst({
      where: {
        id: { gt: id },
        status: "published",
        ...(post.category === "Blog"
          ? { OR: [{ category: "Blog" }, { category: "Both" }] }
          : post.category === "Random"
          ? { OR: [{ category: "Random" }, { category: "Both" }] }
          : {}),
      },
      orderBy: { id: "asc" },
      select: { id: true, title: true },
    });

    const prev = await prisma.post.findFirst({
      where: {
        id: { lt: id },
        status: "published",
        ...(post.category === "Blog"
          ? { OR: [{ category: "Blog" }, { category: "Both" }] }
          : post.category === "Random"
          ? { OR: [{ category: "Random" }, { category: "Both" }] }
          : {}),
      },
      orderBy: { id: "desc" },
      select: { id: true, title: true },
    });

    res.json({
      success: true,
      data: {
        post,
        prev,
        next,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createPost(req: Request, res: Response): Promise<void> {
  try {
    const { title, content, category = "Blog", status = "published" } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: "Post title is required." });
      return;
    }

    const post = await prisma.post.create({
      data: {
        title,
        content: content || "",
        category,
        status,
        views: 0,
      },
    });

    res.status(201).json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updatePost(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { title, content, category, status } = req.body;

    const dataToUpdate: any = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (content !== undefined) dataToUpdate.content = content;
    if (category !== undefined) dataToUpdate.category = category;
    if (status !== undefined) dataToUpdate.status = status;

    const post = await prisma.post.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({ success: true, data: post });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function deletePost(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    await prisma.post.delete({
      where: { id },
    });

    res.json({ success: true, message: "Post deleted successfully." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
