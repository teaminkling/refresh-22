import type {NextPage} from "next";
import Head from "next/head";

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const Guide: NextPage = () => {
  return (
    <div className={"mx-8 my-4"}>
      <Head>
        <title>2022 Design Refresh - Participant Guide</title>

        <meta name="description" content="To be rewritten." />
      </Head>

      <div className={"text-xl p-8"} style={{maxWidth: 1024}}>
        <h1 className={"text-6xl py-3"}>
          Guide for Participants
        </h1>

        <p className={"py-3"}>
          The first thing you should do is join the official Discord!
        </p>

        <p className={"py-3"}>
          If you do not have a Discord account, note that you will need one to log into this site.
        </p>

        <h2 className={"text-4xl py-3"}>
          Dates/Times
        </h2>

        <p className={"py-3"}>
          All dates and times are localised to: <b>Melbourne/Australia (AEDT before April 3rd, AEST
          after)</b>.
        </p>

        <p className={"py-3"}>
          Submit by <b>Friday 11:59 PM (23:59) Melbourne Time</b>.
        </p>

        <p className={"py-3"}>
          New themes are released on <b>Saturday 8:00 PM (20:00) Melbourne Time</b>.
        </p>

        <h2 className={"text-4xl py-3"}>
          Making a Submission
        </h2>

        <p className={"py-3"}>
          Use the web form (when logged in) to make a submission for a week. You can submit
          multiple times a week and you can submit anything you want!
        </p>

        <p className={"py-3"}>
          We do ask that you mention what medium you used to create your work, though. We also
          strongly recommend creating a description for your piece to be displayed next to your
          work.
        </p>

        <p className={"py-3"}>
          Keep in mind:
        </p>

        <ul className={"list-disc px-6 py-3"}>
          <li>
            <p>
              Posts will need to be approved by moderators before they appear on the front page.
            </p>
          </li>
          <li>
            <p>
              Cindy can see all content for showcases even if the post is not approved.
            </p>
          </li>
        </ul>

        <p className={"py-3"}>
          Still, this is not a competition. It is designed to be very chill. <b>If you&apos;re a bit
          late, submit anyway!</b>
        </p>

        <h2 className={"text-4xl py-3"}>
          Rules
        </h2>

        <p className={"py-3"}>
          All of the rules listed on the Discord need to be followed. Additionally:
        </p>

        <ul className={"list-disc px-6 py-3"}>
          <li><p>No NSFW. Basically, no non-Twitch ToS stuff.</p></li>
          <li><p>Follow copyright law.</p></li>
          <li><p>Do not post permalinks to this site on your website or blog.</p></li>
        </ul>

        <p className={"py-3"}>
          If in doubt, feel free to ask a mod!
        </p>

        <h2 className={"text-4xl py-3"}>
          Legal
        </h2>

        <p className={"py-3"}>
          You can read more in the Terms of Service and Privacy Policy. However, to summarise:
        </p>

        <ul className={"list-disc px-6 py-3"}>
          <li>
            <p>We follow Aussie law but we make efforts to follow EU and NA laws too.</p>
          </li>
          <li>
            <p>
              If you upload something or even link to it, {"you're"} saying {"\"this is mine\""}.
              You own rights to it, you give us rights to host it here, and maybe to write/edit a
              description for it.
            </p>
          </li>
        </ul>

        <h2 className={"text-4xl py-3"}>
          Social Media
        </h2>

        <p className={"py-3"}>
          Your socials are tied to your account. When logged in, you can edit them on your profile.
        </p>

        <p className={"py-3"}>
          <b>We strongly recommend adding your socials to your accounts</b>!
        </p>

        <h2 className={"text-4xl py-3"}>
          Need help?
        </h2>

        <p className={"py-3"}>
          Post your work in #discussions with the kind of advice you are seeking. Feel free to
          discuss your work!
        </p>

        <p className={"py-3"}>
          Check #resources for tutorials and references related to the theme every week! You can
          also see them on this website here.
        </p>
      </div>

      <footer />
    </div>
  );
};

export default Guide;
