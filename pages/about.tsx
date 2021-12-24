import type {NextPage} from "next";
import Head from "next/head";
import Link from "next/link";
import StaticPage, {
  Header,
  ListItem,
  Paragraph,
  SubHeader,
  UnorderedList
} from "../components/typography";

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const About: NextPage = () => {
  return (
    <StaticPage>
      <Head>
        <title>2022 Design Refresh</title>

        <meta name="description" content="To be rewritten." />
      </Head>

      <Header>
        About <span className={"hidden sm:inline-block"}>the Refresh</span>
      </Header>

      <Paragraph>
        Following the success of the 2021 Design Refresh, the sequel - the 2022 Design Refresh -
        is a community-centered weekly creative art challenge.
      </Paragraph>

      <Paragraph>
        It runs from the <b>1st January 2022</b> to ??? and <b>accepts submissions from all
        creative media</b>!
      </Paragraph>

      <Paragraph>
        Many creators work to create submissions according to a theme every week. At the end of
        each week, <b>a showcase by CindryTuna (AKA FiveClawD)</b> will broadcast live on
        Twitch for the community to enjoy.
      </Paragraph>

      <Paragraph>
        The hashtag for the Refresh is <b>#2022DesignRefresh</b>.
      </Paragraph>

      <SubHeader>
        Our Team
      </SubHeader>

      <Paragraph>
        This project was produced and sponsored by <b>Inkling Interactive</b>.
      </Paragraph>

      <UnorderedList>
        <ListItem>
          <b>UX Design</b>: <Link href={"/artists/cindrytuna"}>FiveClawD</Link>
        </ListItem>
        <ListItem>
          <b>Engineering</b>: <Link href={"/artists/papapastry"}>papapastry</Link>
        </ListItem>
      </UnorderedList>

      <Paragraph>
        Thanks also to the various co-hosts on the weekly Friday showcases!
      </Paragraph>
    </StaticPage>
  );
};

export default About;
