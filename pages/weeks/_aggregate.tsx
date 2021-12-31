import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import StaticPage, {Header} from "../../components/typography";
import {RootState, WeeksState} from "../../store/state";
import {updateWeeks} from "../../utils/connectors";

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const AggregateWeeks = () => {
  const dispatch: Dispatch = useDispatch();
  const weeksData: WeeksState = useSelector(
    (state: RootState) => state.weeksData,
  );

  useEffect(() => {
    updateWeeks(dispatch, weeksData);
  }, []);

  return (
    <StaticPage>
      <Header>Weeks</Header>
      <p>
        {Object.keys(weeksData.weeks)}
      </p>
    </StaticPage>
  );
};

export default AggregateWeeks;
