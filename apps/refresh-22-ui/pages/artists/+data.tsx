import { fetchArtists } from "../../utils/connectors.ts";

export function data() {
  return fetchArtists();
}
