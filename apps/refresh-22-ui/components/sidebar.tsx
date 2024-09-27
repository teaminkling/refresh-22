import { useState } from "react";
import { FaBars, FaDiscord, FaGithub, FaLink, FaTimes, FaTwitch } from "react-icons/fa";

import InterfaceLink from "./markup/interface-link";
import SquareLink from "./markup/square-link";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [logoHits, setLogoHits] = useState<number>(0);

  const logo = (
    <>
      <a href="#" className="pr-24 md:hidden">
        <img src="/img/logos/rect-logo.png" alt="the site's logo on the sidebar" className="max-h-12" />
      </a>
      <a
        href="#"
        onClick={() => {
          setLogoHits(logoHits + 1);
        }}
        className="px-4 pt-4 pb-16 hidden md:block"
      >
        <img
          src="/img/logos/full-logo.png"
          alt="the site's logo on the sidebar"
          className={`w-1/2 ${logoHits % 8 === 0 && logoHits ? "nyoom" : "rotate-forever"}`}
        />
      </a>
    </>
  );

  // A burger menu that only appears on smaller screens.

  const burgerHeader = (
    <div className="flex-shrink-0 px-4 py-4 flex flex-row items-center justify-between md:hidden z-50">
      {logo}

      <button className="w-10 text-2xl md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </div>
  );

  return (
    <div className="md:w-80 md:h-screen bg-white">
      <div className="md:absolute md:my-4 md:mx-4 bottom-0 top-0 left-0 right-0 border-r border-black">
        {burgerHeader}

        <nav
          className={
            "md:flex md:flex-col md:justify-between px-4 h-screen md:h-full " + (isMenuOpen ? "block" : "hidden")
          }
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="flex-shrink-0 block">
            <div className="hidden md:block py-4">{logo}</div>

            <InterfaceLink location="/" title="Home" />
            <InterfaceLink location="/about/" title="About" />
            <InterfaceLink location="/guide/" title="Guide" />

            <div className="my-5" />

            <InterfaceLink location="/weeks/" title="Weeks" />
            <InterfaceLink location="/artists/" title="Artists" />

            <div className="my-5" />
          </div>

          <hr className="my-5 md:hidden border-black" />

          <div className="flex-shrink-0">
            <div className="flex justify-center mb-5">
              <SquareLink location="https://fiveclawd.com" icon={<FaLink />} />
              <SquareLink location="https://twitch.tv/cindryshoo" icon={<FaTwitch />} />
              <SquareLink location="https://discord.gg/NuUB469UXM" icon={<FaDiscord />} />
              <SquareLink location="https://github.com/teaminkling/refresh-22" icon={<FaGithub />} />
            </div>

            <div className="mt-5">
              <InterfaceLink location="/terms" title="Terms" />
              <InterfaceLink location="/privacy" title="Privacy" />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
