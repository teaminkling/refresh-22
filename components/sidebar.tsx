/**
 * The logo of the app and the responsive icon that appears on smaller aspect ratios.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {faDiscord, faTwitch} from "@fortawesome/free-brands-svg-icons";
import {
  faBars,
  faBug,
  faClock,
  faCode,
  faLink,
  faTimes,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import SidebarLink from "./sidebar-link";
import SquareLink from "./square-link";

/**
 * The sidebar which controls all content on the right side of the screen.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Sidebar = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // The "bar" logo, only used in the sidebar.

  const logo = (
    <>
      <a href="#" className={"pr-24 lg:hidden"}>
        <img src={"/logo/rect_logo.png"} alt={"The site's logo on the sidebar."} />
      </a>

      <a href="#" className={"px-4 pt-4 pb-16 hidden lg:block"}>
        <img src={"/logo/full_logo.png"} alt={"The site's logo on the sidebar."} />
      </a>
    </>
  );

  // A burger menu that only appears on smaller screens.

  const burgerHeader = (
    <div className={
      "flex-shrink-0 px-4 py-4 flex flex-row items-center justify-between lg:hidden z-10"
    }>
      {logo}

      <button className={"w-32 text-2xl lg:hidden"} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
      </button>
    </div>
  );

  // Handle authentication views.

  const {
    user, isLoading, isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently
  }: Auth0ContextInterface = useAuth0();

  const loading = <SidebarLink title={"Loading..."} />;
  const auth = isAuthenticated ? (
    <>
      <SidebarLink location={"#"} clickBack={logout} title={"Logout"} strong />
      <SidebarLink
        location={`/artist/${user?.name}`}
        title={user?.name || "ERROR"}
        icon={<FontAwesomeIcon icon={faUser} />}
        nextLink
      />

      <div className={"my-5"} />

      <SidebarLink location={"#"} title={"Submit"} />
    </>
  ) : (
    <>
      <SidebarLink
        location={"#"}
        clickBack={() => loginWithRedirect({connection: "discord"})}
        title={"Login"}
        strong
        icon={<FontAwesomeIcon icon={faDiscord} />}
      />
    </>
  );

  return (
    <div className={"lg:w-96 lg:h-screen bg-white overflow-scroll"}>
      {
        /*
         The parent defines the entire side of the screen. The immediate child defines an
         absolutely-positioned element (on wide enough screens) that is the full height minus
         some degree of padding.

         There are two reasons we want to do this:

         1. So the flexbox will take the entire size of the sidebar for top, middle, and bottom.
         2. The border/vertical line will have the correct padding.
         */
      }

      <div className={
        "lg:absolute lg:my-4 lg:mx-4 bottom-0 top-0 left-0 right-0 border-r border-black"
      }>
        {burgerHeader}

        <nav
          className={
            "lg:flex lg:flex-col lg:justify-between lg:block px-4 h-screen lg:h-full " + (
              isMenuOpen ? "block" : "hidden"
            )
          }
          onClick={() => setIsMenuOpen(false)}
        >
          <div className={"flex-shrink-0 block"}>
            <div className={"hidden lg:block py-4"}>
              {logo}
            </div>

            <SidebarLink location={"/"} title={"Home"} nextLink />
            <SidebarLink location={"/about/"} title={"About"} nextLink />
            <SidebarLink location={"/guide/"} title={"Guide"} nextLink />

            <div className={"my-5"} />

            <SidebarLink location={"/weeks/"} title={"Weeks"} nextLink />
            <SidebarLink location={"/artists/"} title={"Artists"} nextLink />

            <div className={"my-5"} />

            {isLoading ? loading : auth}
          </div>

          <hr className={"my-5 lg:hidden border-black"} />

          <div className={"items-center"}>
            <SidebarLink title={"Countdown"} strong />
            <SidebarLink title={"99 days 23:59:59"} icon={<FontAwesomeIcon icon={faClock} />} />
          </div>

          <hr className={"my-5 lg:hidden border-black"} />

          <div className={"flex-shrink-0"}>
            <div id={"refresh-socials"} className={"text-center sm:text-left"}>
              <SquareLink
                location={"https://fiveclawd.com"}
                icon={<FontAwesomeIcon icon={faLink} />}
              />
              <SquareLink
                location={"https://twitch.tv/cindrytuna"}
                icon={<FontAwesomeIcon icon={faTwitch} />}
              />
              <SquareLink
                location={"https://discord.gg/NuUB469UXM"}
                icon={<FontAwesomeIcon icon={faDiscord} />}
              />
              <SquareLink
                location={"https://github.com/teaminkling/refresh-22"}
                icon={<FontAwesomeIcon icon={faCode} />}
              />
              <SquareLink
                location={"https://github.com/teaminkling/refresh-22/issues/new"}
                icon={<FontAwesomeIcon icon={faBug} />}
              />
            </div>

            <div className={"my-5"} />

            <SidebarLink location={"/terms"} title={"Terms"} nextLink />
            <SidebarLink location={"/privacy"} title={"Privacy"} nextLink />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
