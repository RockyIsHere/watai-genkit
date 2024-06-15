"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacebookVideoUrl = void 0;
const { ndown } = require("nayan-media-downloader");
async function getFacebookVideoUrl(facebookLink) {
    try {
        let data = await ndown(facebookLink);
        console.log(data);
        if (data) {
            return data.data[1].url;
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
exports.getFacebookVideoUrl = getFacebookVideoUrl;
//# sourceMappingURL=facebook.video.download.js.map