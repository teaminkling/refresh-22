import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import AggregateWeeks from "./_aggregate";

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const Weeks = () => {
  const router = useRouter();
  const query: ParsedUrlQuery = router.query;

  return <AggregateWeeks />;
};

export default Weeks;
