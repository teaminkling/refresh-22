import {
  faApple,
  faDeviantart,
  faFacebook,
  faInstagram,
  faSoundcloud,
  faSpotify,
  faTwitch,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { IconDefinition, faLink } from "@fortawesome/free-solid-svg-icons";

export interface ParsedSocial {
  link: string;
  icon: IconDefinition;
  text: string;
  color: string;
}

export const parseSocial = (url: string): ParsedSocial => {
  let parsedUrl: URL;
  if (!url.includes("http")) {
    parsedUrl = new URL(`https://${url}`.replace("www.", ""));
  } else {
    parsedUrl = new URL(url.replace("www.", ""));
  }

  let icon = faLink;
  let text = parsedUrl.hostname;
  let color = "#000000";

  const pathParts: string[] = parsedUrl.pathname.split("/").filter((value: string) => value);

  switch (parsedUrl.hostname) {
    case "instagram.com":
      icon = faInstagram;
      text = `${pathParts[0]}`;
      color = "#C13584";

      break;
    case "twitter.com":
      icon = faTwitter;
      text = `${pathParts[0]}`;
      color = "#1DA1F2";

      break;
    case "deviantart.com":
      icon = faDeviantart;
      text = `${pathParts[0]}`;
      color = "#05CC46";

      break;
    case "facebook.com":
      icon = faFacebook;
      text = `${pathParts[0]}`;
      color = "#1778F2";

      break;
    case "youtube.com":
    case "youtu.be":
      icon = faYoutube;
      text = "YouTube";
      color = "#FF0000";

      break;
    case "twitch.tv":
      icon = faTwitch;
      text = `${pathParts[0]}`;
      color = "#6441A4";

      break;
    case "soundcloud.com":
      icon = faSoundcloud;
      text = `${pathParts[0]}`;
      color = "#FE5000";

      break;
    case "spotify.com":
    case "open.spotify.com":
      icon = faSpotify;
      text = "Spotify";
      color = "#1DB954";

      break;
    case "music.apple.com":
      icon = faApple;
      text = "Apple Music";
      color = "#000000";

      break;
  }

  return {
    link: parsedUrl.toString(),
    icon: icon,
    text: text,
    color: color,
  };
};
