import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {TextareaInput, TextInput} from "../components/forms";
import InterfaceLink from "../components/interface-link";
import StaticPage, {
  Header,
  ListItem,
  Paragraph,
  SubHeader,
  UnorderedList
} from "../components/typography";
import Artist from "../data/core/Artist";
import {ArtistState, RootState} from "../store/state";
import {updateArtists} from "../utils/connectors";

/**
 * Send a request to the backend.
 *
 * @param {string} token the auth token
 * @param {string} discordId the discord ID
 * @param {string} name the username
 * @param {string} thumbnailUrl the thumbnail URL
 * @param {string[]} socials the socials
 */
const sendArtistUpdateRequest = async (
  token: string,
  discordId: string,
  name?: string,
  thumbnailUrl?: string,
  socials?: string[],
): Promise<void> => {
  if (!name) {
    return alert("You didn't provide a name!");
  }

  if (!thumbnailUrl) {
    return alert("Failed to fetch thumbnail. Please contact papapastry#8888 on Discord.");
  }

  const effectiveSocials = socials || [];

  const data: Artist = {
    discordId: discordId,
    name: name,
    thumbnailUrl: thumbnailUrl,
    socials: effectiveSocials,
  };

  const response = await fetch(
    "http://127.0.0.1:8787/api/artist",
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (response.ok) {
    alert("Done! Please check back in 24 hours.");
  } else {
    alert(
      `Something went wrong!\n\n${response.status}: ${response.statusText}\n\nPlease send the ` +
      "above message to papapastry#8888 when reporting this fault."
    );
  }
};

/**
 * A page for a signed-in user to edit their profile.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Me = (): JSX.Element => {
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
  const artistsData: ArtistState = useSelector(
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

  updateArtists(dispatch, artistsData);

  if (isAuthenticated) {
    const idParts: string[] = user?.sub?.split("|") || [];
    const id: string = idParts ? idParts[idParts.length - 1] : "Unknown";

    existingUsername.current = artistsData.artists[id]?.data.name || "Unknown User";

    const thumbnailUrl: string = (
      user?.picture || `https://placem.at/things?w=512&h=512&random=${id}`
    );

    // Retrieve from the cache.

    view = (
      <>
        <img src={thumbnailUrl} alt={"The user's thumbnail URL."} className={"pt-8"} />

        <Header>
          {existingUsername.current || user?.name || "undefined"}
        </Header>

        <Paragraph>
          <b>Discord ID:</b> {id}
        </Paragraph>

        <SubHeader>
          Edit Profile
        </SubHeader>

        <Paragraph>
          <b>Note:</b> Changes made here can take up to a day to appear on the site.
        </Paragraph>

        <Paragraph>
          <b>Warning!</b> Editing your username can have unexpected consequences.
        </Paragraph>

        <UnorderedList>
          <ListItem>Your links might not work anymore.</ListItem>
          <ListItem>
            Some people might not be able to find you on the site for up to 24 hours.
          </ListItem>
        </UnorderedList>

        <Paragraph>
          Editing socials should be fairly straightforward, however.
        </Paragraph>

        <form className={"mt-6"}>
          <div className={"mb-4"}>
            <TextInput
              passedRef={nameInput}
              id={"name"}
              placeholder={existingUsername.current}
              label={"Change Username"}
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
              await sendArtistUpdateRequest(
                await getAccessTokenSilently(),
                id,
                nameInput.current?.value || existingUsername.current,
                user?.picture,
                socialsInput.current?.value.split("\n"),
              );
            }}
          />

          <SubHeader>
            View Profile
          </SubHeader>

          <InterfaceLink
            title={"Go To Public Profile"}
            location={`/artists/${existingUsername.current}`}
            nextLink
          />

          <SubHeader>
            View Your Works
          </SubHeader>

          <InterfaceLink
            title={"Go To Gallery with Filter"}
            location={`/?artist=${existingUsername.current}`}
            nextLink
          />
        </form>
      </>
    );
  } else if (isLoading) {
    view = (
      <>
        <Header>
          Loading
        </Header>
        <Paragraph>
          Please wait...
        </Paragraph>
      </>
    );
  }

  return (
    <StaticPage>
      {view}
    </StaticPage>
  );
};

export default Me;
