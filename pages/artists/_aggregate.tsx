import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import StaticPage, {Header} from "../../components/typography";
import {ArtistState, RootState} from "../../store/state";
import {updateArtists} from "../../utils/connectors";

/**
 * @returns {JSX.Element} the element
 * @constructor
 */
const AggregateArtists = () => {
  const dispatch: Dispatch = useDispatch();
  const artistsData: ArtistState = useSelector(
    (state: RootState) => state.artistsData,
  );

  useEffect(() => {
    updateArtists(dispatch, artistsData);
  }, []);


  return (
    <StaticPage>
      <Header>Artists</Header>
      <p>
        {Object.keys(artistsData.usernameToId)}
      </p>
    </StaticPage>
  );
};

export default AggregateArtists;
