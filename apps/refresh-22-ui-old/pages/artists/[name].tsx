import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Head from "next/head";
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import InterfaceLink from "../../components/interface-link";
import StaticPage, {Header, Paragraph, SubHeader} from "../../components/typography";
import Artist from "../../data/core/Artist";
import {ArtistsState, RootState} from "../../store/state";
import {fetchArtists} from "../../utils/connectors";
import {ParsedSocial, parseSocial} from "../../utils/socials";
import NotFound from "../404";

const SingleArtist = (): JSX.Element => {
  const router = useRouter();
  const query: ParsedUrlQuery = router.query;

  // Determine the name we want to retrieve.

  const _rawName: string | string[] | undefined = query.name || "unknown";
  const name: string = typeof _rawName === "object" ? _rawName[0] : _rawName;

  // Update artists cache if necessary.

  const dispatch: Dispatch = useDispatch();
  const artistsData: ArtistsState = useSelector((state: RootState) => state.artistsData);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    fetchArtists(dispatch, artistsData);

    setIsLoading(false);
  }, []);

  const idFromState: string | undefined = artistsData.usernameToId[name];

  let response: JSX.Element = <NotFound />;
  if (idFromState) {
    const artist: Artist = artistsData.artists[idFromState];

    // Place the socials down.

    const socialsElements: JSX.Element[] = [];
    artist.socials.forEach((socialUrl: string) => {
      const parsedSocial: ParsedSocial = parseSocial(socialUrl);
      socialsElements.push(
        <div key={socialUrl} className={"hover:bg-gray-100"}>
          <a href={parsedSocial.link} target={"_blank"} rel="noreferrer">
            <p className={"uppercase text-2xl py-4 px-4"}>
              <FontAwesomeIcon
                icon={parsedSocial.icon}
                className={"mr-6"}
                style={{color: parsedSocial.color}}
                fixedWidth
              />
              {parsedSocial.text}
              <FontAwesomeIcon
                icon={faExternalLinkAlt}
                className={"text-xs ml-3 text-gray-300"}
              />
            </p>
          </a>
        </div>
      );
    });

    response = (
      <StaticPage>
        <Head>
          <title>{artist.name} - Design Refresh</title>
        </Head>

        <img src={artist.thumbnailUrl} alt={"The user's thumbnail URL."} className={"pt-8"} />

        <Header>
          {name}
        </Header>

        <Paragraph>
          <b>Discord ID:</b> {artist.discordId}
        </Paragraph>

        <InterfaceLink
          title="View Filtered Gallery"
          location={`/?artist=${name}`}
        />

        <SubHeader>Social Media</SubHeader>

        {artist.socials.length > 0 ?
          <>
            {socialsElements}
          </> : <Paragraph>
            This artist did not provide any socials!
          </Paragraph>}
      </StaticPage>
    );
  } else if (isLoading) {
    response = <StaticPage><Header>Loading...</Header></StaticPage>;
  }

  return response;
};

export default SingleArtist;
