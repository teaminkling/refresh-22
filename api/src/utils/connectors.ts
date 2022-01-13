import {AwsClient} from "aws4fetch";
import {load} from "cheerio";
import {ValidationError} from "joi";
import {getUuid5String} from "../../../data/utils/uuid";
import Environment from "../types/environment";

/**
 * Utils related to third party connections.
 */

/**
 * Upload the given content URL's thumbnails to a set of predictable URLs.
 *
 * @param {Environment} env the environment
 * @param {URL} contentUrl the content URL
 * @param {string} identifier the user's identifier
 * @returns {Promise<string>} the hi-DPI URL
 */
export const uploadThumbnails = async (
  env: Environment, contentUrl: URL, identifier: string,
): Promise<string[]> => {
  const _contentPathParts = contentUrl.pathname.split("/");
  const filename = _contentPathParts[_contentPathParts.length - 1];

  const smallThumbnailUrl = (
    `${env.TWIC_URL}${contentUrl.pathname}?twic=v1/cover=1024x720&focus=auto&truecolor`
  );

  const hiDpiThumbnailUrl = (
    `${env.TWIC_URL}${contentUrl.pathname}?twic=v1/cover=2048x1440&focus=auto&truecolor`
  );

  // Perform the actual fetches.

  const smallThumbnail: Response = await fetch(smallThumbnailUrl);
  const hiDpiThumbnail: Response = await fetch(hiDpiThumbnailUrl);

  if (!smallThumbnail.ok || !hiDpiThumbnail.ok) {
    throw new ValidationError(
      "Couldn't generate thumbnails for the file.",
      null,
      [],
    );
  }

  const smallThumbnailFile: Blob = await smallThumbnail.blob();
  const hiDpiThumbnailFile: Blob = await hiDpiThumbnail.blob();

  // Perform the uploads.

  const aws: AwsClient = new AwsClient({
    "accessKeyId": env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": env.AWS_SECRET_ACCESS_KEY,
    "region": env.AWS_DEFAULT_REGION,
  });

  const smallUploadUrl = new URL(
    `https://${env.AWS_S3_BUCKET}/ugc/thumbs/reg-dpi/${identifier}/${filename}`,
  );

  const hiDpiUploadUrl = new URL(
    `https://${env.AWS_S3_BUCKET}/ugc/thumbs/hi-dpi/${identifier}/${filename}`,
  );

  await aws.fetch(
    smallUploadUrl, {
      method: "PUT",
      headers: {"Content-Length": smallThumbnailFile.size.toString()},
      body: smallThumbnailFile,
      aws: {
        service: "s3", signQuery: true, allHeaders: true,
      },
    }
  );

  await aws.fetch(
    hiDpiUploadUrl, {
      method: "PUT",
      headers: {"Content-Length": hiDpiThumbnailFile.size.toString()},
      body: hiDpiThumbnailFile,
      aws: {
        service: "s3", signQuery: true, allHeaders: true,
      },
    }
  );

  // Allow explosion.

  const bucket: string = env.AWS_S3_BUCKET.split(".")[0];
  return [
    `https://${env.CDN_HOSTNAME}/file/${bucket}/ugc/thumbs/reg-dpi/${identifier}/${filename}`,
    `https://${env.CDN_HOSTNAME}/file/${bucket}/ugc/thumbs/hi-dpi/${identifier}/${filename}`
  ];
};

/**
 * Attempt to scrape a URL and return the meta image.
 *
 * @param {URL} url the URL to scrape
 * @returns {Promise<string | undefined>} if found, a social image
 */
export const scrapeThumbnail = async (url: URL): Promise<string | undefined> => {
  const _scrapedResponse: Response = await fetch(url.toString());

  const $ = load(await _scrapedResponse.text());

  const openGraphImage: string | undefined = $(
    "meta[property='og:image']"
  ).attr("content");

  const twitterImage: string | undefined = $(
    "meta[name='twitter:image']"
  ).attr("content");

  return openGraphImage || twitterImage;
};

/**
 * Upload a scraped thumbnail to S3.
 *
 * @param {Environment} env the environment
 * @param {string} identifier the identifier
 * @param {string} scrapedImageUrl the scraped image URL
 * @param {string} itemUrl the URL of the actual image
 * @returns {Promise<string[]>} the thumbnails
 */
export const uploadScrapedThumbnail = async (
  env: Environment, identifier: string, scrapedImageUrl: string, itemUrl: string,
) => {
  const _filenameParts = scrapedImageUrl.split(".");
  const extension: string = _filenameParts[_filenameParts.length - 1];

  const aws: AwsClient = new AwsClient({
    "accessKeyId": env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": env.AWS_SECRET_ACCESS_KEY,
    "region": env.AWS_DEFAULT_REGION,
  });

  const _thumbnailResponse: Response = await fetch(scrapedImageUrl);
  const thumbnailBlob: Blob = await _thumbnailResponse.blob();

  const stagingUrl = new URL(
    `https://${env.AWS_S3_BUCKET}/ugc/${getUuid5String(itemUrl)}.${extension}`,
  );

  await aws.fetch(
    stagingUrl, {
      method: "PUT",
      headers: {"Content-Length": thumbnailBlob.size.toString()},
      body: thumbnailBlob,
      aws: {
        service: "s3", signQuery: true, allHeaders: true,
      },
    }
  );

  // Explode here if necessary.

  const _bucketName: string = env.AWS_S3_BUCKET.split(".")[0];
  stagingUrl.pathname = stagingUrl.pathname.replaceAll(
    "/ugc/", `/file/${_bucketName}/ugc/`,
  );

  return await uploadThumbnails(env, stagingUrl, identifier);
};
