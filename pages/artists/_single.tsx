import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import InterfaceLink from "../../components/interface-link";
import StaticPage, {Header, Paragraph, SubHeader} from "../../components/typography";
import Artist from "../../data/core/Artist";
import {ArtistsState, RootState} from "../../store/state";
import {updateArtists} from "../../utils/connectors";
import {ParsedSocial, parseSocial} from "../../utils/socials";

/**
 * The props for a single artist.
 */
interface SingleArtistProps {
  name: string;
}

/**
 * A component that retrieves an existing user.
 *
 * @param {SingleArtistProps} props the props
 * @returns {JSX.Element} the element
 * @constructor
 */
const SingleArtist = (props: SingleArtistProps): JSX.Element => {
  const nameFromParam: string = props.name;

  const {user}: Auth0ContextInterface = useAuth0();

  const _userParts: string[] = user?.sub?.split("|") || [];
  const idFromAuth0: string = _userParts.length > 0 ? _userParts[_userParts.length - 1] : "";

  const artistsData: ArtistsState = useSelector(
    (state: RootState) => state.artistsData,
  );

  // Update artists cache if necessary.

  const dispatch: Dispatch = useDispatch();
  useEffect(() => {
    updateArtists(dispatch, artistsData);
  }, []);

  // Now that we know for sure that there are some artists, we try to fetch the one here.

  const router = useRouter();

  if (nameFromParam === "me") {
    router.push({
      pathname: "/artists",
      query: {name: encodeURI(artistsData.artists[idFromAuth0]?.name || "unknown")}
    }).then();
  }

  const discordId: string | undefined = artistsData.usernameToId[nameFromParam];

  // Start to build a response.

  let response: JSX.Element;

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

    const artist: Artist = artistsData.artists[discordId];

    const socialsElements: JSX.Element[] = [];
    artist.socials.forEach((socialUrl: string) => {
      const parsedSocial: ParsedSocial = parseSocial(socialUrl);

      // noinspection HttpUrlsUsage
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
        <img src={artist.thumbnailUrl} alt={"The user's thumbnail URL."} className={"pt-8"} />
        <Header>
          {nameFromParam}
        </Header>

        <Paragraph>
          <b>Discord ID:</b> {artist.discordId}
        </Paragraph>

        {
          idFromAuth0 === artist.discordId ?
            <>
              <InterfaceLink title={"Edit Profile"} location={"/artists/edit"} nextLink />
            </> : null
        }

        <InterfaceLink
          title={"View Filtered Gallery"}
          location={`/?artist=${nameFromParam}`}
          nextLink
        />

        <SubHeader>Social Media</SubHeader>

        {artist.socials.length > 0 ?
          <>
            {socialsElements}
          </> : <Paragraph>
            This artist does not have any socials yet!
          </Paragraph>}
      </StaticPage>
    );
  }

  // First, we need to check that the artist actually exists.

  return response;
};

export default SingleArtist;
