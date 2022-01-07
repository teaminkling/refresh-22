import {ACTIVE_YEAR, EDITORS} from "../../../data/constants/setup";
import Artist from "../../../data/core/Artist";
import Week from "../../../data/core/Week";
import Work from "../../../data/core/Work";
import {ARTISTS} from "../constants/kv";
import Environment from "../types/environment";

/**
 * Utils about Discord API requests.
 */

/**
 * Post or edit a Discord message related to the week's theme.
 *
 * @param {Week} week the week
 * @param {string} webhookUrl the webhook URL
 * @returns {Promise<string | null>} if present, the Discord ID when creating a post
 */
export const postOrEditDiscordWeek = async (
  week: Week, webhookUrl: string,
): Promise<string | null> => {
  const content: Record<string, unknown> = {
    "content": (
      `**Week ${week.week}: ${week.theme}**\n\n${week.information}\n\n`
      + "View the weeks: [here](https://refresh.fiveclawd.com/weeks)."
    ),
    "username": "cindry via Design Refresh",
    "allowed_mentions": {
      "users": EDITORS,
    }
  };

  // noinspection DuplicatedCode
  let url: string;
  let method: string;

  if (week.discordId) {
    url = `${webhookUrl}/messages/${week.discordId}`;
    method = "PATCH";
  } else {
    url = `${webhookUrl}?wait=true`;
    method = "post";
  }

  const response: Response = await fetch(url, {
    method: method, headers: {"Content-Type": "application/json"}, body: JSON.stringify(content),
  });

  // Send a message if the discord ID is not provided. Can fail. First post write will run twice.

  let discordId: string | null = null;
  try {
    discordId = (await response.json<Record<string, string>>())["id"];
  } catch {
    console.error("Discord ID was not saved for week number: %s", week.week);
  }

  return discordId;
};

/**
 * Post or edit a Discord's submission post.
 *
 * @param {Environment} env the environment
 * @param {Work} work the work itself
 * @returns {Promise<string | null>} the ID for the work, if successful
 */
export const postOrEditDiscordWork = async (
  env: Environment, work: Work
): Promise<string | null> => {
  // Retrieve artist name and icon. Default to backend-retrieved but otherwise use the
  // information on the Work. The information on the Work will usually make up the Discord post
  // as well, and if the user changes their name, that information won't propagate unless they
  // deliberately edit their post first.

  const artists: Record<string, Artist> = JSON.parse(
    (await env.REFRESH_KV.get(`${ARTISTS}/${ACTIVE_YEAR}`)) || "{}"
  );

  const postingArtist: Artist | undefined | null = artists[work.artistId];

  const artistName: string = (
    postingArtist?.name || work.firstSeenArtistInfo?.name || "Unknown"
  );

  const artistIcon: string | undefined = (
    postingArtist?.thumbnailUrl || work.firstSeenArtistInfo?.thumbnailUrl
  );

  // Determine content.

  let contentText = `New work by <@${work.artistId}>!\n\n**Title:** ${work.title}`;

  if (work.medium) {
    contentText += `\n**Medium:** ${work.medium}`;
  }

  if (work.description) {
    contentText += `\n**Description:**\n\n${work.description}`;
  }

  const content: Record<string, unknown> = {
    "content": contentText,
    "username": `${artistName} via Design Refresh`,
    "allowed_mentions": {
      "users": [work.artistId],
    },
    "embeds": [
      {
        "type": "rich",
        "title": work.title,
        "url": `${env.ALLOWED_ORIGIN}/works/${work.id}`,
        "description": (
          `A(n) ${work.medium ? "_" + work.medium.toLowerCase() + "_ " : ""}piece by ` +
          `<@${work.artistId}>!`
        ),
        "image": {
          "url": work.thumbnailUrl,
        },
        "timestamp": new Date().toISOString(),
        "author": {
          "name": artistName,
          "icon_url": artistIcon,
          "url": `https://refresh.fiveclawd.com/artists/${artistName}`,
        },
        "footer": {
          "text": work.weekNumbers.map(weekNumber => `Week ${weekNumber}`).join(", "),
        },
      }
    ]
  };

  // Determine URL and send to webhook.

  let url: string;
  let method: string;

  if (work.discordId) {
    url = `${env.WORKS_DISCORD_URL}/messages/${work.discordId}`;
    method = "PATCH";
  } else {
    url = `${env.WORKS_DISCORD_URL}?wait=true`;
    method = "post";
  }

  const response: Response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });

  // Send a message if the discord ID is not provided. Can fail. First post write will run twice.

  let discordId: string | null = null;
  try {
    discordId = (await response.json<Record<string, string>>())["id"];
  } catch {
    console.error("Discord ID was not saved for work ID: %s", work.id);
  }

  return discordId;
};
