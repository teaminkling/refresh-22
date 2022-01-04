/**
 * The submission form.
 */
import StaticPage, {ListItem, Paragraph, SubHeader, UnorderedList} from "../components/typography";

const BetaInfo = () => {
  return (
    <StaticPage>
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
        <ListItem><b>Ability to sort and filter the gallery.</b></ListItem>
        <ListItem><b>Add a better single post view allowing zoom and pinch.</b></ListItem>
        <ListItem><b>Ability to edit works after posting them.</b></ListItem>
        <ListItem><b>Add a call to action with the theme on the front page.</b></ListItem>
        <ListItem>Optimise images so they don&apos;t use up too much bandwidth.</ListItem>
        <ListItem>A nicer drag-and-drop interface for editing socials.</ListItem>
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
