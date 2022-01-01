import type {NextPage} from "next";
import {RefreshHead} from "../components/head";
import {Header, Paragraph} from "../components/typography";

/**
 * The home page/gallery.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Home: NextPage = () => {
  // noinspection JSMismatchedCollectionQueryUpdate
  const items: JSX.Element[] = [];

  const mainContent = items.length > 0 ? (
    <div className={"mx-2 my-2 md:mr-5"}>
      <></>
    </div>
  ) : (
    <div className={"flex items-center justify-center h-full"}>
      <div className={"text-center pt-4 pb-16"}>
        <div className={"m-auto p-4 mt-12 md:mt-0"} style={{maxWidth: "256px"}}>
          <img
            src={"/logo/full_logo.png"}
            alt={"The full logo of the Design Refresh as a placeholder."}
            className={"m-auto rotate-forever"}
          />
        </div>

        <div className={"pt-4"} />

        <Header>
          Welcome!
        </Header>

        <Paragraph>
          Nobody has submitted anything yet.
        </Paragraph>

        <Paragraph>
          Perhaps you&apos;ll be the first?
        </Paragraph>
      </div>
    </div>
  );

  return (
    <>
      <RefreshHead subTitle={"Gallery"} description={
        "The 2022 Design Refresh is a weekly design/art/creative challenge hosted on Twitch by " +
        "CindryTuna AKA FiveClawD, sponsored by Inkling Interactive."
      } />
      {mainContent}
    </>
  );
};

export default Home;
