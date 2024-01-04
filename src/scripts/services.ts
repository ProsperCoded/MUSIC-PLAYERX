import { baseHost, get, getGenre } from "./APIServices";
import { hideLoading, newSong } from "./Elements";
import { performPlaylistRequest } from "./index";
import { PlaylistItem, SearchResponse, Track, OPERATION } from "./types";

// export type Playlist =
export async function extractRelevantResult(searchResponse: SearchResponse) {
  // track_name, genre, duration, preview, cover;
  let searchResult: PlaylistItem[] = [];
  for (let track of searchResponse.data) {
    let track_title = track.title;
    let genre = await getGenre(track);
    // Since this is just a preview we will always end up with 30sec audio
    // let duration = track.duration;
    let duration = 30;
    let preview = track.preview;
    let cover = track.album.cover_big;
    let artist = track.artist.name;
    searchResult.push({ artist, track_title, genre, duration, preview, cover });
  }
  return searchResult;
}

export function insertPlaylistItems(
  playListItems: PlaylistItem[],
  playListResultIndex: number,
  operation: OPERATION
) {
  playListItems.forEach((playlistItem, index) => {
    newSong(playlistItem, playListResultIndex, index, operation);
  });
  hideLoading();
}
export async function fetchMorePlaylistItems(
  searchResponses: SearchResponse[],
  query?: string
) {
  // console.log("generating more items");
  const first_result = searchResponses.at(-1);
  if (first_result && first_result.next) {
    const url = new URL(first_result.next);
    url.host = baseHost;
    let response2 = await get(url, "Error getting more result");
    console.log("inputting response", response2);
    performPlaylistRequest(response2, searchResponses.length, query);
  }
}
