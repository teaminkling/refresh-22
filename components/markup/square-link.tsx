import { type ReactElement } from "react";

interface SquareLinkProps {
  location: string;
  icon: ReactElement;
  style?: Record<string, string>;
  isInternal?: boolean;
  isDisabled?: boolean;
}

export default function SquareLink(props: SquareLinkProps) {
  const disabledClasses = props.isDisabled
    ? "opacity-50 cursor-not-allowed"
    : "hover:bg-gray-100 focus:bg-gray-200 hover:text-black focus:text-black";

  return (
    <a
      href={props.isDisabled ? undefined : props.location}
      className={"p-3 m-1 " + disabledClasses}
      style={props.style}
      target={props.isInternal ? undefined : "_blank"}
      rel={props.isInternal ? undefined : "noreferrer"}
    >
      {props.icon}
    </a>
  );
}
