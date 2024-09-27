import Work from "../../../data/Work.ts";
import { fetchWorks } from "../../../utils/connectors.ts";

export default function onBeforePrerenderStart() {
  return fetchWorks().map((work: Work) => {
    return `/works/${work.id}`;
  });
}
