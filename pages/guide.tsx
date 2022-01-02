import type {NextPage} from "next";
import StaticPage, {ListItem, Paragraph, SubHeader, UnorderedList} from "../components/typography";

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const Guide: NextPage = () => {
  return (
    <StaticPage>
      <img
        src={"/art/guide.png"}
        alt={"An artist placing a completed work in the gallery."}
        className={"md:pt-10 w-60 object-cover m-auto pb-4 md:m-0"}
      />

      <h1 className={"text-5xl font-bold py-3"}>
        Participants Guide
      </h1>

      <Paragraph>
        The first thing you should do is&nbsp;
        <a href={"https://discord.gg/NuUB469UXM"}
           target={"_blank"}
           rel={"noreferrer"}
           style={{color: "#7C7CE0"}}
           className={"hover:underline"}
        >
          join the official Discord
        </a>!
      </Paragraph>

      <Paragraph>
        The rules there are the rules here, and you can use many of the channels to chat, get help,
        and discuss the Refresh! It is also there for limited tech support of this website.
      </Paragraph>

      <SubHeader>
        Dates/Times
      </SubHeader>

      <Paragraph>
        All dates and times are localised to: <b>Australia/Melbourne (AEDT)</b>.
      </Paragraph>

      <UnorderedList>
        <ListItem>
          <b>Submit by:</b> Saturday 12 PM
        </ListItem>
        <ListItem>
          <b>Showcase at:</b> Saturday 12 PM
        </ListItem>
        <ListItem>
          <b>New themes at:</b> Sunday 12 PM
        </ListItem>
      </UnorderedList>

      <Paragraph>
        If in doubt, use the site countdown!
      </Paragraph>

      <SubHeader>
        Making a Submission
      </SubHeader>

      <Paragraph>
        Log in to use the web form to make a submission for a week. You can submit multiple times
        a week if you like, and you can submit anything you want!
      </Paragraph>

      <Paragraph>
        This is not a competition. It is designed to be very chill; <b>if you&apos;re a bit late,
        submit anyway!</b>
      </Paragraph>
    </StaticPage>
  );
};

export default Guide;
