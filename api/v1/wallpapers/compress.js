export const config = {
  runtime: "nodejs"
};

import sharp from "sharp";
import fetch from "node-fetch";

const WALLPAPERS = {
  classic: "https://smartford.vercel.app/wallpapers/classic/img2.png",
  winter: "https://smartford.vercel.app/wallpapers/winter/img2.png"
};

export default async function handler(req, res) {
  try {
    const { size = "144", wallpaper } = req.query;

    if (!wallpaper || !WALLPAPERS[wallpaper]) {
      return res.status(400).json({ error: "Invalid wallpaper" });
    }

    const width = Math.min(Number(size), 512); // защита от abuse

    // 1️⃣ грузим картинку в память
    const response = await fetch(WALLPAPERS[wallpaper]);
    if (!response.ok) throw new Error("Image fetch failed");

    const buffer = Buffer.from(await response.arrayBuffer());

    // 2️⃣ сжимаем
    const output = await sharp(buffer)
      .resize(width)
      .png({ compressionLevel: 8 })
      .toBuffer();

    // 3️⃣ отдаём как изображение
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");

    res.status(200).send(output);
  } catch (err) {
    console.error("COMPRESS ERROR:", err);
    res.status(500).json({ error: "Image compression failed" });
  }
}
