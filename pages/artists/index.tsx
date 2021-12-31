import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import AggregateArtists from "./_aggregate";
import SingleArtist from "./_single";

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const Artists = () => {
  // Now that we have the artists, if a fetch was required:

  const router = useRouter();
  const query: ParsedUrlQuery = router.query;

  if (query.name) {
    return <SingleArtist name={query.name} />;
  }

  return <AggregateArtists />;
};

export default Artists;
