import Artist from "../../../data/Artist.ts";
import { fetchArtists } from "../../../utils/connectors.ts";

export default function onBeforePrerenderStart() {
  return Object.values(fetchArtists()).map((artist: Artist) => {
    return `/artists/${artist.name}`;
  });
}
