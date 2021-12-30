import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import InterfaceLink from "../../components/interface-link";
import StaticPage, {Header, Paragraph, SubHeader} from "../../components/typography";
import Artist from "../../data/core/Artist";
import {ArtistState, RootState} from "../../store/state";
import {updateArtists} from "../../utils/connectors";
import {ParsedSocial, parseSocial} from "../../utils/socials";

/**
 * A component that retrieves an existing user.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const GetArtist = (): JSX.Element => {
  const {user}: Auth0ContextInterface = useAuth0();

  const userParts: string[] = user?.sub?.split("|") || [];
  const userId: string = userParts.length > 0 ? userParts[userParts.length - 1] : "";

  const router = useRouter();
  const query: ParsedUrlQuery = router.query;

  let id: string | string[] | undefined = query.id;

  let response: JSX.Element = <></>;

  const dispatch: Dispatch = useDispatch();
  const artistsData: ArtistState = useSelector(
    (state: RootState) => state.artistsData,
  );

  useEffect(() => {
    updateArtists(dispatch, artistsData);
  }, []);

  // Now that we know for sure that there are some artists, we try to fetch the one here.

  if (id) {
    if (typeof id !== "string") {
      id = id.toString();
    }

    const discordId: string | undefined = artistsData.usernameToId[id];

    if (!discordId) {
      // User isn't in KV yet.

      response = (
        <div className={"flex items-center justify-center h-full"}>
          <div className={"text-center pb-16"}>
            <img
              src={"/art/user404.png"}
              alt={"A lost user."}
              className={"w-96 pt-16 m-auto"}
            />
            <Header>
              Artist 404
            </Header>
            <SubHeader>
              Can&apos;t find that user!
            </SubHeader>
            <Paragraph>
              Are they still being processed?
            </Paragraph>
            <Paragraph>
              That can take up to 24 hours.
            </Paragraph>
          </div>
        </div>
      );
    } else {
      // User was found.

      const artist: Artist = artistsData.artists[discordId].data;

      const socialsElements: JSX.Element[] = [];
      artist.socials.forEach((socialUrl: string) => {
        const parsedSocial: ParsedSocial = parseSocial(socialUrl);

        // noinspection HttpUrlsUsage
        socialsElements.push(
          <div className={"hover:bg-gray-100"}>
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
          <img src={artist.thumbnailUrl} alt={"The user's thumbnail URL."} className={"pt-8"} />
          <Header>
            {id}
          </Header>

          <Paragraph>
            <b>Discord ID:</b> {artist.discordId}
          </Paragraph>

          {
            userId === artist.discordId ?
              <>
                <SubHeader>Edit Profile</SubHeader>
                <InterfaceLink title={"Edit Profile"} location={"/me"} nextLink />
              </> : null
          }

          <SubHeader>
            View Works
          </SubHeader>

          <InterfaceLink
            title={"View Filtered Gallery"}
            location={`/?artist=${id}`}
            nextLink
          />

          <SubHeader>
            Social Media
          </SubHeader>

          {artist.socials.length > 0 ?
            <>
              {socialsElements}
            </> : <Paragraph>
              This artist does not have any socials yet!
            </Paragraph>}
        </StaticPage>
      );
    }
  }

  // First, we need to check that the artist actually exists.

  return response;
};

export default GetArtist;
