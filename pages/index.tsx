import type {NextPage} from "next";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import GalleryItem from "../components/gallery-item";
import {Header, Paragraph} from "../components/typography";
import Work from "../data/core/Work";
import {shuffle} from "../data/utils/data-structures";
import {ArtistsState, RootState, WorksState} from "../store/state";
import {fetchArtists, fetchWorksByWeek} from "../utils/connectors";

/**
 * The home page/gallery.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Home: NextPage = () => {
  // Fetch the items.

  const dispatch: Dispatch = useDispatch();

  const worksData: WorksState = useSelector((state: RootState) => state.worksData);
  const artistsData: ArtistsState = useSelector((state: RootState) => state.artistsData);

  useEffect(
    () => {
      // TODO: De-hardcode this in prep for week 2.

      fetchWorksByWeek(dispatch, worksData, 1);
      fetchArtists(dispatch, artistsData);
    },
    []
  );

  // TODO: works retrieved needs pagination etc

  const works: Work[] = shuffle<Work>(
    Object.values(
      worksData.works || []
    ).filter(work => work.isApproved && !work.isSoftDeleted && work.id !== "noop")
  );

  const mainContent = works.length > 0 ? (
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
            />;
          })
        }
      </>
    </div>
  ) : (
    <div className={"flex items-center justify-center h-full"}>
      <div className={"text-center pt-4 pb-16"}>
        <div className={"m-auto p-4 mt-12 md:mt-0"} style={{maxWidth: "256px"}}>
          <img
            src={"/logo/full_logo.png"}
            alt={"The full logo of the Design Refresh as a placeholder."}
            className={"m-auto rotate-forever"}
          />
        </div>

        <div className={"pt-4"} />

        <Header>
          Welcome!
        </Header>

        <Paragraph>
          Nobody has submitted anything yet.
        </Paragraph>

        <Paragraph>
          Perhaps you&apos;ll be the first?
        </Paragraph>
      </div>
    </div>
  );

  return (
    <>
      {mainContent}
    </>
  );
};

export default Home;
