import "@fontsource/cousine/400.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { PropsWithChildren, StrictMode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import "./globals.css";

const DEFAULT_DESCRIPTION =
  "Interactive indie game development studio with a deep-sea spark. We believe in experimenting and telling complex " +
  "and subtle stories in worlds of our own.";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <StrictMode>
      <HelmetProvider>
        <Helmet>
          <meta property="og:title" content="Inkling Interactive" />
          <meta name="twitter:title" content="Inkling Interactive" />

          <link rel="canonical" href="https://inklinginteractive.com" />
          <meta property="og:url" content="https://inklinginteractive.com" />

          <meta property="og:image" content="https://inklinginteractive.com/img/meta.png" />
          <meta name="twitter:image" content="https://inklinginteractive.com/img/meta.png" />

          <meta name="description" content={DEFAULT_DESCRIPTION} />
          <meta property="og:description" content={DEFAULT_DESCRIPTION} />
          <meta name="description" content={DEFAULT_DESCRIPTION} />

          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@teaminkling" />
        </Helmet>
        <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
      </HelmetProvider>
    </StrictMode>
  );
}
