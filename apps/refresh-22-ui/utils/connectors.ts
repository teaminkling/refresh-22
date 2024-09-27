import Artist from "../data/Artist.ts";
import Week from "../data/Week.ts";
import Work from "../data/Work.ts";
import savedWeeks from "../data/saved/weeks.json";

// TODO: Replace network calls with local data.
// TODO: Replace runtime calls with build-time calls.

async function fetchGeneric<T = unknown>(endpoint: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8787"}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as T;
}

export async function fetchArtists() {
  return fetchGeneric<Artist[]>("/api/artists");
}

export function fetchWeeks() {
  return savedWeeks as Record<string, Week>;
}

export async function fetchWorkById(id: string) {
  return fetchGeneric<Work>(`/api/work?id=${id}`);
}

export async function fetchWorksByWeek(week: number) {
  return fetchGeneric<Work[]>(`/api/works?week=${week}`);
}

export async function fetchWorksByArtist(artist: string) {
  return fetchGeneric<Work[]>(`/api/works?artist=${artist}`);
}
