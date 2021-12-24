/**
 * The logo of the app and the responsive icon that appears on smaller aspect ratios.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {faDiscord, faTwitch} from "@fortawesome/free-brands-svg-icons";
import {faBars, faClock, faTimes, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import NavItem from "./navitem";

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
    <a href="#" className={"text-lg font-semibold tracking-widest uppercase px-4"}>
      Refresh 22
    </a>
  );

  // A burger menu that only appears on smaller screens.

  const burgerHeader = (
    <div className={
      "flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between lg:hidden z-10"
    }>
      {logo}

      <button className={
        "rounded-lg lg:hidden rounded-lg focus:outline-none focus:shadow-outline"
      } onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
      </button>
    </div>
  );

  // Handle authentication views.

  const {
    user, isLoading, isAuthenticated, loginWithRedirect, logout
  }: Auth0ContextInterface = useAuth0();

  const loading = <NavItem title={"Loading..."} />;
  const auth = isAuthenticated ? (
    <>
      <NavItem location={"#"} clickBack={logout} title={"Logout"} strong />
      <NavItem
        location={`/artist/${user?.name}`}
        title={user?.name || "ERROR"}
        icon={<FontAwesomeIcon icon={faUser} />}
        nextLink
      />

      <div className={"my-5"} />

      <NavItem location={"#"} title={"Submit"} />
    </>
  ) : (
    <>
      <NavItem
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

            <NavItem location={"/"} title={"Home"} nextLink />
            <NavItem location={"/about/"} title={"About"} nextLink />
            <NavItem location={"/guide/"} title={"Guide"} nextLink />

            <div className={"my-5"} />

            <NavItem location={"/weeks/"} title={"Weeks"} nextLink />
            <NavItem location={"/artists/"} title={"Artists"} nextLink />

            <div className={"my-5"} />

            {isLoading ? loading : auth}
          </div>

          <hr className={"my-5 lg:hidden border-black"} />

          <div className={"items-center"}>
            <NavItem title={"Countdown"} strong />
            <NavItem title={"99 days 23:59:59"} icon={<FontAwesomeIcon icon={faClock} />} />
          </div>

          <hr className={"my-5 lg:hidden border-black"} />

          <div className={"flex-shrink-0"}>
            <NavItem
              location={"#"}
              title={"CindryTuna"}
              icon={<FontAwesomeIcon icon={faTwitch} />}
              isExternal
            />
            <NavItem
              location={"#"}
              title={"CindryTuna"}
              icon={<FontAwesomeIcon icon={faDiscord} />}
              isExternal
            />

            <div className={"my-5"} />

            <NavItem location={"/terms"} title={"Terms"} nextLink />
            <NavItem location={"/privacy"} title={"Privacy"} nextLink />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
