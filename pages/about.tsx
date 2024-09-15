import type {NextPage} from "next";
import {NextSeo} from "next-seo";
import Head from "next/head";
import StaticPage, {ListItem, Paragraph, SubHeader, UnorderedList} from "../components/typography";
import {DEFAULT_DESCRIPTION, DEFAULT_IMAGE} from "../data/constants/setup";

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About - Design Refresh</title>
      </Head>

      <NextSeo
        title={"About - Design Refresh"}
        description={DEFAULT_DESCRIPTION}
        canonical={`${process.env.NEXT_PUBLIC_BASE_URI}/about`}
        openGraph={{
          type: "website",
          site_name: "Design Refresh",
          images: [
            {
              url: DEFAULT_IMAGE,
            }
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />

      <StaticPage>
        <img
          src={"/art/about.png"}
          alt={"Refresh!"}
          className={"md:pt-10 w-60 object-cover m-auto pb-4 md:m-0"}
        />

        <h1 className={"text-5xl font-bold py-3"}>
          About <span className={"hidden lg:inline-block"}>the Refresh</span>
        </h1>

        <Paragraph>
          The sequel to the 2021 Design Refresh is the (2022) Design Refresh!
        </Paragraph>

        <Paragraph>
          In short, it&apos;s a community-centered weekly creative art challenge. All are welcome!
        </Paragraph>

        <UnorderedList>
          <ListItem>
            <b>Starts on:</b> 2nd January 2022
          </ListItem>

          <ListItem>
            <b>Runs for:</b> 16 weeks
          </ListItem>

          <ListItem>
            <b>Accepts:</b> 🎨 Digital/traditional art, 🎵 music, 🎥 videos, and more!
          </ListItem>
        </UnorderedList>

        <Paragraph>
          Every weekend, <b>CindryTuna</b> will broadcast all of the submissions on Twitch!
        </Paragraph>

        <UnorderedList>
          <ListItem>
            <b>AEDT</b>: Saturday 12 PM
          </ListItem>
          <ListItem>
            <b>EST</b>: Friday 8 PM
          </ListItem>
          <ListItem>
            <b>PST</b>: Friday 5 PM
          </ListItem>
          <ListItem>
            <b>GMT</b>: Saturday 1 AM
          </ListItem>
          <ListItem>
            <b>J/KST</b>: Saturday 10 AM
          </ListItem>
        </UnorderedList>

        <Paragraph>
          The hashtag for the Refresh this year is <b>#2022DesignRefresh</b>.
        </Paragraph>

        <SubHeader>
          Behind the Scenes
        </SubHeader>

        <Paragraph>
          This project was produced and sponsored by <b>Inkling Interactive</b>.
        </Paragraph>

        <img
          src={"/additional/inkling-banner.png"}
          alt={"The sponsor's banner."}
          className={"w-96 p-8"}
        />

        <UnorderedList>
          <ListItem>
            <b>Design</b>: Cindy &quot;cindrytuna&quot; Xu (she/her)
          </ListItem>
          <ListItem>
            <b>Engineering</b>: Thomas &quot;papapastry&quot; Wang (he/him)
          </ListItem>
        </UnorderedList>
      </StaticPage>
    </>
  );
};

export default About;
