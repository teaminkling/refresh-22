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
const GetArtists = () => {
  const dispatch: Dispatch = useDispatch();
  const artistsData: ArtistState = useSelector(
    (state: RootState) => state.artistsData,
  );

  useEffect(() => {
    updateArtists(dispatch, artistsData);
  }, []);

  // Now that we have the artists, if a fetch was required:

  Object.keys(artistsData.usernameToId);

  return (
    <StaticPage>
      <Header>Artists</Header>
      <p>
        {Object.keys(artistsData.usernameToId)}
      </p>
    </StaticPage>
  );
};

export default GetArtists;
