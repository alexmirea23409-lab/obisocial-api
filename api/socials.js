export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Prevent Vercel caching old responses
  res.setHeader("Cache-Control", "no-store, max-age=0");

  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = "UCdzf46Ahuj5-qk2c6D7YKJA";

  if (!API_KEY) {
    return res.status(500).json({
      error: "Missing YouTube API key"
    });
  }

  try {
    const youtubeResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
    );

    const youtubeData = await youtubeResponse.json();

    if (!youtubeData.items || youtubeData.items.length === 0) {
      return res.status(404).json({
        error: "YouTube channel not found"
      });
    }

    const subscribers = Number(
      youtubeData.items[0].statistics.subscriberCount
    );

    return res.status(200).json({
      youtube: subscribers
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch social data"
    });
  }
}
