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
  faClock,
  faLink,
  faQuestionCircle,
  faTimes,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {ReactNode, useState} from "react";
import Countdown, {CountdownRendererFn, CountdownRenderProps} from "react-countdown";
import {getDateOfNextEvent, getNatureOfNextEvent} from "../utils/time";
import InterfaceLink from "./interface-link";
import SquareLink from "./square-link";

/**
 * A renderer for a {@link Countdown}.
 *
 * @param {CountdownRenderProps} the props
 * @returns {string} the rendered countdown
 */
const countdownRenderer: CountdownRendererFn = (
  {days, hours, minutes, seconds}: CountdownRenderProps
): ReactNode => {
  const dayWording = days === 1 ? "day" : "days";

  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return (
    <InterfaceLink
      title={`${days} ${dayWording} ${paddedHours}:${paddedMinutes}:${paddedSeconds}`}
      icon={<FontAwesomeIcon icon={faClock} />}
    />
  );
};

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
      <a href="#" className={"pr-24 md:hidden"}>
        <img
          src={"/logo/rect_logo.png"}
          alt={"The site's logo on the sidebar."}
          className={"max-h-12"}
        />
      </a>

      <a href="#" className={"px-4 pt-4 pb-16 hidden md:block"}>
        <img
          src={"/logo/full_logo.png"}
          alt={"The site's logo on the sidebar."}
          className={"w-1/2 rotate-forever"}
        />
      </a>
    </>
  );

  // A burger menu that only appears on smaller screens.

  const burgerHeader = (
    <div className={
      "flex-shrink-0 px-4 py-4 flex flex-row items-center justify-between md:hidden z-50"
    }>
      {logo}

      <button className={"w-10 text-2xl md:hidden"} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
      </button>
    </div>
  );

  // Handle authentication views.

  const {
    user, isLoading, isAuthenticated, loginWithRedirect, logout
  }: Auth0ContextInterface = useAuth0();

  const loading = <InterfaceLink title={"Loading..."} />;
  const auth = isAuthenticated ? (
    <>
      <InterfaceLink location={"#"} clickBack={logout} title={"Logout"} strong />
      <InterfaceLink
        location={"/artists?name=me"}
        title={user?.name || "Error"}
        icon={<FontAwesomeIcon icon={faUser} />}
        nextLink
      />

      <div className={"my-5"} />

      <InterfaceLink location={"#"} title={"Submit"} />
    </>
  ) : (
    <>
      <InterfaceLink
        location={"#"}
        clickBack={() => loginWithRedirect({connection: "discord"})}
        title={"Login"}
        strong
        icon={<FontAwesomeIcon icon={faDiscord} />}
      />
    </>
  );

  return (
    <div className={"md:w-80 md:h-screen bg-white"}>
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
        "md:absolute md:my-4 md:mx-4 bottom-0 top-0 left-0 right-0 border-r border-black"
      }>
        {burgerHeader}

        <nav
          className={
            "md:flex md:flex-col md:justify-between md:block px-4 h-screen md:h-full " + (
              isMenuOpen ? "block" : "hidden"
            )
          }
          onClick={() => setIsMenuOpen(false)}
        >
          <div className={"flex-shrink-0 block"}>
            <div className={"hidden md:block py-4"}>
              {logo}
            </div>

            <InterfaceLink location={"/"} title={"Home"} nextLink />
            <InterfaceLink location={"/about/"} title={"About"} nextLink />
            <InterfaceLink location={"/guide/"} title={"Guide"} nextLink />

            <div className={"my-5"} />

            <InterfaceLink location={"/weeks/"} title={"Weeks"} nextLink />
            <InterfaceLink location={"/artists/"} title={"Artists"} nextLink />

            <div className={"my-5"} />

            {isLoading ? loading : auth}
          </div>

          <hr className={"my-5 md:hidden border-black"} />

          <div className={"items-center"} suppressHydrationWarning={true}>
            <InterfaceLink title={getNatureOfNextEvent()} strong />
            <Countdown
              date={getDateOfNextEvent()} renderer={countdownRenderer}
            />
          </div>

          <hr className={"my-5 md:hidden border-black"} />

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
            </div>

            <div className={"my-5"} />

            <InterfaceLink location={"/terms"} title={"Terms"} nextLink />
            <InterfaceLink location={"/privacy"} title={"Privacy"} nextLink />
            <div className={"m-auto text-center bg-yellow-200 rounded-3xl my-3 py-1.5 mx-4"}>
              <p>
                Website is in Beta
                <Link href={"/beta"}>
                  <a className={"pl-2"}>
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
