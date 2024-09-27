import { type ReactElement } from "react";

interface SquareLinkProps {
  location: string;
  icon: ReactElement;
  style: Record<string, string>;
}

export default function SquareLink(props: SquareLinkProps) {
  return (
    <a
      href={props.location}
      className="hover:bg-gray-100 focus:bg-gray-200 p-3 m-1 hover:text-black focus:text-black"
      style={props.style}
      target="_blank"
      rel="noreferrer"
    >
      {props.icon}
    </a>
  );
}
