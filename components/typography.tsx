import {PropsWithChildren} from "react";

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

export const Header = ({children}: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <h1 className={"text-5xl font-bold py-3 md:pt-10"}>
      {children}
    </h1>
  );
};

export const SubHeader = ({children}: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <h2 className={"text-3xl font-bold py-3"}>
      {children}
    </h2>
  );
};

export const Paragraph = ({children}: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <p className={"py-3"}>
      {children}
    </p>
  );
};

export const UnorderedList = ({children}: PropsWithChildren<Record<string, unknown>>) => {
  return (
    <ul className={"list-disc px-6 py-3"}>
      {children}
    </ul>
  );
};

export const ListItem = ({children}: PropsWithChildren<Record<string, unknown>>) => {
  return <li><p>{children}</p></li>;
};


export default StaticPage;
