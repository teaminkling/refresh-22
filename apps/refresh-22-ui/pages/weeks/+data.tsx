import { fetchWeeks } from "../../utils/connectors.ts";

export function data() {
  return fetchWeeks();
}
