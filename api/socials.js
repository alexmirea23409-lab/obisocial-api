export default async function handler(req, res) {

  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = "UCdzf46Ahuj5-qk2c6D7YKJA";

  try {

    // Get the channel ID from the handle
    const search = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(CHANNEL_HANDLE)}&key=${API_KEY}`
    );

    const searchData = await search.json();

    const channelId = searchData.items?.[0]?.snippet?.channelId;

    if (!channelId) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Get subscriber count
    const stats = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`
    );

    const statsData = await stats.json();

    const subscribers =
      statsData.items?.[0]?.statistics?.subscriberCount || 0;

    res.status(200).json({
      youtube: Number(subscribers)
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

}
