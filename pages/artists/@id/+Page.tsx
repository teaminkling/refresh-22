import { type ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useData } from "vike-react/useData";

import { DEFAULT_DESCRIPTION } from "../../+Head.tsx";
import InterfaceLink from "../../../components/markup/interface-link.tsx";
import { Header, Paragraph, StaticPage, SubHeader } from "../../../components/markup/typography.tsx";
import type Artist from "../../../data/Artist.ts";
import { parseSocial } from "../../../utils/socials.tsx";
import NotFoundError from "../../_error/+Page.tsx";

export default function SingleArtist() {
  const artist: Artist | null = useData();
  if (!artist) {
    return <NotFoundError />;
  }

  const socialsElements: ReactElement[] = [];
  artist.socials.forEach((socialUrl: string) => {
    const parsedSocial = parseSocial(socialUrl);
    const Icon = parsedSocial.icon;
    socialsElements.push(
      <div key={socialUrl} className="hover:bg-gray-100">
        <a href={parsedSocial.link} target="_blank" rel="noreferrer">
          <div className="flex flex-row uppercase text-2xl py-4 px-4">
            <Icon
              className="mr-6"
              style={{ color: parsedSocial.color, margin: "auto 0", marginRight: "0.5em" }}
              width="1.25em"
            />

            <p>{parsedSocial.text}</p>

            <FaExternalLinkAlt className="text-xs text-gray-300 my-auto ml-4" />
          </div>
        </a>
      </div>,
    );
  });

  return (
    <StaticPage>
      <Helmet>
        <title>{`${artist.name} | Design Refresh '22`}</title>

        <meta property="og:title" content={`${artist.name} | Design Refresh '22`} />
        <meta name="twitter:title" content={`${artist.name} | Design Refresh '22`} />

        <meta property="og:image" content={artist.thumbnailUrl} />
        <meta name="twitter:image" content={artist.thumbnailUrl} />

        <meta
          name="description"
          content={`Participant and artist page for ${artist.name} on the Design Refresh. ${DEFAULT_DESCRIPTION}`}
        />
        <meta
          property="og:description"
          content={`Participant and artist page for ${artist.name} on the Design Refresh. ${DEFAULT_DESCRIPTION}`}
        />
        <meta
          name="twitter:description"
          content={`Participant and artist page for ${artist.name} on the Design Refresh. ${DEFAULT_DESCRIPTION}`}
        />
      </Helmet>

      <img
        src={artist.thumbnailUrl}
        alt="the artist's Discord profile image"
        className="pt-8"
        style={{
          width: "128px",
        }}
      />

      <Header>{artist.name}</Header>

      <Paragraph>
        <b>Discord ID:</b> {artist.discordId}
      </Paragraph>

      <InterfaceLink title="View Filtered Gallery" location={`/?artist=${artist.name}&sort=descending`} />

      <SubHeader>Socials</SubHeader>

      {artist.socials.length > 0 ? (
        <>{socialsElements}</>
      ) : (
        <Paragraph>This artist did not provide any socials!</Paragraph>
      )}
    </StaticPage>
  );
}
