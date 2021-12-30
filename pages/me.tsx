import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {GetServerSideProps} from "next";
import StaticPage, {Header, Paragraph} from "../components/typography";

/**
 * Retrieve information on every request as props for the {@link Me} page.
 */
export const getServerSideProps: GetServerSideProps<MeProps> = async () => {
  return {
    props: {
      username: "papapastry",
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
}

/**
 * A page for a signed-in user to edit their profile.
 *
 * @param {MeProps} props the props
 * @returns {JSX.Element} the element
 * @constructor
 */
const Me = (props: MeProps): JSX.Element => {
  const {
    user, isLoading, isAuthenticated
  }: Auth0ContextInterface = useAuth0();

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
        <Header>
          <img src={thumbnailUrl} alt={"The user's thumbnail URL."} />
          {props.username}
        </Header>
        <Paragraph>
          <b>ID:</b> {id}
        </Paragraph>
        <Paragraph>
          <pre>
            {user?.toString()}
          </pre>
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
