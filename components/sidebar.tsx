import {faDiscord, faGithub, faTwitch} from "@fortawesome/free-brands-svg-icons";
import {faBars, faLink, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import InterfaceLink from "./interface-link";
import SquareLink from "./square-link";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [logoHits, setLogoHits] = useState<number>(0);

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

      {/* Cheeky easter egg here if you keep pressing the logo. */}

      <a
        href="#"
        onClick={() => {
          setLogoHits(logoHits + 1);
        }}
        className={"px-4 pt-4 pb-16 hidden md:block"}
      >
        <img
          src={"/logo/full_logo.png"}
          alt={"The site's logo on the sidebar."}
          className={`w-1/2 ${
            logoHits % 8 === 0 && logoHits ? "nyoom" : "rotate-forever"
          }`}
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
              <SquareLink
                location={"https://github.com/teaminkling/refresh-22"}
                icon={<FontAwesomeIcon icon={faGithub} />}
              />
            </div>

            <div className={"my-5"} />

            <InterfaceLink location={"/terms"} title={"Terms"} nextLink />
            <InterfaceLink location={"/privacy"} title={"Privacy"} nextLink />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
