import {PropsWithChildren} from "react";
import Sidebar from "./sidebar";

/**
 * A custom style layout for all pages.
 *
 * @param {PropsWithChildren} children the child elements
 * @returns {JSX.Element} the layout element
 * @constructor
 */
const Layout = ({children}: PropsWithChildren<unknown>) => {
  return (
    <>

      <div className={"md:flex md:flex-row"}>
        {/* Create a sticky sidebar: */}

        <aside className={"md:h-screen sticky top-0"}>
          <Sidebar />
        </aside>

        <div className={"flex-col w-full"}>
          {children}
        </div>
      </div>

    </>
  );
};

export default Layout;
