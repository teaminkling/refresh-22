import type { PageContextServer } from "vike/types";

import { fetchArtists } from "../../../utils/connectors.ts";
import { fetchDiscordThumbnail } from "../../../utils/socials.tsx";

export async function data(pageContext: PageContextServer) {
  const id = pageContext.routeParams.id;
  const artists = Object.values(fetchArtists());

  if (artists.map((artist) => artist.name).includes(id)) {
    const artist = artists.filter((artist) => artist.name === id)[0];

    artist.thumbnailUrl = await fetchDiscordThumbnail(artist.discordId);

    return artist;
  }

  return null;
}
