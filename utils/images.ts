/**
 * Utils related to images.
 */
import {getUuid5String} from "../data/utils/uuid";

interface ThumbnailPair {
  smallThumbnailUrl: string;
  hiResThumbnailUrl: string;
}

/**
 * Derive a thumbnail from the provided URL.
 *
 * This function will always return a thumbnail no matter what, even if one isn't found on the
 * backend.
 *
 * The uploaded files either have UUID4 filenames or they don't. If they do, then that's just a
 * matter of adding `/thumbs/hi-dpi` etc to the URL.
 *
 * If they don't, then the URL is used as a UUIDv5 `string` after derivation. The thumbnail type
 * is always a PNG.
 *
 * There is one exception: if the file is a straight-up MP3. In those cases, they appear as the
 * default thumbnail.
 *
 * @param {string} url the url
 * @param {string} identifier the work's artist ID
 * @returns {ThumbnailPair} the output
 */
export const deriveThumbnails = (url: string, identifier: string): ThumbnailPair => {
  let parsedUrl = new URL(url);

  const isInternal: boolean = url.includes("refresh-cdn.fiveclawd.com");
  if (isInternal && url.includes(".mp3")) {
    return {
      smallThumbnailUrl: "/placeholders/audio_submission.png",
      hiResThumbnailUrl: "/placeholders/audio_submission.png",
    };
  } else if (!isInternal) {
    const filename = getUuid5String(url) + ".png";

    // Can't be arsed to do this next bit properly. Yet.

    const _bucketPath = (
      "inkling-refresh" + (["development", "staging"].includes(process.env.NODE_ENV) ? "-dev" : "")
    );

    // Note that there is no identifier here, just a filename.

    parsedUrl = new URL(
      `https://refresh-cdn.fiveclawd.com/file/${_bucketPath}/ugc/${identifier}/${filename}`
    );
  }

  const smallPath = parsedUrl.pathname.replaceAll(
    "/ugc/", "/ugc/thumbs/reg-dpi/",
  );

  const hiDpiPath = parsedUrl.pathname.replaceAll(
    "/ugc/", "/ugc/thumbs/hi-dpi/",
  );

  const thumbnailUrl = isInternal ? parsedUrl : new URL("https://refresh-cdn.fiveclawd.com");

  return {
    smallThumbnailUrl: "https://" + thumbnailUrl.hostname + smallPath,
    hiResThumbnailUrl: "https://" + thumbnailUrl.hostname + hiDpiPath,
  };
};
