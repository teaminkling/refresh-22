/**
 * The submission form.
 */
import Head from "next/head";
import StaticPage, {ListItem, Paragraph, SubHeader, UnorderedList} from "../components/typography";

const BetaInfo = () => {
  return (
    <StaticPage>
      <Head>
        <title>Beta - Design Refresh</title>
      </Head>

      <img
        src={"/art/404.png"}
        alt={"Refresh!"}
        className={"md:pt-10 w-60 object-cover m-auto pb-4 md:m-0"}
      />

      <h1 className={"text-5xl font-bold py-3"}>
        Beta Version
      </h1>

      <SubHeader>What does that mean?</SubHeader>

      <Paragraph>
        It means the site is in a usable state, but many of the quality-of-life and extra features
        planned for it have not yet been implemented by Inkling Interactive.
      </Paragraph>

      <Paragraph>
        A few of these features were planned after seeing how artists and viewers would use them in
        the coming weeks, and some of them just weren&apos;t ready for prime time when the deadline
        hit.
      </Paragraph>

      <SubHeader>What&apos;s coming?</SubHeader>

      <Paragraph>
        In (mostly) order of priority, the <i>public</i> features coming up are:
      </Paragraph>

      <UnorderedList>
        <ListItem>Display artists correctly and consolidate them daily.</ListItem>
        <ListItem>A nicer drag-and-drop interface for editing socials.</ListItem>
        <ListItem>Display individual work galleries by maintaining aspect ratio.</ListItem>
        <ListItem>Make the weeks page more usable.</ListItem>
        <ListItem>Stop flashing a 404 before loading a page.</ListItem>
      </UnorderedList>

      <Paragraph>
        Once all of the above have been completed, the site will go out of beta into a stable
        release. Note that additional features outside of the above may still be added even after
        finishing the beta phase.
      </Paragraph>

      <Paragraph>
        If you have a suggestion/need help, please contact <b>papapastry#8888</b> on Discord!
      </Paragraph>
    </StaticPage>
  );
};

export default BetaInfo;
