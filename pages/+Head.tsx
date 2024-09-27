import { DEFAULT_DESCRIPTION } from "../data/constants.ts";

export default function Head() {
  return (
    <>
      <meta property="og:title" content="Design Refresh '22" />
      <meta name="twitter:title" content="Design Refresh '22" />

      <link rel="canonical" href="https://refresh.fiveclawd.com" />
      <meta property="og:url" content="https://refresh.fiveclawd.com" />

      <meta property="og:image" content="https://refresh.fiveclawd.com/img/meta.png" />
      <meta name="twitter:image" content="https://refresh.fiveclawd.com/img/meta.png" />

      <meta name="description" content={DEFAULT_DESCRIPTION} />
      <meta property="og:description" content={DEFAULT_DESCRIPTION} />
      <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@fiveclawd" />

      <meta name="theme-color" content="#7C7CE0" />
    </>
  );
}
