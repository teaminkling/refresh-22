import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import type {NextPage} from "next";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import GalleryItem from "../../components/gallery-item";
import Work from "../../data/core/Work";
import {ArtistsState, RootState, WorksState} from "../../store/state";
import {getIsEditor} from "../../utils/auth";
import {fetchArtists, fetchWorks} from "../../utils/connectors";
import NotFound from "../404";

/**
 * The mod queue.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Moderate: NextPage = () => {
  const {user, getAccessTokenSilently}: Auth0ContextInterface = useAuth0();

  const isEditor = getIsEditor(user);

  // Fetch the items, including literally all of the works.

  const dispatch: Dispatch = useDispatch();

  const worksData: WorksState = useSelector((state: RootState) => state.worksData);
  const artistsData: ArtistsState = useSelector((state: RootState) => state.artistsData);

  useEffect(
    () => {
      if (isEditor) {
        getAccessTokenSilently().then(
          token => {
            fetchWorks(dispatch, worksData, "?isUnapproved=1", token, true);
            fetchArtists(dispatch, artistsData, token, true);
          }
        );
      }
    },
    [isEditor],
  );

  const works: Work[] = Object.values(worksData.works || []).sort(
    (a: Work, b: Work) => {
      return new Date(b.submittedTimestamp).valueOf() - new Date(a.submittedTimestamp).valueOf();
    }
  ).filter((work: Work) => !work.isApproved);

  const mainContent = isEditor ? (
    <div className={"mx-2 my-2 md:mr-5"}>
      <>
        {
          works.map((work: Work) => {
            const artistName: string = (
              artistsData.artists[work.artistId]?.name
              || work.firstSeenArtistInfo?.name
              || "Unknown User"
            );

            return <GalleryItem
              key={work.id}
              id={work.id}
              title={work.title}
              artist={artistName}
              medium={work.medium}
              description={work.description}
              retinaPreview={work.thumbnailUrl || "/placeholders/submission.png"}
              preview={work.smallThumbnailUrl || "/placeholders/submission.png"}
              submittedTimestamp={work.submittedTimestamp}
              isEditor={isEditor}
            />;
          })
        }
      </>
    </div>
  ) : <NotFound />;

  return (
    <>
      {mainContent}
    </>
  );
};

export default Moderate;
