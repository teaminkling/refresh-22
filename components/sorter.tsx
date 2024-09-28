import { FaRandom, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

import SquareLink from "./markup/square-link.tsx";

interface SorterProps {
  sort?: string | null;
}

export default function Sorter(props: SorterProps) {
  // Changing the sort always resets the page to 1, but retains the filter and search query.

  const params = new URLSearchParams(window.location.search);

  const search = params.get("q");
  const artist = params.get("artist");
  const week = params.get("week");

  const searchParam = search ? `&q=${search}` : "";
  const artistParam = artist ? `&artist=${artist}` : "";
  const weekParam = week ? `&week=${week}` : "";

  const newParams = `${searchParam}${artistParam}${weekParam}`;

  return (
    <div className="flex flex-row ml-0 md:ml-3 py-2 items-center justify-center md:justify-start">
      <p className="px-2 text-center">
        <b>Sort:</b>
      </p>

      <SquareLink
        location={`?sort=descending${newParams}`}
        icon={<FaSortAmountDown />}
        isInternal
        isDisabled={props.sort === "descending"}
      />
      <SquareLink
        location={`?sort=ascending${newParams}`}
        icon={<FaSortAmountUp />}
        isInternal
        isDisabled={props.sort === "ascending"}
      />
      <SquareLink location={`?sort=random${newParams}`} icon={<FaRandom />} isInternal isDisabled={!props.sort} />
    </div>
  );
}
