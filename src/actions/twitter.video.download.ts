const { twitterdown } = require("nayan-media-downloader");

export async function getTwitterVideoUrl(
  twitterLink: string
): Promise<string | null> {
  try {
    let data = await twitterdown(twitterLink);
    if (data) {
      return data.data["SD"];
    } else {
      console.error("Video URL not found in the Facebook page.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Facebook page:", error);
    return null;
  }
}
