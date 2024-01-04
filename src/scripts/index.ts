import "./../styles/index.scss";
import { getTopTracks, searchDescription } from "./APIServices";

import {
  hideHint,
  cleanPlaylist,
  hideLoading,
  insertSongValues,
  pauseButton,
  playButton,
  playlist_page,
  search,
  showLoading,
  slider__input,
  slider_label,
  songList,
} from "./Elements";
import {
  extractRelevantResult,
  fetchMorePlaylistItems,
  insertPlaylistItems,
} from "./services";
import {
  PlaylistItem,
  Track,
  SearchResponse,
  OPERATION,
  PLAYER,
  History,
} from "./types";

let currentOperation: OPERATION;
let SEARCH: History = {
  Results: [],
  Responses: [],
  query: "",
};
let TOP: History = {
  Results: [],
  Responses: [],
};
// let search = {no: 1}
// let SEARCH.Results: PlaylistItem[][] = [];
// let SEARCH.Responses: SearchResponse[] = [];
let Player: PLAYER;
const player_increment = 5;
slider__input.value = Math.ceil(parseInt(slider__input.max) / 2).toString();

// updateSliderLabel();
// function updateSliderLabel(): void {
//   const label = document.querySelector(".slider__label");
//   if (label instanceof Element) {
//     label.textContent = slider__input.value;
//   }
// }
// slider__input.addEventListener("input", (e) => {
//   if (e.target instanceof HTMLInputElement) {
//     updateSliderLabel();
//   }
// });

// document.addEventListener("DOMContentLoaded", (e) => {
//   // fetchMorePlayListItems(SEARCH.Responses);
//   getTopTracks(0).then((response) => {
//     currentOperation = OPERATION.TOP_TRACKS;
//     performPlaylistRequest(response, TOP.Results.length);
//   });
// });

document.querySelector(".playlist__toggler")?.addEventListener("click", () => {
  playlist_page.classList.toggle("active");
  if (playlist_page.classList.contains("active")) {
    const search = playlist_page.querySelector(".search") as HTMLInputElement;
    search.focus();
  }
});
document
  .querySelector(".playlist__toggler-close")
  ?.addEventListener("click", () => {
    playlist_page.classList.remove("active");
  });

playButton?.addEventListener("click", () => {
  playButton?.classList.add("d-none");
  pauseButton?.classList.remove("d-none");

  if (Player) {
    Player.play();
  }
});
pauseButton?.addEventListener("click", () => {
  pauseButton?.classList.add("d-none");
  playButton?.classList.remove("d-none");

  if (Player) {
    Player.pause();
  }
});

search.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter" && search.value) {
    cleanPlaylist();
    hideHint();
    searchDescription(search.value).then((response): void => {
      if (response.total > 0) {
        // Reset Search History List
        SEARCH.Results = [];
        SEARCH.Responses = [];
        SEARCH.query = search.value;
        currentOperation = OPERATION.SEARCH;
        performPlaylistRequest(response, SEARCH.Results.length, SEARCH.query);
      } else {
        console.log("no result for this search");
      }
    });
  }
});

export async function performPlaylistRequest(
  response: SearchResponse,
  playlistResultIndex: number,
  // query is a parameter to compare if user searched for something else, while processing current request
  query?: string
) {
  showLoading();
  const result = await extractRelevantResult(response);
  if (query && query !== SEARCH.query) {
    // This is to prevent inserting items that arrive late, for previous queries after waiting for extractRelevantResult()
    return;
  }

  // Adding to search history
  if (currentOperation == OPERATION.SEARCH) {
    SEARCH.Responses.push(response);
    SEARCH.Results.push(result);
  }
  if (currentOperation == OPERATION.TOP_TRACKS) {
    TOP.Responses.push(response);
    TOP.Results.push(result);
  }

  insertPlaylistItems(result, playlistResultIndex, currentOperation);
}
songList.addEventListener("scroll", (e) => {
  if (songList.scrollHeight <= songList.clientHeight + songList.scrollTop) {
    // generating more search results...
    if (currentOperation == OPERATION.SEARCH) {
      fetchMorePlaylistItems(SEARCH.Responses, SEARCH.query);
    } else if (currentOperation == OPERATION.TOP_TRACKS) {
      fetchMorePlaylistItems(TOP.Responses, SEARCH.query);
    }
  }
});

// Song Playing features
export function getSong(songElement: HTMLElement): PlaylistItem | undefined {
  const playlistResultIndex = parseInt(
    songElement.dataset.playlistResultIndex as string
  );
  const playlistIndex = parseInt(songElement.dataset.playlistIndex as string);
  const operation: OPERATION = parseInt(
    songElement.dataset.operation as string
  );
  let song: PlaylistItem;
  if (operation === OPERATION.SEARCH) {
    song = SEARCH.Results[playlistResultIndex][playlistIndex];
    return song;
  }
}
export function playSong(song: PlaylistItem) {
  if (Player) {
    Player.stop();
  }
  Player = new PLAYER(
    song,
    slider_label.start,
    slider_label.end,
    slider__input,
    player_increment
  );
  insertSongValues(song);
  Player.play();

  playButton?.classList.add("d-none");
  pauseButton?.classList.remove("d-none");

  Player.ontimeupdate = (e) => {
    Player.updateStatus();
  };
}

// Controls
document
  .querySelector(".playback.playback--forward")
  ?.addEventListener("click", (e) => {
    if (Player) {
      Player.forward();
    }
  });
document
  .querySelector(".playback.playback--backward")
  ?.addEventListener("click", (e) => {
    if (Player) {
      Player.backward();
    }
  });
