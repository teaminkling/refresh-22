import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import {
  faAngleDown,
  faAngleRight,
  faHandMiddleFinger,
  faLockOpen
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import InterfaceLink from "../../components/interface-link";
import {Markdown} from "../../components/markdown";
import StaticPage, {Header, Paragraph, SubHeader} from "../../components/typography";
import Week from "../../data/core/Week";
import {RootState, WeeksState} from "../../store/state";
import {getIsEditor} from "../../utils/auth";
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

  const {user, getAccessTokenSilently}: Auth0ContextInterface = useAuth0();

  const isEditor: boolean = getIsEditor(user);

  let response = (
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

        {
          isEditor ?
            <InterfaceLink
              location={"/weeks/edit"}
              title={"(Admin) Fuck you, Tom"}
              icon={<FontAwesomeIcon icon={faHandMiddleFinger} />}
              nextLink
            /> : <></>
        }
      </div>
    </div>
  );

  useEffect(() => {
    if (user) {
      getAccessTokenSilently().then(
        (token: string) => fetchWeeks(dispatch, weeksData, token, isEditor)
      );
    } else {
      fetchWeeks(dispatch, weeksData, undefined, isEditor);
    }
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
        </div>
      );

      weeksDivs.push(newDiv);

      currentWeekDiv = newDiv;
    }
  );

  if (weeksDivs.length > 0) {
    response = (
      <>
        <StaticPage>
          <Header>Viewing Weeks</Header>

          {
            isEditor ? <InterfaceLink
              location={"/weeks/edit"}
              title={"Edit Weeks"} nextLink
              icon={
                <FontAwesomeIcon icon={faLockOpen} />
              }
            /> : <></>
          }

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
  }

  return <>
    {response}
  </>;
};

export default Weeks;
