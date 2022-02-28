import type {NextPage} from "next";
import {NextSeo} from "next-seo";
import Head from "next/head";
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import GalleryItem from "../components/gallery-item";
import Omnitool from "../components/omnitool";
import StaticPage, {Header, Paragraph} from "../components/typography";
import {DEFAULT_DESCRIPTION, DEFAULT_IMAGE} from "../data/constants/setup";
import Work from "../data/core/Work";
import {shuffle} from "../data/utils/data-structures";
import {ArtistsState, RootState, WeeksState, WorksState} from "../store/state";
import {fetchArtists, fetchWeeks, fetchWorksByArtist, fetchWorksByWeek} from "../utils/connectors";

/**
 * The number of posts that appears on a single page.
 */
const POSTS_PER_PAGE = 8;

/**
 * The home page/gallery.
 *
 * @returns {JSX.Element} the element
 * @constructor
 */
const Home: NextPage = () => {
  // Fetch the items.

  const dispatch: Dispatch = useDispatch();

  const weeksData: WeeksState = useSelector((state: RootState) => state.weeksData);
  const worksData: WorksState = useSelector((state: RootState) => state.worksData);
  const artistsData: ArtistsState = useSelector((state: RootState) => state.artistsData);

  // Perform the initial retrieval of weeks and artists, then all works by the current week. Any
  // additional retrievals needed will be provided when the route's search parameters are parsed.

  // We retrieve the current week's works regardless of anything since it is helpful for typical
  // users of the site going through week-by-week.

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(
    () => {
      fetchArtists(dispatch, artistsData).then();

      // Find the current week.

      fetchWeeks(dispatch, weeksData).then(
        () => {
          const latestWeek = Math.max(
            Math.max(...Object.keys(weeksData.weeks).map(numberString => parseInt(numberString))),
            ...Object.values(
              weeksData.weeks
            ).filter(
              week => week.isPublished
            ).map(
              week => week.week
            )
          );

          fetchWorksByWeek(dispatch, worksData, latestWeek).then();
        }
      );
    },
    []
  );

  // Parse the query string for artist, week, search, and sort filters.

  const router = useRouter();
  const query: ParsedUrlQuery = router.query;

  const _rawArtist: string | string[] | undefined = query.artist;
  const _rawWeek: string | string[] | undefined = query.week;
  const _rawQ: string | string[] | undefined = query.q;
  const _rawP: string | string[] | undefined = query.p;
  const _rawSort: string | string[] | undefined = query.sort;

  const artist: string | undefined = typeof _rawArtist === "object" ? _rawArtist[0] : _rawArtist;
  const week: string | undefined = typeof _rawWeek === "object" ? _rawWeek[0] : _rawWeek;

  // If either of the filters are set, we might need to do more fetches.

  useEffect(
    () => {
      if (week) {
        fetchWorksByWeek(dispatch, worksData, parseInt(week)).then();
      }

      if (artist) {
        fetchWorksByArtist(dispatch, worksData, artist).then();
      }

      setIsLoading(false);
    },
    [artist, week]
  );

  const sort: string | undefined = typeof _rawSort === "object" ? _rawSort[0] : _rawSort;

  // Note that search and page have different names when parsed:

  const search: string | undefined = typeof _rawQ === "object" ? _rawQ[0] : _rawQ;
  const page: string | undefined = typeof _rawP === "object" ? _rawP[0] : _rawP;

  let works: Work[] = Object.values(
    worksData.works || [],
  ).filter(
    work => work.isApproved && !work.isSoftDeleted && work.id !== "noop",
  ).filter(
    work => {
      // Perform the sorting based on the query string. If not present, we don't perform any
      // fetches, but any information in the cache will be fair game, meaning there will be the
      // current week's data combined with random works the user has already seen.

      const artistName: string = (
        artistsData.artists[work.artistId]?.name
        || work.firstSeenArtistInfo?.name
        || "Unknown User"
      );

      const matchesArtist = artist ? artistName === artist : true;
      const matchesWeek = week ? work.weekNumbers.map(
        _week => _week.toString()
      ).includes(week.toString()) : true;

      const matchesQuery = search ? JSON.stringify(
        work,
      ).replaceAll(
        /\s/g, "",
      ).toLowerCase().includes(
        search.toLowerCase().replaceAll(/\s/g, "")
      ) : true;

      return matchesArtist && matchesWeek && matchesQuery;
    }
  );

  // Shuffling isn't really sorting, but we do that here if required.

  if (sort === "random") {
    works = shuffle(works);
  } else {
    // Default to descending sort.

    works = works.sort(
      (a: Work, b: Work) => {
        const aDate = new Date(a.submittedTimestamp);
        const bDate = new Date(b.submittedTimestamp);

        return bDate.valueOf() - aDate.valueOf();
      }
    );

    if (sort === "ascending") {
      works = works.reverse();
    }
  }

  // Perform the slice for pagination.

  works = works.slice(
    page ? (parseInt(page) - 1) * POSTS_PER_PAGE : 0.0,
    page ? parseInt(page) * POSTS_PER_PAGE : POSTS_PER_PAGE,
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
              weeks={work.weekNumbers}
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
          Empty!
        </Header>

        <Paragraph>
          Nobody has submitted anything matching that query.
        </Paragraph>

        <Paragraph>
          Perhaps you will be the first?
        </Paragraph>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Gallery - Design Refresh</title>
      </Head>

      <NextSeo
        title={"Gallery - Design Refresh"}
        description={DEFAULT_DESCRIPTION}
        canonical={`${process.env.NEXT_PUBLIC_BASE_URI}`}
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

      {isLoading ? <StaticPage><Header>Loading...</Header></StaticPage> : mainContent}

      <Omnitool sort={sort} artist={artist} week={week} page={page} search={search} />
    </>
  );
};

export default Home;
