export default function handler(req, res) {
  res.status(200).json({
    version: "2.0",
    name: "SmartFord OS 2: Redesign",
    updatedAt: new Date().toISOString()
  });
}
