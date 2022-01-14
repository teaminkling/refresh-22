/**
 * The props for a {@link SquareLink}.
 */
interface SquareLinkProps {
  /**
   * The external URL.
   */
  location: string;

  /**
   * The icon to display as an HTML element.
   */
  icon: JSX.Element;
}

/**
 * An external link containing an icon.
 *
 * @param {SquareLinkProps} props the props
 * @returns {JSX.Element} the element
 * @constructor
 */
const SquareLink = (props: SquareLinkProps) => {
  return (
    <span>
      <a
        href={props.location}
        className={
          "hover:bg-gray-100 focus:bg-gray-200 p-3 m-1 hover:text-black focus:text-black"
        }
        target={"_blank"}
        rel="noreferrer"
      >
        {props.icon}
      </a>
    </span>
  );
};

export default SquareLink;
