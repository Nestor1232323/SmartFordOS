export const config = {
  runtime: "nodejs"
};

import sharp from "sharp";

export default async function handler(req, res) {
  try {
    const { size = "144", img } = req.query;

    if (!img) {
      return res.status(400).json({ error: "No image provided" });
    }

    const width = Math.min(parseInt(size, 10), 512);
    if (isNaN(width) || width <= 0) {
      return res.status(400).json({ error: "Invalid size" });
    }

    // Поддерживаем только новости (для безопасности)
    const BASE_URL = "https://smartford.vercel.app";
    const validPrefixes = ["/img/news/"];
    if (!validPrefixes.some(p => img.startsWith(p))) {
      return res.status(400).json({ error: "Invalid image path" });
    }

    // Полный URL к картинке
    const imageUrl = BASE_URL + img;

    // Загружаем картинку в память
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch image");

    const buffer = Buffer.from(await response.arrayBuffer());

    // Сжимаем
    const output = await sharp(buffer)
      .resize(width)
      .png({ compressionLevel: 8 })
      .toBuffer();

    // Отдаём как PNG
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.status(200).send(output);
  } catch (err) {
    console.error("NEWS COMPRESS ERROR:", err);
    res.status(500).json({ error: "Image compression failed" });
  }
}
