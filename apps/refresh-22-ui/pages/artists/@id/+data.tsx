import type { PageContextServer } from "vike/types";

import { fetchArtists } from "../../../utils/connectors.ts";

export function data(pageContext: PageContextServer) {
  const id = pageContext.routeParams.id;
  const artists = Object.values(fetchArtists());

  if (artists.map((artist) => artist.name).includes(id)) {
    return artists.filter((artist) => artist.name === id)[0];
  }

  return null;
}
