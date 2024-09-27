import type { PageContextServer } from "vike/types";

import type Work from "../../../data/Work.ts";
import { fetchArtists, fetchWorkById } from "../../../utils/connectors.ts";

export function data(pageContext: PageContextServer) {
  const id = pageContext.routeParams.id;

  const artists = fetchArtists();
  const work: Work | undefined = fetchWorkById(id);

  if (!work) {
    return {
      work: undefined,
      artist: undefined,
    };
  }

  return {
    work: fetchWorkById(id),
    artist: Object.values(artists).filter((artist) => artist.discordId === work.artistId)[0],
  };
}
