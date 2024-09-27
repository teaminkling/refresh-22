import { Helmet } from "react-helmet-async";
import { useData } from "vike-react/useData";

import InterfaceLink from "../../components/markup/interface-link.tsx";
import { Header, StaticPage } from "../../components/markup/typography.tsx";
import Artist from "../../data/Artist.ts";

const Artists = () => {
  const data: Record<string, Artist> = useData();
  return (
    <StaticPage>
      <Helmet>
        <title>{"Artists | Design Refresh '22"}</title>
      </Helmet>
      <Header>Artists</Header>
      <table className="w-full text-xl table-auto p-1 mt-4">
        <thead className="bg-gray-50 table-header-group">
          <tr className="table-row border-b border-black">
            <td className="p-4">
              <b>Name</b>
            </td>
            <td className="p-4 w-24">
              <b>Works</b>
            </td>
          </tr>
        </thead>
        <tbody>
          {Object.values(data)
            .filter((artist: Artist) => artist.worksCount && artist.worksCount > 0)
            .sort((artistA: Artist, artistB: Artist) => {
              return artistA.name.localeCompare(artistB.name);
            })
            .map((artist: Artist, count: number) => {
              return (
                <tr key={artist.name} className={"table-row " + (count % 2 == 1 ? "bg-gray-50" : "")}>
                  <td className="p-3">
                    <InterfaceLink location={`/artists/${artist.name}`} title={artist.name} />
                  </td>
                  <td className="text-center">{artist.worksCount}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </StaticPage>
  );
};

export default Artists;
