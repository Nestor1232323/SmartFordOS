export const config = { runtime: "nodejs" };

const VERSIONS = {
  triadeos: {
    14: {
      product: "triade",
      version: "14",
      description: `Triade OS 14 - новейшая версия TOS с современным дизайном, многофункциональностью, многозадачностью, автономностью и безопасностью.\nПоддерживает все современные устройства.`,
      features: [
        "Современный дизайн",
        "Многофункциональность и многозадачность",
        "Отличная автономность и безопасность",
        "Огромный выбор приложений и устройств"
      ],
      url: "https://scratch.mit.edu/...",
      name: "Triade OS 14"
    },
    13: {
      product: "triade",
      version: "13",
      description: `Triade OS 13 - стабильная версия TOS с улучшенным дизайном и функционалом.\nПоддерживает большинство современных устройств.`,
      features: [
        "Улучшенный дизайн",
        "Стабильная многозадачность",
        "Безопасная и автономная система",
        "Широкий выбор приложений"
      ],
      url: "https://scratch.mit.edu/...",
      name: "Triade OS 13"
    }
    // можно добавить новые версии сюда
  }
};

export default async function handler(req, res) {
  try {
    const { os, version } = req.query;

    if (!os || !version) {
      return res.status(400).json({ error: "Missing 'os' or 'version' query parameter" });
    }

    const osData = VERSIONS[os.toLowerCase()];
    if (!osData) {
      return res.status(404).json({ error: `OS '${os}' not found` });
    }

    const versionData = osData[version];
    if (!versionData) {
      return res.status(404).json({ error: `Version '${version}' for OS '${os}' not found` });
    }

    res.status(200).json(versionData);
  } catch (err) {
    console.error("VERSIONS GET ERROR:", err);
    res.status(500).json({ error: "Failed to fetch version info" });
  }
}
