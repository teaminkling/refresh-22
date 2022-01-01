import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import InterfaceLink from "../../components/interface-link";
import StaticPage, {Header, Paragraph, SubHeader} from "../../components/typography";
import {RootState, WeeksState} from "../../store/state";
import {updateWeeks} from "../../utils/connectors";

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const Weeks = () => {
  const dispatch: Dispatch = useDispatch();
  const weeksData: WeeksState = useSelector(
    (state: RootState) => state.weeksData,
  );

  useEffect(() => {
    updateWeeks(dispatch, weeksData);
  }, []);

  return (
    <StaticPage>
      <Header>Viewing Weeks</Header>

      <InterfaceLink location={"/weeks/edit"} title={"Edit Weeks"} nextLink />

      <SubHeader>
        Week 3: Some Theme (Current)
      </SubHeader>

      <Paragraph>
        This is a description of the theme, mate.
      </Paragraph>

      <p>
        {Object.keys(weeksData.weeks)}
      </p>
    </StaticPage>
  );
};

export default Weeks;
