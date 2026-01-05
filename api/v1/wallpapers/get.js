export default function handler(req, res) {
  const wallpapers = [
    {
      id: 1,
      title: "Классические",
      url: "https://smartford.vercel.app/wallpapers/classic/img1.png",
      blur_url: "https://smartford.vercel.app/wallpapers/classic/img2.png"
    },
    {
      id: 2,
      title: "Зима",
      url: "https://smartford.vercel.app/wallpapers/winter/img1.png",
      blur_url: "https://smartford.vercel.app/wallpapers/winter/img2.png"
    }
  ];

  res.status(200).json({
    count: wallpapers.length,
    data: wallpapers
  });
}
