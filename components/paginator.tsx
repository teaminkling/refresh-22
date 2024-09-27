import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

import type Work from "../data/Work.ts";
import { POSTS_PER_PAGE } from "../pages/index/+Page.tsx";
import SquareLink from "./markup/square-link.tsx";

interface PaginatorProps {
  worksMatchingQuery: Work[];
}

export default function Paginator({ worksMatchingQuery }: PaginatorProps) {
  const query = new URLSearchParams(window.location.search);

  const page: string | null = query.get("p");

  const artist: string | null = query.get("artist");
  const week: string | null = query.get("week");
  const search: string | null = query.get("q");
  const sort: string | null = query.get("sort");

  const maxPage = Math.ceil(worksMatchingQuery.length / POSTS_PER_PAGE);

  const previousPage = page && parseInt(page) > 1 ? parseInt(page) - 1 : 1;
  const nextPage = page ? (page && parseInt(page) < maxPage ? parseInt(page) + 1 : maxPage) : maxPage > 1 ? 2 : 1;

  const sortParam = sort && sort !== "random" ? `&sort=${sort}` : "";
  const artistParam = artist ? `&artist=${artist}` : "";
  const weekParam = week ? `&week=${week}` : "";
  const searchParam = search ? `&q=${search}` : "";

  const newParams = `${sortParam}${artistParam}${weekParam}${searchParam}`;

  return (
    <div className="flex pb-5">
      <SquareLink
        location={`?p=${previousPage}${newParams}`}
        icon={<FaAngleDoubleLeft />}
        isInternal
        isDisabled={parseInt(page || "1") <= 1}
      />
      <p className="mx-5 my-auto">
        Page {page || 1} of {maxPage}
      </p>
      <SquareLink
        location={`?p=${nextPage}${newParams}`}
        icon={<FaAngleDoubleRight />}
        isInternal
        isDisabled={parseInt(page || "1") >= maxPage}
      />
    </div>
  );
}
