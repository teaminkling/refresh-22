import {AwsClient} from "aws4fetch";
import {ValidationError} from "joi";
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
): Promise<string> => {
  const _contentPathParts = contentUrl.pathname.split("/");
  const filename = _contentPathParts[_contentPathParts.length - 1];

  const smallThumbnailUrl = (
    `${env.TWIC_URL}${contentUrl.pathname}?twic=v1/cover=1024x720&focus=auto`
  );

  const hiDpiThumbnailUrl = (
    `${env.TWIC_URL}${contentUrl.pathname}?twic=v1/cover=2048x1440&focus=auto`
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

  return hiDpiUploadUrl.toString();
};
