import { Helmet } from "react-helmet-async";

import { ListItem, Paragraph, StaticPage, SubHeader, UnorderedList } from "../../components/markup/typography.tsx";

export default function About() {
  return (
    <>
      <Helmet>
        <title>{"About | Design Refresh '22"}</title>
      </Helmet>

      <StaticPage>
        <img
          src="/img/art/about.png"
          alt="art for the about page"
          className="md:pt-10 w-60 object-cover m-auto pb-4 md:m-0"
        />

        <h1 className="text-5xl font-bold py-3">
          About <span className="hidden lg:inline-block">the Refresh</span>
        </h1>

        <Paragraph>The sequel to the 2021 Design Refresh: the 2022 Design Refresh!</Paragraph>

        <Paragraph>
          In short, the Refresh was a community-centered weekly creative art challenge. All were welcome to participate!
        </Paragraph>

        <UnorderedList>
          <ListItem>
            <b>Started on:</b> 2nd January 2022
          </ListItem>

          <ListItem>
            <b>Ran for:</b> 16 weeks
          </ListItem>

          <ListItem>
            <b>Accepted:</b> 🎨 Digital/traditional art, 🎵 music, 🎥 videos, and more!
          </ListItem>
        </UnorderedList>

        <Paragraph>
          Every weekend, <b>CindryShoo</b> broadcasted all of the submissions on Twitch.
        </Paragraph>

        <Paragraph>
          The hashtag for the Refresh was <b>#2022DesignRefresh</b>.
        </Paragraph>

        <SubHeader>Behind the Scenes</SubHeader>

        <Paragraph>
          This project was produced and sponsored by <b>Inkling Interactive</b>.
        </Paragraph>

        <img
          src="/img/logos/inkling-banner.png"
          alt="the sole sponsor Inkling Interactive's banner"
          className="w-96 p-8"
        />

        <UnorderedList>
          <ListItem>
            <b>Design</b>: {'Cindy "cindryshoo" Xu (she/her)'}
          </ListItem>
          <ListItem>
            <b>Engineering</b>: {'Thomas "papapastry" Wang (he/him)'}
          </ListItem>
        </UnorderedList>
      </StaticPage>
    </>
  );
}
