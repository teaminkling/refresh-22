/**
 * Utils surrounding social media.
 */
import {
  faApple,
  faDeviantart,
  faFacebook,
  faInstagram,
  faSoundcloud,
  faSpotify,
  faTwitch,
  faTwitter,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import {faLink, IconDefinition} from "@fortawesome/free-solid-svg-icons";

/**
 * A parsed social.
 */
export interface ParsedSocial {
  /**
   * The URL.
   */
  link: string;

  /**
   * An icon representing this social media.
   */
  icon: IconDefinition;

  /**
   * Text that can be used for the link. Best case scenario is a username.
   */
  text: string;

  /**
   * The hex colour of the icon.
   */
  color: string;
}

/**
 * Given a URL string, return an icon that matches it and the text of the link.
 *
 * @param {string} url the URL
 * @returns {ParsedSocial} the parsed social object
 */
export const parseSocial = (url: string): ParsedSocial => {
  let parsedUrl: URL;
  if (!url.includes("http")) {
    parsedUrl = new URL(`https://${url}`.replace("www.", ""));
  } else {
    parsedUrl = new URL(url.replace("www.", ""));
  }

  let icon = faLink;
  let text = parsedUrl.hostname;

  const pathParts: string[] = parsedUrl.pathname.split("/").filter(
    (value: string) => value
  );

  switch (parsedUrl.hostname) {
    case ("instagram.com"):
      icon = faInstagram;
      text = `${pathParts[0]}`;

      break;
    case ("twitter.com"):
      icon = faTwitter;
      text = `${pathParts[0]}`;

      break;
    case ("deviantart.com"):
      icon = faDeviantart;
      text = `${pathParts[0]}`;

      break;
    case ("facebook.com"):
      icon = faFacebook;
      text = `${pathParts[0]}`;

      break;
    case ("youtube.com"):
    case ("youtu.be"):
      icon = faYoutube;
      text = "YouTube";

      break;
    case ("twitch.tv"):
      icon = faTwitch;
      text = `${pathParts[0]}`;

      break;
    case ("soundcloud.com"):
      icon = faSoundcloud;
      text = `${pathParts[0]}`;

      break;
    case ("spotify.com"):
    case ("open.spotify.com"):
      icon = faSpotify;
      text = "Spotify";

      break;
    case ("music.apple.com"):
      icon = faApple;
      text = "Apple Music";

      break;
  }

  return {
    link: parsedUrl.toString(), icon: icon, text: text, color: "#000000",
  };
};
