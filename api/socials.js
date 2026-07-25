export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = "UCdzf46Ahuj5-qk2c6D7YKJA";

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
    );

    const data = await response.json();

    if (!data.items || !data.items.length) {
      return res.status(404).json({
        error: "Channel not found",
      });
    }

    const subscribers = Number(
      data.items[0].statistics.subscriberCount
    );

    return res.status(200).json({
      youtube: subscribers,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
