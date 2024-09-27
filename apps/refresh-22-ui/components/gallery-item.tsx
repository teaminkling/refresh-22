import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import removeMd from "remove-markdown";

import InterfaceLink from "./markup/interface-link";

interface ItemProps {
  id: string;
  title: string;
  artist: string;
  medium?: string;
  weeks: number[];
  description: string;
  retinaPreview: string;
  preview: string;
  submittedTimestamp: string;
  isEditor?: boolean;
}

const GalleryItem = (props: ItemProps) => {
  let response = <></>;

  // These checks are redundant, but they were once required, so I am keeping them here.

  let title = props.title;
  if (title && title.length > 128) {
    title = title.substring(0, 128) + "...";
  }

  let medium = props.medium;
  if (medium && medium.length > 128) {
    medium = medium.substring(0, 128) + "...";
  }

  let description = removeMd(props.description);
  if (description && description.length > 380) {
    description = description.substring(0, 380) + "...";
  }

  if (title) {
    response = (
      <div className={"flex-col xl:flex xl:flex-row"}>
        <div className={"px-2 py-2 md:px-3 md:py-4 hover:opacity-95"}>
          <Link href={`/works/${props.id}`} legacyBehavior>
            <a>
              <img
                src={props.retinaPreview}
                srcSet={`${props.preview}, ${props.retinaPreview} 2x`}
                className={"align-bottom object-cover"}
                style={{ width: 800 }}
                alt={`A gallery preview image with the title: ${props.title}.`}
              />
            </a>
          </Link>
        </div>

        {/* Smaller screen gallery caption and horizontal rule + pad. */}

        <div className={"px-2 flex xl:hidden text-xs xl:text-sm"} style={{ maxWidth: 800 }}>
          <div className={"flex-grow"}>
            <p>
              <b>{title}</b>
            </p>
          </div>
          <div className={"self-end"}>
            <i>{props.artist}</i>
          </div>
        </div>

        <div className={"px-2 py-2 2xl:hidden"} style={{ maxWidth: 824 }}>
          <hr className={"border-t"} />
        </div>

        {/* Responsive caption on the right side for wider screens. */}

        <div className={"py-4 w-80 hidden xl:flex"} style={{ hyphens: "auto" }}>
          <span className={"self-end"}>
            <p className={"px-4 text-sm"}>
              <b>{title}</b>
            </p>

            {medium ? (
              <p className={"hidden 2xl:block px-4 text-sm"}>
                <i>{medium}</i>
              </p>
            ) : (
              <></>
            )}

            <p className={"px-4 text-sm"}>by {props.artist}</p>

            <p className={"px-4 text-sm text-gray-400"}>
              {moment(props.submittedTimestamp).format("LL").toString()} (Week {props.weeks.join(",")})
            </p>

            <p className={"pt-8 px-4 hidden xl:block text-sm"}>{description}</p>

            <p className={"pt-8 px-4 hidden xl:block"}>
              <InterfaceLink location={`/works/${props.id}`} title="See More" icon={<FaAngleDoubleLeft />} />
            </p>
          </span>
        </div>
      </div>
    );
  }

  return response;
};

export default GalleryItem;
