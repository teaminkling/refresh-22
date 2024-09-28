import { DEFAULT_DESCRIPTION } from "../../data/constants.ts";

export default function Head() {
  return (
    <>
      <meta property="og:title" content="Gallery | Design Refresh '22" />
      <meta name="twitter:title" content="Gallery | Design Refresh '22" />

      <meta property="og:image" content="https://refresh.fiveclawd.com/img/meta.png" />
      <meta name="twitter:image" content="https://refresh.fiveclawd.com/img/meta.png" />

      <meta name="description" content={DEFAULT_DESCRIPTION} />
      <meta property="og:description" content={DEFAULT_DESCRIPTION} />
      <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />

      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
