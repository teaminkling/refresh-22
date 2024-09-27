import "@fontsource/work-sans/400.css";
import { PropsWithChildren, StrictMode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Sidebar from "../components/sidebar.tsx";
import "./globals.css";

const DEFAULT_DESCRIPTION =
  "The 2022 Design Refresh is a weekly design/art/creative challenge hosted on Twitch by " +
  "CindryShoo AKA FiveClawD, sponsored by Inkling Interactive.";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <StrictMode>
      <HelmetProvider>
        <Helmet>
          <meta property="og:title" content="Design Refresh '22" />
          <meta name="twitter:title" content="Design Refresh '22" />

          <link rel="canonical" href="https://refresh.fiveclawd.com" />
          <meta property="og:url" content="https://refresh.fiveclawd.com" />

          <meta property="og:image" content="https://refresh.fiveclawd.com/img/meta.png" />
          <meta name="twitter:image" content="https://refresh.fiveclawd.com/img/meta.png" />

          <meta name="description" content={DEFAULT_DESCRIPTION} />
          <meta property="og:description" content={DEFAULT_DESCRIPTION} />
          <meta name="description" content={DEFAULT_DESCRIPTION} />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@fiveclawd" />

          <meta name="theme-color" content="#7C7CE0" />
        </Helmet>
        <div className="md:flex md:flex-row">
          <aside className="md:h-screen sticky top-0">
            <Sidebar />
          </aside>

          <div className="flex-col w-full">{children}</div>
        </div>
      </HelmetProvider>
    </StrictMode>
  );
}
