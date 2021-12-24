import type {NextPage} from "next";
import Head from "next/head";
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
const Guide: NextPage = () => {
  return (
    <StaticPage>
      <Head>
        <title>2022 Design Refresh - Participant Guide</title>

        <meta name="description" content="To be rewritten." />
      </Head>

      <Header>
        Participant Guide
      </Header>

      <Paragraph>
        The first thing you should do is join the official Discord!
      </Paragraph>

      <Paragraph>
        If you do not have a Discord account, note that you will need one to log into this site.
      </Paragraph>

      <SubHeader>
        Dates/Times
      </SubHeader>

      <Paragraph>
        All dates and times are localised to: <b>Melbourne/Australia (AEDT before April 3rd, AEST
        after)</b>.
      </Paragraph>

      <Paragraph>
        Submit by <b>Friday 11:59 PM (23:59) Melbourne Time</b>.
      </Paragraph>

      <Paragraph>
        New themes are released on <b>Saturday 8:00 PM (20:00) Melbourne Time</b>.
      </Paragraph>

      <SubHeader>
        Making a Submission
      </SubHeader>

      <Paragraph>
        Use the web form (when logged in) to make a submission for a week. You can submit
        multiple times a week and you can submit anything you want!
      </Paragraph>

      <Paragraph>
        We do ask that you mention what medium you used to create your work, though. We also
        strongly recommend creating a description for your piece to be displayed next to your
        work.
      </Paragraph>

      <Paragraph>
        Keep in mind:
      </Paragraph>

      <UnorderedList>
        <ListItem>
          Posts will need to be approved by moderators before they appear on the front page.
        </ListItem>
        <ListItem>
          Cindy can see all content for showcases even if the post is not approved.
        </ListItem>
      </UnorderedList>

      <Paragraph>
        Still, this is not a competition. It is designed to be very chill. <b>If you&apos;re a bit
        late, submit anyway!</b>
      </Paragraph>

      <SubHeader>
        Rules
      </SubHeader>

      <Paragraph>
        All of the rules listed on the Discord need to be followed. Additionally:
      </Paragraph>

      <UnorderedList>
        <ListItem>No NSFW. Basically, no non-Twitch ToS stuff.</ListItem>
        <ListItem>Follow copyright law.</ListItem>
        <ListItem>Do not post permalinks to this site on your website or blog.</ListItem>
      </UnorderedList>

      <Paragraph>
        If in doubt, feel free to ask a mod!
      </Paragraph>

      <SubHeader>
        Legal
      </SubHeader>

      <Paragraph>
        You can read more in the Terms of Service and Privacy Policy. However, to summarise:
      </Paragraph>

      <UnorderedList>
        <ListItem>
          We follow Aussie law but we make efforts to follow EU and NA laws too.
        </ListItem>
        <ListItem>
          If you upload something or even link to it, {"you're"} saying {"\"this is mine\""}.
          You own rights to it, you give us rights to host it here, and maybe to write/edit a
          description for it.
        </ListItem>
      </UnorderedList>

      <SubHeader>
        Social Media
      </SubHeader>

      <Paragraph>
        Your socials are tied to your account. When logged in, you can edit them on your profile.
      </Paragraph>

      <Paragraph>
        <b>We strongly recommend adding your socials to your accounts</b>!
      </Paragraph>

      <SubHeader>
        Need help?
      </SubHeader>

      <Paragraph>
        Post your work in #discussions with the kind of advice you are seeking. Feel free to
        discuss your work!
      </Paragraph>

      <Paragraph>
        Check #resources for tutorials and references related to the theme every week! You can
        also see them on this website here.
      </Paragraph>
    </StaticPage>
  );
};

export default Guide;
