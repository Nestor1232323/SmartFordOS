import { createReadStream, existsSync } from "fs";
import path from "path";

export const config = { runtime: "nodejs" };

export default function handler(req, res) {
  try {
    const { v } = req.query;
    if (!v) return res.status(400).json({ error: "Version not specified" });

    const versionsDir = path.join(process.cwd(), "public", "versions");
    const fileName = fsFileName(v);
    const filePath = path.join(versionsDir, fileName);

    if (!existsSync(filePath)) return res.status(404).json({ error: "File not found" });

    // Отдаём файл
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/vnd.ms-powerpoint"); // pptm
    const stream = createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    console.error("FILES DOWNLOAD ERROR:", err);
    res.status(500).json({ error: "Failed to download file" });
  }
}

// Превращаем v в реальное имя файла
function fsFileName(v) {
  // b1.05 → smosb1.05.pptm
  // 1.0 → smos1.0.pptm
  return `smos${v}.pptm`;
}
