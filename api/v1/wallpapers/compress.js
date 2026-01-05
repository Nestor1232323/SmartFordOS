import sharp from "sharp";

const WALLPAPERS = {
  classic: "https://smartford.vercel.app/wallpapers/classic/img2.png",
  winter: "https://smartford.vercel.app/wallpapers/winter/img2.png"
};

export default async function handler(req, res) {
  try {
    const { size = 144, wallpaper } = req.query;

    if (!wallpaper || !WALLPAPERS[wallpaper]) {
      return res.status(400).json({ error: "Invalid wallpaper" });
    }

    // 1️⃣ Загружаем изображение в память
    const response = await fetch(WALLPAPERS[wallpaper]);
    const buffer = Buffer.from(await response.arrayBuffer());

    // 2️⃣ Сжимаем
    const image = await sharp(buffer)
      .resize(Number(size))
      .png({ quality: 60 })
      .toBuffer();

    // 3️⃣ Отдаём напрямую (без файловой системы)
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");

    res.status(200).send(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Compression failed" });
  }
}
