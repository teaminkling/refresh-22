import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {GetServerSideProps} from "next";
import {useRef} from "react";
import {TextareaInput, TextInput} from "../components/forms";
import InterfaceLink from "../components/interface-link";
import StaticPage, {Header, Paragraph, SubHeader} from "../components/typography";

/**
 * Retrieve information on every request as props for the {@link Me} page.
 */
export const getServerSideProps: GetServerSideProps<MeProps> = async () => {
  return {
    props: {
      username: "papapastry",
      socials: [
        "https://twitter.com/__paced__",
        "https://instagram.com/tomw_ng",
      ]
    },
  };
};

/**
 * Props for the {@link Me} page.
 */
interface MeProps {
  /**
   * A user's name.
   */
  username: string;

  /**
   * A user's socials as a list of URLs.
   */
  socials: string[];
}

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

  const response = await fetch(
    "http://127.0.0.1:8787/api/artist",
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(
        {
          discordId: discordId,
          name: name,
          thumbnailUrl: thumbnailUrl,
          socials: effectiveSocials,
        }
      )
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
 * @param {MeProps} props the props
 * @returns {JSX.Element} the element
 * @constructor
 */
const Me = (props: MeProps): JSX.Element => {
  const {
    user, isAuthenticated, getAccessTokenSilently
  }: Auth0ContextInterface = useAuth0();

  const nameRef = useRef<HTMLInputElement>(null);
  const socialsRef = useRef<HTMLTextAreaElement>(null);

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

  if (isAuthenticated) {
    const idParts: string[] = user?.sub?.split("|") || [];

    const id: string = idParts ? idParts[idParts.length - 1] : "Unknown";
    const thumbnailUrl: string = (
      user?.picture || `https://placem.at/things?w=512&h=512&random=${id}`
    );

    view = (
      <>
        <img src={thumbnailUrl} alt={"The user's thumbnail URL."} className={"pt-8"} />
        <Header>
          {props.username || user?.name || "undefined"}
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
        <form className={"mt-6"}>
          <div className={"mb-4"}>
            <TextInput
              passedRef={nameRef}
              id={"name"}
              placeholder={props.username || user?.name || "undefined"}
              label={"Change Username"}
              initialValue={props.username || user?.name || "undefined"}
            />
          </div>
          <div className={"mb-4"}>
            <TextareaInput
              passedRef={socialsRef}
              id={"socials"}
              label={"Edit Socials (one per line)"}
              initialValue={props.socials.join("\n")}
            />
          </div>
          <InterfaceLink
            location={"#"}
            title={"Send"}
            clickBack={async () => {
              await sendArtistUpdateRequest(
                await getAccessTokenSilently(),
                id,
                nameRef.current?.value || props.username || user?.name,
                user?.picture,
                socialsRef.current?.value.split("\n"),
              );
            }}
          />
          <SubHeader>
            View Profile
          </SubHeader>
          <InterfaceLink
            title={"Go To Public Profile"}
            location={`/artists/${props.username}`}
            nextLink
          />
          <SubHeader>
            View Your Works
          </SubHeader>
          <InterfaceLink
            title={"Go To Gallery with Filter"}
            location={`/?artist=${props.username}`}
            nextLink
          />
        </form>
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
