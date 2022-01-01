import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {useState} from "react";

/**
 * Props for a navigation item.
 */
interface NavItemProps {
  /**
   * Whether the item is a Next link.
   */
  nextLink?: boolean;

  /**
   * Where the nav item goes.
   *
   * If this is not present, it's not a link. If it is simply intended to log in a user or
   * perform some other kind of callback, it should be set to `#`.
   */
  location?: string;

  /**
   * What the nav item says.
   */
  title: string;

  /**
   * The icon, optionally. Appears to the left of the text with a slight padding.
   */
  icon?: JSX.Element;

  /**
   * Whether the item should be semibold.
   */
  strong?: boolean;

  /**
   * An optional callback that will be called when the nav item is clicked.
   *
   * This only applies if the link is not a Next link.
   */
  clickBack?: (arg?: unknown) => Promise<void>;
}

/**
 * A responsive navigation item.
 *
 * @param {NavItemProps} props the props
 * @returns {JSX.Element} the element
 * @constructor
 */
const InterfaceLink = (props: NavItemProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const hoverAndActiveClasses = props.location ? (
    " hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:shadow-outline "
  ) : " ";

  const boldedClasses = props.strong ? " font-bold" : "";

  // The spacing is different when there's an icon.

  const spacing = props.icon ? "px-1.5" : "";

  // The link is either a Next link or not.

  if (props.nextLink && props.location) {
    return (
      <Link href={props.location} passHref={false}>
        <a className={
          "block uppercase px-4 py-1 md:text-md focus:text-gray-900 "
          + boldedClasses
          + hoverAndActiveClasses
        }>
          {props.icon}<span className={spacing} />{props.title}
        </a>
      </Link>
    );
  } else {
    // Link is not a Next link: decoration, JS link, or external link.

    const clickBack: () => Promise<void> = props.clickBack || (() => Promise.resolve());

    // When clicking the link, it should only be clickable once. Augment the onclick such that
    // clicking it once will disable the link until the request finishes where it will re-enable it.

    const augmentedClickBack = () => {
      setIsLoading(true);

      clickBack().then(() => setIsLoading(false));
    };

    // The link is styled differently depending on loading status:

    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        href={props.location}
        onClick={isLoading ? () => null : augmentedClickBack}
        suppressHydrationWarning
        className={(
          isLoading ? "cursor-not-allowed " : ""
            + "block uppercase px-4 py-1 md:text-md focus:text-gray-900 "
            + boldedClasses
            + hoverAndActiveClasses
        )}
      >
        {isLoading ? <FontAwesomeIcon icon={faSpinner} spin className={"mr-3"} /> : props.icon}
        <span className={spacing} />
        {isLoading ? "Please Wait" : props.title}
      </a>
    );
  }
};

export default InterfaceLink;
