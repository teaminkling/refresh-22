import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {useRouter} from "next/router";
import {ParsedUrlQuery} from "querystring";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dispatch} from "redux";
import Fancybox from "../../components/fancybox";
import {Markdown} from "../../components/markdown";
import SquareLink from "../../components/square-link";
import {Header, SubHeader} from "../../components/typography";
import Artist from "../../data/core/Artist";
import Work, {UrlItem} from "../../data/core/Work";
import {ArtistsState, RootState, WorksState} from "../../store/state";
import {fetchArtists, fetchWorkById} from "../../utils/connectors";
import {ParsedSocial, parseSocial} from "../../utils/socials";
import NotFound from "../404";

const Works = () => {
  const router = useRouter();
  const query: ParsedUrlQuery = router.query;

  // Determine the name we want to retrieve.

  const _rawId: string | string[] | undefined = query.id || "unknown";
  const id: string = typeof _rawId === "object" ? _rawId[0] : _rawId;

  // Determine what there is to retrieve.

  const dispatch: Dispatch = useDispatch();

  const worksData: WorksState = useSelector((state: RootState) => state.worksData);
  const artistsData: ArtistsState = useSelector((state: RootState) => state.artistsData);

  useEffect(
    () => {
      if (id !== "unknown") {
        fetchWorkById(dispatch, worksData, id);
        fetchArtists(dispatch, artistsData);
      }
    },
    [id]
  );

  const work: Work | undefined = worksData.works[id];
  const artist: Artist | undefined = (
    work?.artistId ? artistsData.artists[work.artistId] : undefined
  );

  const artistName: string = artist?.name || work?.firstSeenArtistInfo?.name || "Unknown";

  let response = <NotFound />;
  if (work) {
    response = (
      <>
        <div className={"pt-6 px-4 py-4 flex-col xl:flex xl:flex-row"}>
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

                    // noinspection HtmlUnknownAttribute
                    return (
                      <a
                        key={item.url && item.meta}
                        data-fancybox={"gallery"}
                        href={item.url}
                        data-src={item.url}
                        data-type={dataType}
                      >
                        <img
                          src={item.hiDpiThumbnail}
                          srcSet={`${item.smallThumbnail}, ${item.hiDpiThumbnail}`}
                          className={"align-bottom pb-6"}
                          style={{width: 800}}
                          alt={
                            `The ${index}th image for: ${work.title || "Untitled"}.`
                          }
                        />
                      </a>
                    );
                  })
                }
              </div>
            </Fancybox>
          </div>

          <div
            className={"px-2 flex xl:hidden xl:text-sm"}
            style={{maxWidth: 100}}
          >
            <Header>
              {id}
            </Header>

            <SubHeader>
              by {artist?.name || work.firstSeenArtistInfo?.name || "Unknown"}
            </SubHeader>
          </div>

          <div className={"pt-6 px-6 py-4 hidden xl:flex xl:flex-col"}>
            <div className={"fixed"}>
              <h1 className={"py-3 text-5xl"}>
                <b>{work.title}</b>
              </h1>
              <h2 className={"text-3xl pb-4"}>
                by&nbsp;
                <Link href={`/artists/${artistName}`}>
                  <a className={"underline"} style={{color: "#7C7CE0"}}>{artistName}</a>
                </Link>
              </h2>

              <div className={"pt-2 pb-4"}>
                {
                  (artist?.socials || []).map(
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
              </div>

              {work.medium ? <>
                <p className={"hidden 2xl:block"}>
                  <i>Created with {work.medium}.</i>
                </p>
              </> : <></>}

              <h2 className={"pt-4 text-3xl font-bold"}>
                Artist&apos;s Description
              </h2>

              <Markdown markdown={work.description} />

            </div>
          </div>
        </div>
      </>
    );
  }

  return response;
};

export default Works;
