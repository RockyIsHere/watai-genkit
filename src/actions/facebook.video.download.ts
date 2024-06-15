
const { ndown } = require("nayan-media-downloader");


export async function getFacebookVideoUrl(
  facebookLink: string
): Promise<string | null> {
  try {
    let data = await ndown(facebookLink);
    console.log(data);
    if (data) {
      return data.data[1].url;
    } else {
      console.error("Video URL not found in the Facebook page.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Facebook page:", error);
    return null;
  }
}
