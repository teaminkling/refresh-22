import { PropsWithChildren } from "react";

export function StaticPage(props: PropsWithChildren) {
  return (
    <div className="xl:mr-10 my-4 pb-8">
      <div className="text-lg px-8" style={{ maxWidth: 800 }}>
        {props.children}
      </div>
    </div>
  );
}

export function Header(props: PropsWithChildren) {
  return <h1 className="text-5xl font-bold py-3 md:pt-10">{props.children}</h1>;
}

export function SubHeader(props: PropsWithChildren) {
  return <h2 className="text-3xl font-bold py-3">{props.children}</h2>;
}

export function Paragraph(props: PropsWithChildren) {
  return <p className="py-3">{props.children}</p>;
}

export function UnorderedList(props: PropsWithChildren) {
  return <ul className="list-disc px-6 py-3">{props.children}</ul>;
}

export function ListItem(props: PropsWithChildren) {
  return (
    <li>
      <p>{props.children}</p>
    </li>
  );
}
