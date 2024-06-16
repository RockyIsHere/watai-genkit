"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const facebook_video_download_1 = require("../actions/facebook.video.download");
const twitter_video_download_1 = require("../actions/twitter.video.download");
const router = express_1.default.Router();
router.post("/facebook-download", async (req, res) => {
    const { link } = req.body;
    if (!link) {
        return res.status(400).json({ error: "Facebook link is required" });
    }
    try {
        const videoUrl = await (0, facebook_video_download_1.getFacebookVideoUrl)(link);
        if (videoUrl) {
            return res.status(200).json({ downloadLink: videoUrl });
        }
        else {
            return res.status(500).json({ error: "Failed to retrieve video URL" });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "An error occurred while downloading the video" });
    }
});
router.post("/twitter-download", async (req, res) => {
    const { link } = req.body;
    if (!link) {
        return res.status(400).json({ error: "Facebook link is required" });
    }
    try {
        const videoUrl = await (0, twitter_video_download_1.getTwitterVideoUrl)(link);
        if (videoUrl) {
            return res.status(200).json({ downloadLink: videoUrl });
        }
        else {
            return res.status(500).json({ error: "Failed to retrieve video URL" });
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "An error occurred while downloading the video" });
    }
});
exports.default = router;
//# sourceMappingURL=media.download.js.map