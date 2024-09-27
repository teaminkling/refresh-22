import { useState } from "react";

interface OmnitoolProps {
  artist?: string | null;
  week?: number | null;
  sort?: string | null;
  search?: string | null;
  page?: number | null;
}

export default function Omnitool(props: OmnitoolProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const router = useRouter();
  const query: ParsedUrlQuery = router.query;

  const _rawP: string | string[] | undefined = query.p;
  const page: string = (typeof _rawP === "object" ? _rawP[0] : _rawP) || "1";

  // Keep track of the sort for button effects.

  const _rawSort: string | string[] | undefined = query.sort;
  const sort: string | undefined = typeof _rawSort === "object" ? _rawSort[0] : _rawSort;

  // Determine the query strings that will be mutated when buttons are pressed.

  const _previousPage: ParsedUrlQuery = Object.fromEntries(Object.entries(query));

  _previousPage.p = Math.max(parseInt(page) - 1, 1).toString();

  const _nextPage: ParsedUrlQuery = Object.fromEntries(Object.entries(query));

  _nextPage.p = (parseInt(page) + 1).toString();

  const _sortDescending: ParsedUrlQuery = Object.fromEntries(Object.entries(query));

  _sortDescending.sort = "descending";

  const _sortAscending: ParsedUrlQuery = Object.fromEntries(Object.entries(query));

  _sortAscending.sort = "ascending";

  const _sortRandom: ParsedUrlQuery = Object.fromEntries(Object.entries(query));

  _sortRandom.sort = "random";
  _sortRandom.p = "1";

  const previousPageText = Object.entries(_previousPage)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join("&");
  const nextPageText = Object.entries(_nextPage)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join("&");
  const sortDescendingText = Object.entries(_sortDescending)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join("&");
  const sortAscendingText = Object.entries(_sortAscending)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join("&");
  const sortRandomText = Object.entries(_sortRandom)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join("&");

  return isOpen ? (
    <div
      className={"bg-black m-auto m-4 bottom-4 md:bottom-8 text-white px-2 py-3 sticky float-right text-sm"}
      style={{ width: 260, backgroundColor: "#7C7CE0" }}
    >
      <div className={"flex flex-row py-2 items-center"}>
        <p className={"pl-4 pr-2 flex-grow items-center"}>
          <b>Gallery Controls</b>
        </p>
        <span className={"justify-end"}>
          <a
            href={"#action"}
            className={"hover:bg-gray-100 focus:bg-gray-200 p-3 m-1 hover:text-black focus:text-black"}
            onClick={() => setIsOpen(!isOpen)}
          >
            {<FontAwesomeIcon icon={faTimes} fixedWidth />}
          </a>
        </span>
      </div>

      <div className={"flex flex-row py-2 justify-center"}>
        <span>
          <Link href={`?${previousPageText}`} legacyBehavior>
            <a className={"hover:bg-gray-100 p-3 m-1 hover:text-black"}>
              <FontAwesomeIcon icon={faAngleLeft} fixedWidth />
            </a>
          </Link>
        </span>

        <p className={"px-2"}>Page {page}</p>

        <span>
          <Link href={`?${nextPageText}`} legacyBehavior>
            <a className={"hover:bg-gray-100 p-3 m-1 hover:text-black"}>
              <FontAwesomeIcon icon={faAngleRight} fixedWidth />
            </a>
          </Link>
        </span>
      </div>

      {props.week || props.artist ? (
        <div className={"flex flex-row py-2 justify-center"}>
          <span>
            <FontAwesomeIcon icon={faFilter} />
          </span>

          {props.artist ? (
            <p className={"px-2 text-center"}>
              <b>Artist:</b> {props.artist}
            </p>
          ) : (
            <></>
          )}

          {props.week ? (
            <p className={"px-2 text-center"}>
              <b>Week:</b> {props.week}
            </p>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}

      <div className={"flex flex-row py-2 justify-center items-center"}>
        <p className={"px-2 text-center"}>
          <b>Sort:</b>
        </p>

        <span>
          <Link href={`?${sortDescendingText}`} legacyBehavior>
            <a
              className={
                "hover:bg-gray-100 p-3 m-1 hover:text-black " +
                (!sort || sort === "descending" ? "bg-gray-200 text-black" : "")
              }
            >
              <FontAwesomeIcon icon={faSortAmountDown} />
            </a>
          </Link>
        </span>

        <span>
          <Link href={`?${sortAscendingText}`} legacyBehavior>
            <a
              className={
                "hover:bg-gray-100 p-3 m-1 hover:text-black " + (sort === "ascending" ? "bg-gray-200 text-black" : "")
              }
            >
              <FontAwesomeIcon icon={faSortAmountUp} />
            </a>
          </Link>
        </span>

        <span>
          <Link href={`?${sortRandomText}`} legacyBehavior>
            <a
              className={
                "hover:bg-gray-100 p-3 m-1 hover:text-black " + (sort === "random" ? "bg-gray-200 text-black" : "")
              }
            >
              <FontAwesomeIcon icon={faRandom} />
            </a>
          </Link>
        </span>
      </div>
    </div>
  ) : (
    <>
      <div
        className={"bg-black md:m-4 bottom-4 md:bottom-8 text-white py-4 sticky float-right " + "mr-2 text-center"}
        style={{ width: 54, backgroundColor: "#7C7CE0" }}
      >
        <span>
          <a
            href={"#action"}
            className={"hover:bg-gray-100 focus:bg-gray-200 p-3 m-1 hover:text-black focus:text-black"}
            onClick={() => setIsOpen(!isOpen)}
          >
            {<FontAwesomeIcon icon={faFilter} fixedWidth />}
          </a>
        </span>
      </div>
    </>
  );
}
