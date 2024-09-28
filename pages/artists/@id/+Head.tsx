import { useData } from "vike-react/useData";

import Artist from "../../../data/Artist.ts";
import { DEFAULT_DESCRIPTION } from "../../../data/constants.ts";

export default function Head() {
  const artist: Artist | null = useData();

  const artistName = artist?.name || "Artist";
  const description = `Participant and artist page for ${artist?.name || "an artist"} on the Design Refresh. ${DEFAULT_DESCRIPTION}`;

  return (
    <>
      <meta property="og:title" content={`${artistName} | Design Refresh '22`} />
      <meta name="twitter:title" content={`${artistName} | Design Refresh '22`} />

      <meta property="og:image" content={artist?.thumbnailUrl || "/img/meta.png"} />
      <meta name="twitter:image" content={artist?.thumbnailUrl || "/img/meta.png"} />

      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />

      <meta name="twitter:card" content="summary" />
    </>
  );
}
