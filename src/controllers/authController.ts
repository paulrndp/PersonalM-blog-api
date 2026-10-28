import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ success: false, error: "Username and password are required." });
      return;
    }

    const account = await prisma.account.findUnique({
      where: { username },
    });

    if (!account) {
      res.status(401).json({ success: false, error: "Invalid username or password." });
      return;
    }

    let isValid = false;
    if (account.password.startsWith("$2a$") || account.password.startsWith("$2b$")) {
      isValid = await bcrypt.compare(password, account.password);
    } else {
      isValid = account.password === password;
      if (isValid) {
        const hashed = await bcrypt.hash(password, 10);
        await prisma.account.update({
          where: { id: account.id },
          data: { password: hashed },
        });
      }
    }

    if (!isValid) {
      res.status(401).json({ success: false, error: "Invalid username or password." });
      return;
    }

    const secret = process.env.JWT_SECRET || "default_jwt_secret_key_32_characters";
    const token = jwt.sign(
      { id: account.id, username: account.username },
      secret,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: account.id,
        username: account.username,
        firstname: account.firstname,
        lastname: account.lastname,
        desc: account.desc,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const account = await prisma.account.findFirst({
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        desc: true,
        createdAt: true,
      },
    });

    if (!account) {
      res.status(404).json({ success: false, error: "Account not found." });
      return;
    }

    res.json({ success: true, data: account });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { firstname, lastname, username, desc, password } = req.body;
    const file = req.file;

    const dataToUpdate: any = {};
    if (firstname) dataToUpdate.firstname = firstname;
    if (lastname) dataToUpdate.lastname = lastname;
    if (username) dataToUpdate.username = username;
    if (desc !== undefined) dataToUpdate.desc = desc;

    if (password && password.trim().length > 0) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    if (file && file.buffer) {
      dataToUpdate.profile = file.buffer as unknown as Uint8Array<ArrayBuffer>;
    }

    const updated = await prisma.account.update({
      where: { id: req.user?.id },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        firstname: true,
        lastname: true,
        desc: true,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getAvatar(_req: Request, res: Response): Promise<void> {
  try {
    const account = await prisma.account.findFirst({
      select: { profile: true, firstname: true, lastname: true },
    });

    if (account?.profile && account.profile.length > 0) {
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(account.profile);
      return;
    }

    const initials = `${account?.firstname?.[0] || "H"}${account?.lastname?.[0] || "M"}`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="100%" height="100%" fill="#e2e8f0"/>
      <circle cx="100" cy="100" r="90" fill="#cbd5e1"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-family="serif" font-weight="bold" font-size="52" fill="#334155">
        ${initials}
      </text>
    </svg>`;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(svg);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
