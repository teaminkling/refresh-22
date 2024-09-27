import { type ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useData } from "vike-react/useData";

import InterfaceLink from "../../../components/markup/interface-link.tsx";
import { Header, Paragraph, StaticPage, SubHeader } from "../../../components/markup/typography.tsx";
import type Artist from "../../../data/Artist.ts";
import { parseSocial } from "../../../utils/socials.tsx";
import NotFoundError from "../../_error/+Page.tsx";

export default function SingleArtist() {
  const data: Artist | null = useData();
  if (!data) {
    return <NotFoundError />;
  }

  const socialsElements: ReactElement[] = [];
  data.socials.forEach((socialUrl: string) => {
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
        <title>
          {data.name} - {"Design Refresh '22"}
        </title>
      </Helmet>

      <img
        src={data.thumbnailUrl}
        alt="the artist's Discord profile image"
        className="pt-8"
        style={{
          width: "128px",
        }}
      />

      <Header>{data.name}</Header>

      <Paragraph>
        <b>Discord ID:</b> {data.discordId}
      </Paragraph>

      <InterfaceLink title="View Filtered Gallery" location={`/?artist=${data.name}?sort=descending`} />

      <SubHeader>Socials</SubHeader>

      {data.socials.length > 0 ? (
        <>{socialsElements}</>
      ) : (
        <Paragraph>This artist did not provide any socials!</Paragraph>
      )}
    </StaticPage>
  );
}
