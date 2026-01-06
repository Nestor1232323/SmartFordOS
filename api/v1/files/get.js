export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  try {
    const githubApi = "https://api.github.com/repos/Nestor1232323/SmartFordOS/contents/download?ref=main";

    const response = await fetch(githubApi, {
      headers: { "Accept": "application/vnd.github.v3+json" }
    });

    if (!response.ok) throw new Error("Failed to fetch from GitHub");

    const files = await response.json();

    const result = files
      .filter(f => f.name.endsWith(".pptm"))
      .map(f => {
        const match = f.name.match(/smos(b?\d+\.\d+)\.pptm/i);
        if (!match) return null;

        const versionCode = match[1];
        const isBeta = versionCode.startsWith("b");
        const versionName = isBeta ? `Beta ${versionCode.slice(1)}` : versionCode;
        const name = isBeta ? "Smartford OS Beta" : "Smartford OS";

        return {
          version: versionName,
          name,
          url: `https://raw.githubusercontent.com/Nestor1232323/SmartFordOS/main/download/${f.name}`
        };
      })
      .filter(Boolean);

    res.status(200).json(result);
  } catch (err) {
    console.error("FILES GET ERROR:", err);
    res.status(500).json({ error: "Failed to list versions" });
  }
}
