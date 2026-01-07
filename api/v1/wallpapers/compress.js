export const config = {
  runtime: "nodejs"
};

import sharp from "sharp";

const WALLPAPERS = {
  classic: "https://smartford.vercel.app/wallpapers/classic/img1.png",
  winter: "https://smartford.vercel.app/wallpapers/winter/img1.png",
  default: "https://smartford.vercel.app/wallpapers/default/img1.png"
};

export default async function handler(req, res) {
  try {
    const { size = "144", wallpaper } = req.query;

    if (!wallpaper || !WALLPAPERS[wallpaper]) {
      return res.status(400).json({ error: "Invalid wallpaper" });
    }

    const width = Math.min(parseInt(size, 10), 512);
    if (isNaN(width) || width <= 0) {
      return res.status(400).json({ error: "Invalid size" });
    }

    // 1️⃣ fetch ВСТРОЕННЫЙ (Node 18+ на Vercel)
    const response = await fetch(WALLPAPERS[wallpaper]);
    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // 2️⃣ сжимаем в памяти
    const output = await sharp(buffer)
      .resize(width)
      .png({ compressionLevel: 8 })
      .toBuffer();

    // 3️⃣ отдаём картинку
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");

    res.status(200).send(output);
  } catch (err) {
    console.error("COMPRESS ERROR:", err);
    res.status(500).json({ error: "Image compression failed" });
  }
}
