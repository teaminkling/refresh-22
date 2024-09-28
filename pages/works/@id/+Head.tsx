import { useData } from "vike-react/useData";

import Artist from "../../../data/Artist.ts";
import Work from "../../../data/Work.ts";

export default function Head() {
  const {
    work,
    artist,
  }: {
    work?: Work;
    artist?: Artist;
  } = useData();

  const workTitle = work?.title || "Untitled";
  const artistName = artist?.name || work?.firstSeenArtistInfo?.name || "Unknown";
  const description = `A piece by ${artistName} for the '22 Design Refresh... ${work?.description.replace(/\n/, " ")}`;

  return (
    <>
      <meta property="og:title" content={`${workTitle} | Design Refresh '22`}/>
      <meta name="twitter:title" content={`${workTitle} | Design Refresh '22`}/>

      <meta property="og:image" content={work?.items[0].hiDpiThumbnail || "/img/placeholders/submission.png"}/>
      <meta name="twitter:image" content={work?.items[0].hiDpiThumbnail || "/img/placeholders/submission.png"}/>

      <meta name="description" content={description}/>
      <meta property="og:description" content={description}/>
      <meta name="twitter:description" content={description}/>

      <meta name="twitter:card" content="summary_large_image"/>
    </>
  );
}
