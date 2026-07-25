export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

  const YOUTUBE_CHANNEL_ID = "UCdzf46Ahuj5-qk2c6D7YKJA";
  const TWITCH_USERNAME = "obithelegend1";

  try {
    // ---------- YouTube ----------
    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );
    const ytData = await ytRes.json();

    const youtube = ytData.items?.length
      ? Number(ytData.items[0].statistics.subscriberCount)
      : null;

    // ---------- Twitch Auth ----------
    const tokenRes = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
      {
        method: "POST",
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // ---------- Get Twitch User ID ----------
    const userRes = await fetch(
      `https://api.twitch.tv/helix/users?login=${TWITCH_USERNAME}`,
      {
        headers: {
          "Client-ID": TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userData = await userRes.json();

    if (!userData.data?.length) {
      return res.status(404).json({
        error: "Twitch user not found",
      });
    }

    const userId = userData.data[0].id;

    // ---------- Get Follower Count ----------
    const followersRes = await fetch(
      `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`,
      {
        headers: {
          "Client-ID": TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const followersData = await followersRes.json();

    return res.status(200).json({
      youtube,
      twitch: followersData.total,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}
