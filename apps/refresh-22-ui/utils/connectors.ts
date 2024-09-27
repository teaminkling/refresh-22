import Artist from "../data/Artist.ts";
import Week from "../data/Week.ts";
import Work from "../data/Work.ts";
import savedArtists from "../data/saved/artists.json";
import savedWeeks from "../data/saved/weeks.json";
import savedWorks from "../data/saved/works.json";

export function fetchArtists() {
  const artists = savedArtists as Record<string, Artist>;

  Object.values(artists).forEach((artist) => {
    artist.worksCount = savedWorks.filter(work => work.artistId === artist.discordId).length;
  });

  return artists;
}

export function fetchWeeks() {
  return savedWeeks as Record<string, Week>;
}

export function fetchWorkById(id: string) {
  return Object.values(savedWorks).find(work => work.id === id) as Work;
}

export function fetchWorksByWeek(week: number) {
  return Object.values(savedWorks).filter(work => work.weekNumbers.includes(week)) as Work[];
}

export function fetchWorksByArtist(artist: string) {
  return Object.values(savedWorks).filter(work => work.artistId === artist) as Work[];
}
