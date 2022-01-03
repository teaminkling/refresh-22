/**
 * An artist.
 */
import Joi from "joi";

export default interface Artist {
  /**
   * The ID of this user.
   */
  discordId: string;

  /**
   * The name of the artist as a trimmed UTF-8 string.
   *
   * Can be edited by the user at any time (within the rate limit, of course). It won't appear
   * for all users until the frontend syncs with the backend.
   */
  name: string;

  /**
   * The URL of the profile image.
   *
   * Should exclusively be fetched from Discord.
   */
  thumbnailUrl: string;

  /**
   * All of the socials for the artist in a deterministic order.
   *
   * These are listed as URLs, not as usernames. The frontend will need to some parsing to
   * recognise accepted providers.
   */
  socials: string[];

  /**
   * The number of works the artist has produced.
   *
   * The frontend cannot override this value; only the backend can set it.
   */
  worksCount?: number;
}

// Note: I can't find specifications for the length of a snowflake, so we limit it to 64 chars.

export const ARTIST_SCHEMA = Joi.object(
  {
    discordId: Joi.string().alphanum().max(64).required(),
    name: Joi.string().min(3).max(128).required(),
    thumbnailUrl: Joi.string().uri().required(),
    socials: Joi.array().items(Joi.string().uri()).required(),
    worksCount: Joi.number().integer().optional(),
  },
);
