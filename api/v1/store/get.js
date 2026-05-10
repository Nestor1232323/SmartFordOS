export default function handler(req, res) {
  // Параметры запроса (можно расширить, например, для фильтрации)
  const { limit = 20 } = req.query;
  const maxItems = Math.min(parseInt(limit, 10), 50);

  const STORE_DATA = {
    apps: [
      {
        id: "com.smartfordos.example.myapp",
        title: "Пример приложения",
        version: "1.0.0",
        author: "SmartFord Company",
        description: "Демонстрационное приложение для SmartFord OS, показывающее работу с файловой системой и интерфейсом.",
        img: "/apps/com.smartfordos.example.myapp/icon.png",
        download_url: "/apps/com.smartfordos.example.myapp/example.smapp",
        minimal_version_of_smos: "3.0",
        permissions: ["storage", "network"],
        category: "Инструменты"
      }
    ],
    games: [] // Пока пусто, как вы и просили
  };

  // Логика обработки и формирования ответа
  const formatItem = (item) => ({
    ...item,
  });

  const responseData = {
    total_apps: STORE_DATA.apps.length,
    total_games: STORE_DATA.games.length,
    data: {
      apps: STORE_DATA.apps.slice(0, maxItems).map(formatItem),
      games: STORE_DATA.games.slice(0, maxItems).map(formatItem)
    }
  };

  res.status(200).json(responseData);
}