import {PropsWithChildren} from "react";

/**
 * A page with textual content.
 *
 * @param {PropsWithChildren} children the children elements
 * @returns {JSX.Element} the element
 * @constructor
 */
const StaticPage = ({children}: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <div className={"xl:mr-10 my-4 pb-8"}>
      <div className={"text-lg px-8"} style={
        {maxWidth: 800}
      }>
        {children}
      </div>
    </div>
  );
};

/**
 * A large H1 header.
 *
 * @param {PropsWithChildren} children the children elements
 * @returns {JSX.Element} the element
 * @constructor
 */
export const Header = ({children}: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <h1 className={"text-5xl font-bold py-3 md:pt-10"}>
      {children}
    </h1>
  );
};

/**
 * A medium-sized H2 header.
 *
 * Note that H2 is the smallest header size we'll be using for now.
 *
 * @param {PropsWithChildren} children the children elements
 * @returns {JSX.Element} the element
 * @constructor
 */
export const SubHeader = ({children}: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <h2 className={"text-3xl font-bold py-3"}>
      {children}
    </h2>
  );
};
/**
 * A paragraph.
 *
 * @param {PropsWithChildren} children the children elements
 * @returns {JSX.Element} the element
 * @constructor
 */
export const Paragraph = ({children}: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <p className={"py-3"} style={{hyphens: "auto"}} lang={"en"}>
      {children}
    </p>
  );
};

/**
 * An unordered list.
 *
 * @param {PropsWithChildren} children the children elements
 * @returns {JSX.Element} the element
 * @constructor
 */
export const UnorderedList = ({children}: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <ul className={"list-disc px-6 py-3"}>
      {children}
    </ul>
  );
};

/**
 * A list item.
 *
 * @param {PropsWithChildren} children the children elements
 * @returns {JSX.Element} the element
 * @constructor
 */
export const ListItem = ({children}: PropsWithChildren<Record<string, unknown>>) => {
  return <li><p>{children}</p></li>;
};


export default StaticPage;
