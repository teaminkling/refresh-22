import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment";
import {NextSeo} from "next-seo";
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import Fancybox from "../../components/fancybox";
import {Markdown} from "../../components/markdown";
import SquareLink from "../../components/square-link";
import StaticPage, {Header} from "../../components/typography";
import {DEFAULT_DESCRIPTION, DEFAULT_IMAGE} from "../../data/constants/setup";
import Artist from "../../data/core/Artist";
import Work, {UrlItem} from "../../data/core/Work";
import {ArtistsState, RootState, WorksState} from "../../store/state";
import {fetchArtists, fetchWorkById} from "../../utils/connectors";
import {ParsedSocial, parseSocial} from "../../utils/socials";
import NotFound from "../404";

const WorksById = () => {
  const router = useRouter();
  const query: ParsedUrlQuery = router.query;

  // Determine the name we want to retrieve.

  const _rawId: string | string[] | undefined = query.id || "unknown";
  const id: string = typeof _rawId === "object" ? _rawId[0] : _rawId;

  // Determine what there is to retrieve.

  const dispatch: Dispatch = useDispatch();

  const worksData: WorksState = useSelector((state: RootState) => state.worksData);
  const artistsData: ArtistsState = useSelector((state: RootState) => state.artistsData);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(
    () => {
      if (id !== "unknown" && id !== "noop") {
        fetchWorkById(dispatch, id);
        fetchArtists(dispatch, artistsData);
      }

      setIsLoading(false);
    },
    [id]
  );

  const work: Work | undefined = worksData.works[id];
  const artist: Artist | undefined = (
    work?.artistId ? artistsData.artists[work.artistId] : undefined
  );

  const artistName: string = artist?.name || work?.firstSeenArtistInfo?.name || "Unknown";

  let response = <NotFound />;
  if (work && !work.isSoftDeleted && work.id !== "noop") {
    response = (
      <>
        <Head>
          <title>{work.title} - Design Refresh</title>
        </Head>

        <NextSeo
          title={`Work: ${work.title} - Design Refresh`}
          description={
            (
              `"${work.title}" by ${artistName}: ${work.description.slice(0, 155)}`
            )
          }
          canonical={`${process.env.NEXT_PUBLIC_BASE_URI}/works/${work.id}`}
          openGraph={{
            type: "website",
            site_name: "Design Refresh",
            images: [
              {
                url: work.thumbnailUrl || DEFAULT_IMAGE,
              }
            ],
          }}
          twitter={{
            cardType: "summary_large_image",
          }}
        />

        <div className={"pt-6 px-4 py-4 flex-col 2xl:flex 2xl:flex-row"}>
          <div className={"px-2 py-2 md:px-3 md:py-5"}>
            <Fancybox>
              <div>
                {
                  work.items.map((item: UrlItem, index: number) => {
                    // The URL to be used needs to be an image or approved embed. If it's just a
                    // link to a website, the full social preview should be used and it should
                    // be obviously a URL to something.

                    const _urlParts: string[] = item.url.split(".");
                    const extension: string = (
                      _urlParts.length > 0 ? _urlParts[_urlParts.length - 1].toLowerCase() : ""
                    );

                    let dataType: string | undefined = undefined;
                    if (!["png", "jpg", "jpeg"].includes(extension)) {
                      if (extension === "mp3") {
                        dataType = "html5video";
                      }
                    }

                    // Don't go to external links if we think we can render them.

                    const hostname: string = new URL(item.url).hostname.toLowerCase();

                    if (
                      hostname.includes("youtu")
                      || hostname.includes("twitch.tv")
                      || hostname.includes("vimeo")
                    ) {
                      item.meta = undefined;
                    }

                    // noinspection HtmlUnknownAttribute
                    return (
                      // eslint-disable-next-line react/jsx-no-target-blank
                      <a
                        key={item.meta ? item.meta : item.url}
                        data-fancybox={item.meta ? undefined : "gallery"}
                        href={item.url}
                        data-src={item.url}
                        data-type={dataType}
                        target={item.meta ? "_blank" : undefined}
                        rel={item.meta ? "noreferrer" : undefined}
                      >
                        <img
                          src={item.hiDpiThumbnail}
                          srcSet={`${item.smallThumbnail}, ${item.hiDpiThumbnail} 2x`}
                          className={"align-bottom object-cover"}
                          style={{width: 800}}
                          alt={
                            `The ${index}th image for: ${work.title || "Untitled"}.`
                          }
                        />
                        {
                          item.meta ?
                            <p className={
                              "uppercase text-gray-400 text-center py-2 text-xs"
                            }>
                              This is a URL: <code>{new URL(item.url).hostname}</code>. Please
                              be careful!
                            </p> : <>
                              <p className={
                                "uppercase text-gray-400 text-center py-2 text-xs"
                              }>
                                Click me to expand!
                              </p>
                            </>
                        }
                      </a>
                    );
                  })
                }
              </div>
            </Fancybox>
          </div>

          <div className={"2xl:pt-6 px-6 pb-4"}>
            <div className={"2xl:fixed max-w-3xl pr-0 xl:pr-12 3xl:max-w-xl"}>
              <h1 className={"py-3 text-5xl"}>
                <b>{work.title}</b>
              </h1>

              <h2 className={"text-3xl pb-4"}>
                by&nbsp;
                <Link href={`/artists/${artistName}`} legacyBehavior>
                  <a className={"underline"} style={{color: "#7C7CE0"}}>{artistName}</a>
                </Link>

                <p className={"text-sm mt-3 text-gray-400"}>
                  Posted: {moment(work.submittedTimestamp).toString()}&nbsp;
                  {
                    work.isApproved ? <span className={"text-green-800"}>
                      Approved
                    </span> : <span className={"text-yellow-500"}>
                      Pending Approval
                    </span>
                  }
                </p>
              </h2>

              {
                artist?.socials ?
                  <div className={"pt-2 pb-4"}>
                    {
                      artist.socials.map(
                        (socialUrl: string) => {
                          const parsedSocial: ParsedSocial = parseSocial(socialUrl);

                          return (
                            <span key={parsedSocial.link} style={{color: parsedSocial.color}}>
                              <SquareLink location={parsedSocial.link} icon={
                                <FontAwesomeIcon icon={parsedSocial.icon} fixedWidth />
                              } />
                            </span>
                          );
                        }
                      )
                    }
                  </div> : <></>
              }

              {work.medium ? <>
                <p className={"hidden 2xl:block"}>
                  Medium: <i>{work.medium}</i>.
                </p>
              </> : <></>}

              <p className={"pt-4"}>
                <b>Artist&apos;s Description</b>
              </p>

              <Markdown markdown={work.description} />
            </div>
          </div>
        </div>
      </>
    );
  } else if (isLoading) {
    response = <StaticPage><Header>Loading...</Header></StaticPage>;
  }

  // Reduce the meta description if it's too long.

  // FIXME: This is clearly wrong. The server must retrieve the work and artist before first render.
  // FIXME: add the canonical value back.

  return (
    <>
      <Head>
        <title>Work - Design Refresh</title>
      </Head>

      <NextSeo
        title={"Work - Design Refresh"}
        description={DEFAULT_DESCRIPTION}
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

export default WorksById;
