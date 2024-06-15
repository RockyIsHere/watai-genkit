"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFacebookVideoUrl = exports.downloadFacebookVideo = void 0;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const { ndown } = require("nayan-media-downloader");
async function downloadFacebookVideo(videoUrl, outputFilePath) {
  try {
    const response = await axios_1.default.get(videoUrl, {
      responseType: "arraybuffer",
    });
    fs.writeFileSync(outputFilePath, response.data);
    console.log(`Video saved to ${outputFilePath}`);
  } catch (error) {
    console.error("Error downloading video:", error);
    throw error;
  }
}
exports.downloadFacebookVideo = downloadFacebookVideo;
async function getFacebookVideoUrl(FacebookLink) {
  try {
    const response = await axios_1.default.get(FacebookLink);
    const html = response.data;
    let data = await ndown(FacebookLink);
    console.log(data);
    if (data) {
      return data.data[0].url;
    } else {
      console.error("Video URL not found in the Facebook page.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Facebook page:", error);
    return null;
  }
}
exports.getFacebookVideoUrl = getFacebookVideoUrl;
//# sourceMappingURL=insta.video.download.js.map
