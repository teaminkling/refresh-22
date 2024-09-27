import { type ReactElement } from "react";
import { type IconBaseProps } from "react-icons";
import {
  FaApple,
  FaDeviantart,
  FaFacebook,
  FaInstagram,
  FaLink,
  FaSoundcloud,
  FaSpotify,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

interface ParsedSocial {
  link: string;
  icon: (props: IconBaseProps) => ReactElement;
  text: string;
  color: string;
}

export function parseSocial(url: string): ParsedSocial {
  let parsedUrl: URL;
  if (!url.includes("http")) {
    parsedUrl = new URL(`https://${url}`.replace("www.", ""));
  } else {
    parsedUrl = new URL(url.replace("www.", ""));
  }

  let icon: (props: IconBaseProps) => ReactElement = FaLink;
  let text = parsedUrl.hostname;
  let color = "#000000";

  const pathParts: string[] = parsedUrl.pathname.split("/").filter((value: string) => value);

  switch (parsedUrl.hostname) {
    case "instagram.com":
      icon = FaInstagram;
      text = `${pathParts[0]}`;
      color = "#C13584";

      break;
    case "twitter.com":
      icon = FaTwitter;
      text = `${pathParts[0]}`;
      color = "#1DA1F2";

      break;
    case "deviantart.com":
      icon = FaDeviantart;
      text = `${pathParts[0]}`;
      color = "#05CC46";

      break;
    case "facebook.com":
      icon = FaFacebook;
      text = `${pathParts[0]}`;
      color = "#1778F2";

      break;
    case "youtube.com":
    case "youtu.be":
      icon = FaYoutube;
      text = "YouTube";
      color = "#FF0000";

      break;
    case "twitch.tv":
      icon = FaTwitch;
      text = `${pathParts[0]}`;
      color = "#6441A4";

      break;
    case "soundcloud.com":
      icon = FaSoundcloud;
      text = `${pathParts[0]}`;
      color = "#FE5000";

      break;
    case "spotify.com":
    case "open.spotify.com":
      icon = FaSpotify;
      text = "Spotify";
      color = "#1DB954";

      break;
    case "music.apple.com":
      icon = FaApple;
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
}

export async function fetchDiscordThumbnail(userId: string) {
  // This very easily can rate limit us.

  const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
    headers: {
      Authorization: `Bot ${import.meta.env.VITE_DISCORD_BOT_TOKEN}`,
    },
  });

  const user = (await response.json()) as { avatar: string; discriminator: number };

  const avatarHash = user.avatar;

  // Sleep for 5 seconds to avoid rate limiting.

  await new Promise((resolve) => setTimeout(resolve, 5000));

  if (avatarHash) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png`;
  }

  return `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
}
