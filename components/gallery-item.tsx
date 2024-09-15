import {faAngleDoubleLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment";
import Link from "next/link";
import removeMd from "remove-markdown";
import InterfaceLink from "./interface-link";

interface ItemProps {
  /**
   * The ID of the piece.
   */
  id: string;

  /**
   * The title of the piece.
   */
  title: string;

  /**
   * The name of the artist.
   */
  artist: string;

  /**
   * The name of the medium.
   */
  medium?: string;

  /**
   * The weeks of the work.
   */
  weeks: number[];

  /**
   * The description of the piece.
   */
  description: string;

  /**
   * The default image (if browser does not support `srcset`) as the highest resolution preview.
   */
  retinaPreview: string;

  /**
   * The preview URL if the screen is not high DPI.
   */
  preview: string;

  /**
   * The timestamp of the post.
   */
  submittedTimestamp: string;

  /**
   * Whether the approval icon should be placed on the gallery item.
   */
  isEditor?: boolean;
}

const GalleryItem = (props: ItemProps) => {
  // Build the response.

  let response = <></>;

  // These checks are redundant but they were once required so I am keeping them here.

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
                style={{width: 800}}
                alt={`A gallery preview image with the title: ${props.title}.`}
              />
            </a>
          </Link>
        </div>

        {/* Smaller screen gallery caption and horizontal rule + pad. */}

        <div
          className={"px-2 flex xl:hidden text-xs xl:text-sm"}
          style={{maxWidth: 800}}
        >
          <div className={"flex-grow"}>
            <p><b>{title}</b></p>
          </div>
          <div className={"self-end"}>
            <i>{props.artist}</i>
          </div>
        </div>

        <div className={"px-2 py-2 2xl:hidden"} style={{maxWidth: 824}}>
          <hr className={"border-t"} />
        </div>

        {/* Responsive caption on the right side for wider screens. */}

        <div className={"py-4 w-80 hidden xl:flex"} style={{hyphens: "auto"}}>
          <span className={"self-end"}>
            <p className={"px-4 text-sm"}>
              <b>{title}</b>
            </p>

            {
              medium ? <p className={"hidden 2xl:block px-4 text-sm"}>
                <i>
                  {medium}
                </i>
              </p> : <></>
            }

            <p className={"px-4 text-sm"}>
              by {props.artist}
            </p>

            <p className={"px-4 text-sm text-gray-400"}>
              {
                moment(props.submittedTimestamp).format("LL").toString()
              } (Week {props.weeks.join(",")})
            </p>

            <p className={"pt-8 px-4 hidden xl:block text-sm"}>
              {description}
            </p>

            <p className={"pt-8 px-4 hidden xl:block"}>
              <InterfaceLink
                location={`/works/${props.id}`}
                title={"See More"}
                icon={<FontAwesomeIcon icon={faAngleDoubleLeft} />}
                nextLink
              />
            </p>
          </span>
        </div>
      </div>
    );
  }

  return response;
};

export default GalleryItem;
