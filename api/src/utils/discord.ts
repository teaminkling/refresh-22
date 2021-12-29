import Work from "../../../data/core/Work";
import {AUTH0_MANAGEMENT_API_URL} from "../constants/auth";
import {DISCORD_WEBHOOK} from "../constants/kv";

/**
 * Utils about Discord API requests.
 */

export const postOrEditDiscordPost = async (
  authKv: KVNamespace,
  work: Work,
  jwt: string,
): Promise<string | null> => {
  // Retrieve webhook.

  const discordWebhook: string | null = await authKv.get(DISCORD_WEBHOOK);
  if (!discordWebhook) {
    throw new Error("No Discord webhook on backend. Can't send a message!");
  }

  // Retrieve artist name and icon.

  const managementApiResponse = await fetch(
    `${AUTH0_MANAGEMENT_API_URL}/api/v2/users/oauth2|discord|${work.artistId}`,
  );

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
    url = `${discordWebhook}/messages/${work.discordId}`;
    method = "patch";
  } else {
    url = `${discordWebhook}?wait=true`;
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
