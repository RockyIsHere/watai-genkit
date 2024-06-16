"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTwitterVideoUrl = void 0;
const { twitterdown } = require("nayan-media-downloader");
async function getTwitterVideoUrl(twitterLink) {
    try {
        let data = await twitterdown(twitterLink);
        if (data) {
            return data.data["SD"];
        }
        else {
            console.error("Video URL not found in the Facebook page.");
            return null;
        }
    }
    catch (error) {
        console.error("Error fetching Facebook page:", error);
        return null;
    }
}
exports.getTwitterVideoUrl = getTwitterVideoUrl;
//# sourceMappingURL=twitter.video.download.js.map