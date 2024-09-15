import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {faAngleDown, faAngleRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NextSeo} from "next-seo";
import Head from "next/head";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import InterfaceLink from "../../components/interface-link";
import {Markdown} from "../../components/markdown";
import StaticPage, {Header, Paragraph, SubHeader} from "../../components/typography";
import {DEFAULT_DESCRIPTION, DEFAULT_IMAGE} from "../../data/constants/setup";
import Week from "../../data/core/Week";
import {RootState, WeeksState} from "../../store/state";
import {fetchWeeks} from "../../utils/connectors";

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const Weeks = () => {
  const [isWeeksExpanded, setIsWeeksExpanded] = useState<boolean>(false);

  const dispatch: Dispatch = useDispatch();
  const weeksData: WeeksState = useSelector(
    (state: RootState) => state.weeksData,
  );

  // Check that the user is allowed to see the edit button.

  const {user, isLoading, getAccessTokenSilently}: Auth0ContextInterface = useAuth0();

  const [isApiLoading, setIsApiLoading] = useState<boolean>(true);
  useEffect(() => {
    if (user) {
      getAccessTokenSilently().then(
        (token: string) => fetchWeeks(dispatch, weeksData, token)
      );
    } else {
      fetchWeeks(dispatch, weeksData, undefined).then();
    }

    setIsApiLoading(false);
  }, []);

  // Gather weeks data and populate some divs.

  const weeksDivs: JSX.Element[] = [];
  let currentWeekDiv: JSX.Element = <></>;

  Object.values(weeksData.weeks).filter((week: Week) => week.isPublished).forEach(
    (week: Week) => {
      const newDiv: JSX.Element = (
        <div key={week.week}>
          <h3 className={"text-xl font-bold py-2 pt-3"}>
            Week {week.week}: {week.theme}
          </h3>

          <Markdown markdown={week.information} />

          <InterfaceLink location={`/?week=${week.week}`} nextLink title={"Filter by Week"} />
        </div>
      );

      weeksDivs.push(newDiv);

      currentWeekDiv = newDiv;
    }
  );

  let response;
  if (weeksDivs.length > 0) {
    response = (
      <>
        <Head>
          <title>Weeks - Design Refresh</title>
        </Head>
        <StaticPage>
          <Header>Viewing Weeks</Header>

          <SubHeader>
            Current Week
          </SubHeader>

          {currentWeekDiv}

          <SubHeader>
            All Weeks
          </SubHeader>

          <InterfaceLink
            location={"#"}
            title={`${isWeeksExpanded ? "Hide" : "Show"} All Weeks`}
            icon={
              isWeeksExpanded ? <FontAwesomeIcon icon={faAngleDown} />
                : <FontAwesomeIcon icon={faAngleRight} />
            }
            clickBack={async () => setIsWeeksExpanded(!isWeeksExpanded)}
          />

          <div className={isWeeksExpanded ? "" : "hidden"}>
            {weeksDivs}
          </div>
        </StaticPage>
      </>
    );
  } else if (isLoading || isApiLoading) {
    response = <StaticPage><Header>Loading...</Header></StaticPage>;
  } else {
    response = (
      <div className={"flex items-center justify-center h-full"}>
        <div className={"text-center pb-16"}>
          <img
            src={"/art/user404.png"}
            alt={"A lost user."}
            className={"w-96 pt-16 m-auto"}
          />
          <Header>
            Hold up!
          </Header>
          <SubHeader>
            None of the weeks have been released yet.
          </SubHeader>
          <Paragraph>
            The prompt will be up soon (i.e., once Cindy figures out how to use the site).
          </Paragraph>
        </div>
      </div>
    );
  }

  return <>
    <Head>
      <title>Weeks - Design Refresh</title>
    </Head>

    <NextSeo
      title={"Weeks - Design Refresh"}
      description={DEFAULT_DESCRIPTION}
      canonical={`${process.env.NEXT_PUBLIC_BASE_URI}/weeks`}
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

    {response}
  </>;
};

export default Weeks;
