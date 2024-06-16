import express, { Request, Response } from "express";
import { getFacebookVideoUrl } from "../actions/facebook.video.download";
import { getTwitterVideoUrl } from "../actions/twitter.video.download";

const router = express.Router();

router.post("/facebook-download", async (req: Request, res: Response) => {
  const { link } = req.body;

  if (!link) {
    return res.status(400).json({ error: "Facebook link is required" });
  }

  try {
    const videoUrl = await getFacebookVideoUrl(link);
    if (videoUrl) {
      return res.status(200).json({ downloadLink: videoUrl });
    } else {
      return res.status(500).json({ error: "Failed to retrieve video URL" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while downloading the video" });
  }
});

router.post("/twitter-download", async (req: Request, res: Response) => {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ error: "Facebook link is required" });
  }
  try {
    const videoUrl = await getTwitterVideoUrl(link);
    if (videoUrl) {
      return res.status(200).json({ downloadLink: videoUrl });
    } else {
      return res.status(500).json({ error: "Failed to retrieve video URL" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while downloading the video" });
  }
});

export default router;
