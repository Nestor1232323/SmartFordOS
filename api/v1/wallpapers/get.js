export default function handler(req, res) {
  const wallpapers = [
    {
      id: 1,
      title: "Классические",
      url: "https://smartford.vercel.app/wallpapers/classic/img1.png",
      blur_url: "https://smartford.vercel.app/wallpapers/classic/img2.png",
      preview_url:
        "https://smartford.vercel.app/api/v1/wallpapers/compress?size=144&wallpaper=classic"
    },
    {
      id: 2,
      title: "Зима",
      url: "https://smartford.vercel.app/wallpapers/winter/img1.png",
      blur_url: "https://smartford.vercel.app/wallpapers/winter/img2.png",
      preview_url:
        "https://smartford.vercel.app/api/v1/wallpapers/compress?size=144&wallpaper=winter"
    }
    // можно добавить больше элементов
  ];

  const { count } = req.query;
  const countNum = count ? parseInt(count) : wallpapers.length;

  res.status(200).json({
    count: Math.min(countNum, wallpapers.length),
    data: wallpapers.slice(0, countNum)
  });
}
