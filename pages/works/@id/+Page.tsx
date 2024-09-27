import { format } from "date-fns/format";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { type ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { useData } from "vike-react/useData";

import { DEFAULT_DESCRIPTION } from "../../+Head.tsx";
import Fancybox from "../../../components/markup/fancybox.tsx";
import { Markdown } from "../../../components/markup/markdown.tsx";
import SquareLink from "../../../components/markup/square-link.tsx";
import Artist from "../../../data/Artist.ts";
import Work, { UrlItem } from "../../../data/Work.ts";
import { parseSocial } from "../../../utils/socials.tsx";
import NotFoundError from "../../_error/+Page.tsx";

export default function SingleWork() {
  const {
    work,
    artist,
  }: {
    work?: Work;
    artist?: Artist;
  } = useData();

  if (!work || work.isSoftDeleted || work.id === "noop") {
    return <NotFoundError />;
  }

  const artistName: string = artist?.name || work?.firstSeenArtistInfo?.name || "Unknown";

  return (
    <>
      <Helmet>
        <title>{`${work.title} by ${artistName} | Design Refresh '22`}</title>
        <meta property="og:title" content={`${work.title} | Design Refresh '22`} />
        <meta name="twitter:title" content={`${work.title} | Design Refresh '22`} />

        <meta property="og:image" content={work.items[0].hiDpiThumbnail || "/img/placeholders/submission.png"} />
        <meta name="twitter:image" content={work.items[0].hiDpiThumbnail || "/img/placeholders/submission.png"} />

        <meta
          name="description"
          content={`A piece by ${artistName} for the '22 Design Refresh: ${work.description}.`}
        />
        <meta
          property="og:description"
          content={`A piece by ${artistName} for the '22 Design Refresh: ${work.description}.`}
        />
        <meta
          name="twitter:description"
          content={`A piece by ${artistName} for the '22 Design Refresh: ${work.description}.`}
        />
      </Helmet>

      <div className="pt-6 px-4 py-4 flex-col 2xl:flex 2xl:flex-row">
        <div className="px-2 py-2 md:px-3 md:py-5">
          <Fancybox>
            <div>
              {work.items.map((item: UrlItem, index: number) => {
                const _urlParts: string[] = item.url.split(".");
                const extension: string = _urlParts.length > 0 ? _urlParts[_urlParts.length - 1].toLowerCase() : "";

                let dataType: string | undefined = undefined;
                if (!["png", "jpg", "jpeg"].includes(extension)) {
                  if (extension === "mp3") {
                    dataType = "html5video";
                  }
                }

                const hostname: string = new URL(item.url).hostname.toLowerCase();

                if (hostname.includes("youtu") || hostname.includes("twitch.tv") || hostname.includes("vimeo")) {
                  item.meta = undefined;
                }

                if (!item.hiDpiThumbnail) {
                  item.hiDpiThumbnail = "/img/placeholders/submission.png";
                }

                if (!item.smallThumbnail) {
                  item.smallThumbnail = "/img/placeholders/submission.png";
                }

                let subtext: ReactElement;
                if (item.url.includes("discordapp")) {
                  subtext = (
                    <>{"This is a Discord file. Since it's been a while since 2022, this might no longer be there."}</>
                  );
                } else if (item.meta) {
                  subtext = (
                    <>
                      This is an external URL: <code>{new URL(item.url).hostname}</code>.{" "}
                      {"Since we don't host it, it might not be there anymore."}
                    </>
                  );
                } else {
                  subtext = <>Click above to expand.</>;
                }

                return (
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
                      className="align-bottom object-cover"
                      style={{ width: 800, minHeight: 600 }}
                      alt={`image number ${index + 1} for: ${work.title || "Untitled"}.`}
                    />
                    <p className="uppercase text-gray-400 py-2 text-xs">{subtext}</p>
                  </a>
                );
              })}
            </div>
          </Fancybox>
        </div>

        <div className="2xl:pt-6 px-6 pb-4">
          <div className="2xl:fixed max-w-3xl pr-0 xl:pr-12 3xl:max-w-xl">
            <h1 className="py-3 text-5xl">
              <b>{work.title}</b>
            </h1>

            <h2 className="text-3xl pb-4">
              by&nbsp;
              <a href={`/artists/${artistName}`}>
                <a className="underline" style={{ color: "#7C7CE0" }}>
                  {artistName}
                </a>
              </a>
              <p className="text-sm mt-3 text-gray-400">
                Posted {formatDistanceToNow(new Date(work.submittedTimestamp), { addSuffix: true })} (
                {format(new Date(work.submittedTimestamp), "PPPpp")})
              </p>
            </h2>

            {artist?.socials ? (
              <div className="pt-2 pb-4 flex">
                {artist.socials.map((socialUrl) => {
                  const parsedSocial = parseSocial(socialUrl);
                  const Icon = parsedSocial.icon;
                  return (
                    <SquareLink
                      key={parsedSocial.link}
                      location={parsedSocial.link}
                      icon={<Icon />}
                      style={{ color: parsedSocial.color, margin: "2px" }}
                    />
                  );
                })}
              </div>
            ) : null}

            {work.medium ? (
              <p className="hidden 2xl:block">
                Medium: <i>{work.medium}</i>.
              </p>
            ) : null}

            <p className="pt-4">
              <b>{"Artist's Description"}</b>
            </p>

            <Markdown markdown={work.description} />
          </div>
        </div>
      </div>
    </>
  );
}
