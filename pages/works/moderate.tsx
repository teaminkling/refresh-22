import {Auth0ContextInterface, useAuth0} from "@auth0/auth0-react";
import type {NextPage} from "next";
import {NextSeo} from "next-seo";
import Head from "next/head";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import GalleryItem from "../../components/gallery-item";
import StaticPage, {Header} from "../../components/typography";
import {DEFAULT_DESCRIPTION, DEFAULT_IMAGE} from "../../data/constants/setup";
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
  const {user, isLoading, getAccessTokenSilently}: Auth0ContextInterface = useAuth0();

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
  ).filter((work: Work) => !work.isApproved && !work.isSoftDeleted && work.id !== "noop");

  let response = <NotFound />;
  if (isEditor) {
    response = (
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
                weeks={work.weekNumbers}
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
    );
  } else if (isLoading) {
    response = <StaticPage><Header>Loading...</Header></StaticPage>;
  }

  return (
    <>
      <Head>
        <title>Moderate Works - Design Refresh</title>
      </Head>

      <NextSeo
        title={"Moderate Works - Design Refresh"}
        description={DEFAULT_DESCRIPTION}
        canonical={`${process.env.NEXT_PUBLIC_BASE_URI}/works/moderate`}
        openGraph={{
          type: "website",
          site_name: "Design Refresh",
          images: [
            {
              url: DEFAULT_IMAGE,
            }
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />

      {response}
    </>
  );
};

export default Moderate;
