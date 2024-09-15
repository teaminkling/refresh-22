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
   * All the socials for the artist in a deterministic order.
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
