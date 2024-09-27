import {faAngleDown, faAngleRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Head from "next/head";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import InterfaceLink from "../../components/interface-link";
import {Markdown} from "../../components/markdown";
import StaticPage, {Header, Paragraph, SubHeader} from "../../components/typography";
import Week from "../../data/core/Week";
import {RootState, WeeksState} from "../../store/state";
import {fetchWeeks} from "../../utils/connectors";

const Weeks = () => {
  const [isWeeksExpanded, setIsWeeksExpanded] = useState<boolean>(false);

  const dispatch: Dispatch = useDispatch();
  const weeksData: WeeksState = useSelector(
    (state: RootState) => state.weeksData,
  );

  const [isApiLoading, setIsApiLoading] = useState<boolean>(true);
  useEffect(() => {
    void fetchWeeks(dispatch, weeksData);

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

          <InterfaceLink location={`/?week=${week.week}`} title={"Filter by Week"} />
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
            title={`${isWeeksExpanded ? "Hide" : "Show"} All Weeks`}
            icon={isWeeksExpanded ? <FaAngleDown /> : <FaAngleRight />}
            onClick={() => setIsWeeksExpanded(!isWeeksExpanded)}
          />

          <div className={isWeeksExpanded ? "" : "hidden"}>
            {weeksDivs}
          </div>
        </StaticPage>
      </>
    );
  } else if (isApiLoading) {
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
    {response}
  </>;
};

export default Weeks;
