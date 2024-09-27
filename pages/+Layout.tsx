import "@fontsource-variable/work-sans";
import { PropsWithChildren, StrictMode } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Sidebar from "../components/sidebar.tsx";
import "./globals.css";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <StrictMode>
      <HelmetProvider>
        <Helmet></Helmet>
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
