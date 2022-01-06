import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {ValidationError, ValidationResult} from "joi";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AnyAction} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {ResponseMessages} from "../../components/errors";
import {TextareaInput, TextInput} from "../../components/forms";
import InterfaceLink from "../../components/interface-link";
import StaticPage, {
  Header,
  ListItem,
  Paragraph,
  SubHeader,
  UnorderedList
} from "../../components/typography";
import Artist, {ARTIST_SCHEMA} from "../../data/core/Artist";
import {ArtistsState, RootState} from "../../store/state";
import {fetchArtists, putArtist} from "../../utils/connectors";

/**
 * Send a request to the backend and save it locally if it succeeds.
 *
 * @param {ArtistsState} artistsData the original artist state as it is known in the client
 * @param {ThunkDispatch} dispatch the dispatch
 * @param {string} token the auth token
 * @param {string} discordId the discord ID
 * @param {string} name the username
 * @param {string} thumbnailUrl the thumbnail URL
 * @param {string[]} socials the socials
 */
const sendArtistUpdateRequest = async (
  artistsData: ArtistsState,
  dispatch: ThunkDispatch<RootState, never, AnyAction>,
  token: string,
  discordId: string,
  name?: string,
  thumbnailUrl?: string,
  socials?: string[],
): Promise<JSX.Element> => {
  const errors: ValidationError[] = [];

  if (!name) {
    errors.push(new ValidationError("You didn't provide a name!", [], null));
  }

  if (!thumbnailUrl) {
    errors.push(new ValidationError(
      "Failed to fetch thumbnail. Please contact papapastry#8888 on Discord.",
      [],
      null,
    ));
  }

  if (name && thumbnailUrl) {
    // Perform frontend validation before even attempting a backend send.

    const data: Artist = {
      discordId: discordId,
      name: name,
      thumbnailUrl: thumbnailUrl,
      socials: socials || [],
    };

    const validation: ValidationResult = ARTIST_SCHEMA.validate(data);
    if (validation.error) {
      errors.push(validation.error);
    } else {
      await putArtist(dispatch, artistsData, token, data).then().catch((error: Error) => {
        errors.push(JSON.parse(error.message));
      });
    }
  }

  return <ResponseMessages
    errors={errors}
    specialMessage={(
      <p>
        <b>Note:</b> each URL must start with <code>https://</code> to be valid.
      </p>
    )}
    validityType={"social URL"}
  />;
};

/**
 * A page for a signed-in user to edit their profile.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Edit = (): JSX.Element => {
  const {
    user, isLoading, isAuthenticated, getAccessTokenSilently,
  }: Auth0ContextInterface = useAuth0();

  // HTML-based refs.

  const nameInput = useRef<HTMLInputElement>(null);
  const socialsInput = useRef<HTMLTextAreaElement>(null);

  // Primitive-based refs.

  const existingUsername = useRef<string>("Unknown User");
  const existingSocials = useRef<string[]>([]);

  // Handle the artist cache.

  const dispatch = useDispatch();
  const artistsData: ArtistsState = useSelector(
    (state: RootState) => state.artistsData,
  );

  // Determine the view depending on authentication status.

  let view: JSX.Element = (
    <>
      <Header>
        Not Logged In!
      </Header>
      <Paragraph>
        You are not logged in! Please log in on the sidebar to access your profile.
      </Paragraph>
    </>
  );

  const [messagesView, setMessagesView] = useState<JSX.Element>(<></>);

  useEffect(() => {
    fetchArtists(dispatch, artistsData);
  }, []);

  if (isAuthenticated) {
    const idParts: string[] = user?.sub?.split("|") || [];
    const id: string = idParts ? idParts[idParts.length - 1] : "Unknown";

    existingUsername.current = artistsData.artists[id]?.name || user?.name || "Unknown";
    existingSocials.current = artistsData.artists[id]?.socials || [];

    const thumbnailUrl: string = (
      user?.picture || `https://placem.at/things?w=512&h=512&random=${id}`
    );

    // Retrieve from the cache.

    view = (
      <>
        <img src={thumbnailUrl} alt={"The user's thumbnail URL."} className={"pt-8"} />

        <Header>
          {existingUsername.current}
        </Header>

        <Paragraph>
          <b>Discord ID:</b> {id}
        </Paragraph>

        <InterfaceLink
          title={"View Profile"}
          location={`/artists/${existingUsername.current}`}
          nextLink
        />

        <InterfaceLink
          title={"View Filtered Gallery"}
          location={`/?artist=${existingUsername.current}`}
          nextLink
        />

        <SubHeader>
          Edit Profile
        </SubHeader>

        <UnorderedList>
          <ListItem>
            Changes made here can take up to a day to appear on the site.
          </ListItem>
          <ListItem>
            <b>Warning:</b> Editing your username can have unexpected consequences.
          </ListItem>
        </UnorderedList>

        <form className={"mt-6"}>
          <div className={"mb-4"}>
            <TextInput
              passedRef={nameInput}
              id={"name"}
              placeholder={existingUsername.current}
              label={"Set Username"}
              initialValue={existingUsername.current}
            />
          </div>

          <div className={"mb-4"}>
            <TextareaInput
              passedRef={socialsInput}
              id={"socials"}
              label={"Edit Socials (one per line)"}
              initialValue={existingSocials.current.join("\n")}
            />
          </div>

          <InterfaceLink
            location={"#"}
            title={"Send"}
            clickBack={async () => {
              setMessagesView(<></>);

              const token = await getAccessTokenSilently();

              setMessagesView(
                await sendArtistUpdateRequest(
                  artistsData,
                  dispatch,
                  token,
                  id,
                  nameInput.current?.value || existingUsername.current,
                  user?.picture,
                  socialsInput.current?.value.trim().split("\n"),
                )
              );
            }}
          />
        </form>
      </>
    );
  } else if (isLoading) {
    view = <></>;
  }

  return (
    <StaticPage>
      {view}
      {messagesView}
    </StaticPage>
  );
};

export default Edit;
