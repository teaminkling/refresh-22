import Link from "next/link";

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
   * perform some other kind of callback, it should be set to "#".
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
  clickBack?: () => void;

  /**
   * Whether this link should open in a new tab.
   *
   * Defaults to "no".
   */
  isExternal?: boolean;
}

/**
 * A responsive navigation item.
 *
 * @param {NavItemProps} props the props
 * @returns {JSX.Element} the element
 * @constructor
 */
const NavItem = (props: NavItemProps) => {
  const hoverAndActiveClasses = props.location ? (
    " hover:bg-gray-100 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
  ) : "";

  const boldedClasses = props.strong ? " font-bold" : "";

  // The spacing is different when there's an icon.

  const spacing = props.icon ? "px-1.5" : "";

  if (props.nextLink && props.location) {
    return (
      <Link href={props.location} passHref={false}>
        <a className={
          "block uppercase px-4 py-1 lg:text-lg focus:text-gray-900 "
          + boldedClasses
          + hoverAndActiveClasses
        }>
          {props.icon}<span className={spacing} />{props.title}
        </a>
      </Link>
    );
  } else {
    // Link is not a Next link.

    const clickBack: () => void = props.clickBack || (() => null);
    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        className={
          "block uppercase px-4 py-1 lg:text-lg focus:text-gray-900 "
          + boldedClasses
          + hoverAndActiveClasses
        }
        href={props.location}
        onClick={clickBack}
        target={props.isExternal ? "_blank" : undefined}
        rel={props.isExternal ? "noreferrer" : undefined}
      >
        {props.icon}<span className={spacing} />{props.title}
      </a>
    );
  }
};

export default NavItem;
