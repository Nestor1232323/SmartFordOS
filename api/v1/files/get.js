export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  try {
    const githubApi =
      "https://api.github.com/repos/Nestor1232323/SmartFordOS/contents/download?ref=main";

    const response = await fetch(githubApi, {
      headers: { Accept: "application/vnd.github.v3+json" }
    });

    if (!response.ok) throw new Error("Failed to fetch from GitHub");

    const files = await response.json();

    // ссылки на иконки
    const ICON_OLD =
      "https://raw.githubusercontent.com/Nestor1232323/SmartFordOS/main/img/icons/smosold.png";
    const ICON_NEW =
      "https://raw.githubusercontent.com/Nestor1232323/SmartFordOS/main/img/icons/smosnew.png";

    const result = files
      .filter(f => f.name.endsWith(".pptm"))
      .map(f => {
        const match = f.name.match(/smos(b?\d+\.\d+)\.pptm/i);
        if (!match) return null;

        const versionCode = match[1];
        const isBeta = versionCode.startsWith("b");

        const versionName = isBeta
          ? `Beta ${versionCode.slice(1)}`
          : versionCode;

        const name = isBeta ? "Smartford OS Beta" : "Smartford OS";

        // выбор иконки
        const icon =
          f.name.toLowerCase() === "smos2.0.pptm"
            ? ICON_NEW
            : ICON_OLD;

        return {
          version: versionName,
          name,
          url: `https://raw.githubusercontent.com/Nestor1232323/SmartFordOS/main/download/${f.name}`,
          icon
        };
      })
      .filter(Boolean);

    res.status(200).json(result);
  } catch (err) {
    console.error("FILES GET ERROR:", err);
    res.status(500).json({ error: "Failed to list versions" });
  }
}
