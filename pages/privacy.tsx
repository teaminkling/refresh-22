import type {NextPage} from "next";
import {NextSeo} from "next-seo";
import Head from "next/head";
import StaticPage, {Header, Paragraph, SubHeader} from "../components/typography";
import {DEFAULT_DESCRIPTION, DEFAULT_IMAGE} from "../data/constants/setup";

const Privacy: NextPage = () => {
  return (
    <StaticPage>
      <Head>
        <title>Privacy - Design Refresh</title>
      </Head>

      <NextSeo
        title={"Privacy - Design Refresh"}
        description={DEFAULT_DESCRIPTION}
        canonical={`${process.env.NEXT_PUBLIC_BASE_URI}/privacy`}
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

      <Header>
        Privacy <span className={"hidden sm:inline-block"}>Policy</span>
      </Header>

      <Paragraph>
        This website was developed, produced, and sponsored by Inkling Interactive.
      </Paragraph>

      <SubHeader>
        Jurisdiction
      </SubHeader>

      <Paragraph>
        The Design Refresh web page complies with the Australian Privacy Act of 1988.
      </Paragraph>

      <SubHeader>
        Policy
      </SubHeader>

      <Paragraph>
        We will never collect personally identifying information beyond what is necessary for our
        products and services to function effectively and continuously as determined by the
        technical team.
      </Paragraph>

      <Paragraph>
        This includes (but is not limited to): browser information, country-level geolocation
        information, and IP address. Generally speaking, we need to know the volume of users to the
        site and whether those users are legitimate.
      </Paragraph>

      <SubHeader>
        Divulging Data
      </SubHeader>

      <Paragraph>
        We will never sell nor share our users&apos; information with or without their permission
        unless legally required.
      </Paragraph>

      <SubHeader>
        Security
      </SubHeader>

      <Paragraph>
        We encourage penetration testers to prod our services, decompile works, or otherwise exploit
        our services with the strict requirement to divulge. Divulge exploits to us and give us a
        reasonable amount of time (at least 30 days) to patch the security flaw.
      </Paragraph>

      <Paragraph>
        We are a small team so all we can give is gratitude, but we will be transparent: once
        something is patched, and it is not a risk to divulge, we will make a public post informing
        people of a patched flaw (if applicable). We will give you credit as you desire.
      </Paragraph>
    </StaticPage>
  );
};

export default Privacy;
