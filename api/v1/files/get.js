import { readdir } from "fs/promises";
import path from "path";

export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  try {
    const versionsDir = path.join(process.cwd(), "public", "versions");
    const files = await readdir(versionsDir);

    const result = files
      .filter(f => f.endsWith(".pptm"))
      .map(f => {
        // Разбираем название файла
        // smosb1.05.pptm → версия: b1.05, name: Smartford OS Beta
        const match = f.match(/smos(b?\d+\.\d+)\.pptm/i);
        if (!match) return null;

        const versionCode = match[1];
        const isBeta = versionCode.startsWith("b");
        const versionName = isBeta
          ? `Beta ${versionCode.slice(1)}`
          : versionCode;
        const name = isBeta ? "Smartford OS Beta" : "Smartford OS";

        return {
          version: versionName,
          name,
          url: `https://smartford.vercel.app/api/v1/files/download?v=${versionCode}`
        };
      })
      .filter(Boolean);

    res.status(200).json(result);
  } catch (err) {
    console.error("FILES GET ERROR:", err);
    res.status(500).json({ error: "Failed to list versions" });
  }
}
