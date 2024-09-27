import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useData } from "vike-react/useData";

import GalleryItem from "../../components/gallery-item.tsx";
import { Header, Paragraph } from "../../components/markup/typography.tsx";
import Artist from "../../data/Artist.ts";
import Work from "../../data/Work.ts";

const POSTS_PER_PAGE = 8;

export default function Index() {
  const [displayedWorks, setDisplayedWorks] = useState<Work[]>([]);
  const { works, artists }: { works: Work[]; artists: Record<string, Artist> } = useData();

  const query = new URLSearchParams(window.location.search);

  const artist: string | null = query.get("artist");
  const week: string | null = query.get("week");
  const search: string | null = query.get("q");
  const page: string | null = query.get("p");
  const sort: string | null = query.get("sort");

  useEffect(() => {
    let resultSet = works.filter((work) => work.isApproved && !work.isSoftDeleted && work.id !== "noop");

    // Filter

    if (week) {
      resultSet = resultSet.filter((work) => work.weekNumbers.includes(parseInt(week)));
    }

    if (artist) {
      // FIXME: Should be artist name, not ID.

      resultSet = resultSet.filter((work) => work.artistId === artist);
    }

    if (search) {
      resultSet = resultSet.filter((work) => JSON.stringify(work).includes(search));
    }

    // Sort

    if (sort === "ascending") {
      resultSet = resultSet.sort(
        (a, b) => new Date(a.submittedTimestamp).valueOf() - new Date(b.submittedTimestamp).valueOf(),
      );
    } else if (sort === "descending") {
      resultSet = resultSet.sort(
        (a, b) => new Date(b.submittedTimestamp).valueOf() - new Date(a.submittedTimestamp).valueOf(),
      );
    } else {
      resultSet = resultSet.sort(() => Math.random() - 0.5);
    }

    // Paginate

    const start = page ? (parseInt(page) - 1) * POSTS_PER_PAGE : 0;

    setDisplayedWorks(resultSet.slice(start, start + POSTS_PER_PAGE));
  }, [works, artist, search, sort, week, page]);

  const mainContent =
    works.length > 0 ? (
      <div className="mx-2 my-2 md:mr-5">
        <>
          {displayedWorks.map((work: Work) => {
            const artistName: string = artists[work.artistId]?.name || work.firstSeenArtistInfo?.name || "Unknown User";

            return (
              <GalleryItem
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
              />
            );
          })}
        </>
      </div>
    ) : (
      <div className="flex items-center justify-center h-full">
        <div className="text-center pt-4 pb-16">
          <div className="m-auto p-4 mt-12 md:mt-0" style={{ maxWidth: "256px" }}>
            <img
              src="/img/logo/full-logo.png"
              alt="rotating placeholder logo for the Design Refresh"
              className="m-auto rotate-forever"
            />
          </div>

          <div className="pt-4" />

          <Header>Empty!</Header>

          <Paragraph>Nobody has submitted anything matching that query.</Paragraph>

          <Paragraph>Perhaps you will be the first?</Paragraph>
        </div>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>{"Gallery | Design Refresh '22"}</title>
      </Helmet>

      {mainContent}

      {/*<Omnitool sort={sort} artist={artist} week={week} page={page} search={search}/>*/}
    </>
  );
}
