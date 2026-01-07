export default function handler(req, res) {
  const wallpapers = [
    {
      id: 1,
      title: "Стандартные",
      url: "https://smartford.vercel.app/wallpapers/default/img1.png",
      blur_url: "https://smartford.vercel.app/wallpapers/default/img2.png",
      preview_url:
        "https://smartford.vercel.app/api/v1/wallpapers/compress?size=144&wallpaper=default"
    },
    {
      id: 2,
      title: "Зима",
      url: "https://smartford.vercel.app/wallpapers/winter/img1.png",
      blur_url: "https://smartford.vercel.app/wallpapers/winter/img2.png",
      preview_url:
        "https://smartford.vercel.app/api/v1/wallpapers/compress?size=144&wallpaper=winter"
    },
    {
      id: 3,
      title: "Классические (modern)",
      url: "https://smartford.vercel.app/wallpapers/classic/img1.png",
      blur_url: "https://smartford.vercel.app/wallpapers/classic/img2.png",
      preview_url:
        "https://smartford.vercel.app/api/v1/wallpapers/compress?size=144&wallpaper=classic"
    }
  ];

  const { count } = req.query;
  const countNum = count ? parseInt(count) : wallpapers.length;

  res.status(200).json({
    count: Math.min(countNum, wallpapers.length),
    data: wallpapers.slice(0, countNum)
  });
}
