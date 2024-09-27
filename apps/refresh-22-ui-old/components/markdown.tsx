import {ClassAttributes, PropsWithChildren} from "react";
import ReactMarkdown from "react-markdown";
import {ListItem, Paragraph, UnorderedList} from "./typography";

interface MarkdownProps {
  markdown: string;
}

export const Markdown = (props: MarkdownProps): JSX.Element => {
  // noinspection JSUnusedGlobalSymbols
  return (
    <div>
      <ReactMarkdown components={{
        h1: "b",
        h2: "b",
        h3: "b",
        h4: "b",
        h5: "b",
        h6: "b",
        p: (
          children: PropsWithChildren<ClassAttributes<unknown>>
        ) => <Paragraph>{children.children}</Paragraph>,
        ol: (
          children: PropsWithChildren<ClassAttributes<unknown>>
        ) => <UnorderedList>{children.children}</UnorderedList>,
        ul: (
          children: PropsWithChildren<ClassAttributes<unknown>>
        ) => <UnorderedList>{children.children}</UnorderedList>,
        li: (
          children: PropsWithChildren<ClassAttributes<unknown>>
        ) => <ListItem>{children.children}</ListItem>,
        a: (
          children: PropsWithChildren<ClassAttributes<HTMLAnchorElement>>
        ) => <a
          style={{color: "#7C7CE0"}}
          className={"hover:underline"}
          target={"_blank"}
          rel={"noreferrer"}
          {...children}
        >
          {children.children}
        </a>
      }}>
        {props.markdown}
      </ReactMarkdown>
    </div>
  );
};
