import {PropsWithChildren} from "react";
import Sidebar from "./sidebar";

const Layout = ({children}: PropsWithChildren) => {
  return (
    <>

      <div className={"md:flex md:flex-row"}>
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
