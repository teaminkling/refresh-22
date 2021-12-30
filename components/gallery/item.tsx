import {faAngleDoubleLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import InterfaceLink from "../interface-link";

/**
 * The props on the {@link Item}.
 */
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
  medium: string;

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
}

/**
 * A single gallery item.
 *
 * All items are exactly 1024 x 720 on the screen.
 *
 * @param {ItemProps} props the props
 * @returns {JSX.Element} the element
 * @constructor
 */
const Item = (props: ItemProps) => {
  let title = props.title;
  if (title.length > 128) {
    title = title.substring(0, 128) + "...";
  }

  let medium = props.medium;
  if (medium.length > 128) {
    medium = medium.substring(0, 128) + "...";
  }

  let description = props.description;
  if (description.length > 380) {
    description = description.substring(0, 380) + "...";
  }

  return (
    <div className={"flex-col 2xl:flex 2xl:flex-row"}>
      <div className={"px-2 py-2 lg:px-3 lg:py-4 hover:opacity-95"}>
        <Link href={`/works/${props.id}`}>
          <a>
            <img
              src={props.retinaPreview}
              srcSet={`${props.preview}, ${props.retinaPreview} 1.5x`}
              className={"align-bottom"}
              style={{width: 1120}}
              alt={`"A gallery preview image with the title: ${props.title}`}
            />
          </a>
        </Link>
      </div>

      {/* Smaller screen gallery caption and horizontal rule + pad. */}

      <div className={"px-2 flex 2xl:hidden text-xs xl:text-sm"}>
        <div className={"flex-grow"}>
          <p><b>{title}</b></p>
        </div>
        <div className={"self-end"}>
          <i>{props.artist}</i>
        </div>
      </div>

      <div className={"px-2 py-2 xl:hidden"}>
        <hr className={"border-t"} />
      </div>

      {/* Responsive caption on the right side for wider screens. */}

      <div className={"py-4 w-96 hidden 2xl:flex"}>
        <span className={"self-end"}>
          <p className={"px-4"}>
            <b>{title}</b>
          </p>
          <p className={"hidden 2xl:block px-4"}>
            <i>
              {medium}
            </i>
          </p>
          <p className={"px-4"}>
            by {props.artist}
          </p>
          <p className={"pt-8 px-4 hidden 2xl:block"}>
            {description}
          </p>
          <p className={"pt-8 px-4 hidden 2xl:block"}>
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
};

export default Item;
