import { type ReactElement } from "react";

interface NavItemProps {
  location?: string;
  onClick?: (arg?: unknown) => void;

  title: string;
  icon?: ReactElement;
}

const InterfaceLink = (props: NavItemProps) => {
  return (
    <a
      href={props.location}
      onClick={void props.onClick}
      className={
        "block uppercase px-4 py-1 md:text-md focus:text-gray-900 hover:bg-gray-100 focus:bg-gray-200 " +
        "focus:outline-none focus:shadow-outline flex"
      }
    >
      {props.icon ? <span className="my-auto">{props.icon}</span> : null}

      <span className={props.icon ? "px-1.5" : ""} />

      {props.title}
    </a>
  );
};

export default InterfaceLink;
