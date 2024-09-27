import { fetchArtists, fetchWorks } from "../../utils/connectors.ts";

export function data() {
  return {
    works: fetchWorks(),
    artists: fetchArtists(),
  };
}
