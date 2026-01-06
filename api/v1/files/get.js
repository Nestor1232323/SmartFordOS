export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  try {
    const { count, placeholder } = req.query;
    const countNum = count ? parseInt(count) : null;
    const usePlaceholder = placeholder === "true";

    // ссылки на иконки
    const ICON_OLD =
      "https://raw.githubusercontent.com/Nestor1232323/SmartFordOS/main/img/icons/smosold.png";
    const ICON_NEW =
      "https://raw.githubusercontent.com/Nestor1232323/SmartFordOS/main/img/icons/smosnew.png";

    // если placeholders
    if (usePlaceholder) {
      const placeholderCount = countNum || 5;
      const placeholders = Array.from({ length: placeholderCount }, (_, i) => ({
        version: "0.0",
        name: `Smartford OS Placeholder ${i + 1}`,
        url: "#",
        icon: i % 2 === 0 ? ICON_OLD : ICON_NEW
      }));
      return res.status(200).json(placeholders);
    }

    // обычный fetch GitHub
    const githubApi =
      "https://api.github.com/repos/Nestor1232323/SmartFordOS/contents/download?ref=main";

    const response = await fetch(githubApi, {
      headers: { Accept: "application/vnd.github.v3+json" }
    });

    if (!response.ok) throw new Error("Failed to fetch from GitHub");

    const files = await response.json();

    let result = files
      .filter(f => f.name.endsWith(".pptm"))
      .map(f => {
        const match = f.name.match(/smos(b?\d+\.\d+)\.pptm/i);
        if (!match) return null;

        const versionCode = match[1];
        const isBeta = versionCode.startsWith("b");
        const versionNumber = isBeta ? versionCode.slice(1) : versionCode;

        const name = isBeta
          ? `Smartford OS Beta ${versionNumber}`
          : `Smartford OS ${versionNumber}`;

        // выбор иконки
        const icon =
          f.name.toLowerCase() === "smos2.0.pptm"
            ? ICON_NEW
            : ICON_OLD;

        return {
          version: versionNumber,
          name,
          url: `https://raw.githubusercontent.com/Nestor1232323/SmartFordOS/main/download/${f.name}`,
          icon
        };
      })
      .filter(Boolean);

    // оставляем только последние N, если count указан
    if (countNum) {
      result = result.slice(-countNum);
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("FILES GET ERROR:", err);
    res.status(500).json({ error: "Failed to list versions" });
  }
}
