import { type ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { useData } from "vike-react/useData";

import InterfaceLink from "../../components/markup/interface-link.tsx";
import { Markdown } from "../../components/markup/markdown.tsx";
import { Header, StaticPage } from "../../components/markup/typography.tsx";
import Week from "../../data/Week.ts";

export default function Weeks() {
  const data: Record<string, Week> = useData();
  return (
    <>
      <Helmet>
        <title>{"Weeks | Design Refresh '22"}</title>
      </Helmet>
      <StaticPage>
        <Header>Weeks</Header>
        <div>
          {Object.values(data)
            .filter((week: Week) => week.isPublished)
            .map((week: Week) => {
              const weekDisplay: ReactElement = (
                <div key={week.week}>
                  <h3 className={"text-xl font-bold py-2 pt-3"}>
                    Week {week.week}: {week.theme}
                  </h3>

                  <Markdown markdown={week.information} />

                  <InterfaceLink location={`/?week=${week.week}`} title="Filter by Week" />
                </div>
              );

              return weekDisplay;
            })}
        </div>
      </StaticPage>
    </>
  );
}
