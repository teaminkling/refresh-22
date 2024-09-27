import vikeReact from "vike-react/config";

import Layout from "./Layout.tsx";

export const config = {
  Layout,
  bodyAttributes: { className: "antialiased" },
  extends: vikeReact,
  ssr: false,
};
