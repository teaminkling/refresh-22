import {EDITORS} from "../../../data/constants/setup";
import Week from "../../../data/core/Week";
import Work from "../../../data/core/Work";

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
    console.error("Discord ID was not saved for week number: %s", week.week);
  }

  return discordId;
};

export const postOrEditDiscordWork = async (
  work: Work, webhookUrl: string,
): Promise<string | null> => {
  // Retrieve artist name and icon.

  // FIXME

  const artistName = "";
  const artistIcon = "";

  // Determine content.

  let contentText = `New work by <@${work.artistId}>!\n\n**Title:**${work.title}`;

  if (work.medium) {
    contentText += `\n**Medium:**${work.medium}`;
  }

  if (work.description) {
    contentText += `\n**Description:**${work.description}`;
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
        "url": `https://refresh.fiveclawd.com/work/${work.id}`,
        "description": `A ${work.medium || " "}piece by <@${work.artistId}>!`,
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
    url = `${webhookUrl}/messages/${work.discordId}`;
    method = "patch";
  } else {
    url = `${webhookUrl}?wait=true`;
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

  return work.discordId ? null : discordId;
};
