/**
 * An artist.
 */
import {KeysEnum} from "../utils/typescript";

export default interface Artist {
  /**
   * The ID of this user.
   */
  discordId: string;

  /**
   * The name of the artist as a trimmed UTF-8 string.
   */
  name: string;

  /**
   * The works of this artist by ID.
   *
   * Further lookup is required for more details.
   */
  workIds: string[];

  /**
   * All of the socials for the artist in a deterministic order.
   *
   * These are listed as URLs, not as usernames. The frontend will need to some parsing to
   * recognise accepted providers.
   */
  socials: string[];
}

/**
 * The keys of {@link Artist}.
 */
export const ArtistKeys: KeysEnum<Artist> = {
  discordId: true,
  name: true,
  workIds: true,
  socials: true,
};
