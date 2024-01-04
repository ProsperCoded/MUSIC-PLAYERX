export const baseHost = "deezerdevs-deezer.p.rapidapi.com";
export const baseUrl = `https://${baseHost}`;
const options = {
  method: "GET",
  // mode: "cors",
  // mode: "no-cors",
  headers: {
    "X-RapidAPI-Key": "0ab218cc3emshc8f8ea7172d94aep1c16bdjsn7e11d9448037",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
  },
};
import { log } from "./general";
import { SearchResponse, Track } from "./types";
import { Album } from "./types";

export async function get(url: URL, preErrorMsg: string) {
  let result;
  try {
    const response = await fetch(url, options);
    result = await response.json();
  } catch (error) {
    console.error(preErrorMsg, error, `at: ${url.href}`);
    alert(preErrorMsg + error + `at: ${url.href}`);
    return undefined;
  }
  return result;
}
export async function searchDescription(q: string) {
  let url = new URL(`/search/?q=${q}`, baseUrl);
  let result = await get(url, "an error occurred when searching");
  return result as SearchResponse;
}

async function getAlbum(track: Track) {
  let album = track.album;
  let url = new URL(`/album/${album.id}`, baseUrl);

  let result = await get(
    url,
    "an error occurred when getting the album for " + album.title
  );
  return result as Album;
}
export async function getGenre(track: Track) {
  const album = await getAlbum(track);
  if (!album.genres.data[0]) {
    log(
      false,
      "Error with in getting genre for track:",
      track,
      "and album",
      album
    );
    return "None";
  }
  return album.genres.data[0].name;
}
// export function getQueryString(url: string) {}
export async function getTopTracks(no: number) {
  const url = new URL(`/chart/${no}/tracks`, baseUrl);
  // const url = new URL("https://api.deezer.com/chart/0/tracks");
  const response = await get(url, "Couldn't fetch top data");
  return response;
}
