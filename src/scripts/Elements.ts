import { convertSecToString, log } from "./general";
import { getSong, playSong } from "./index";
import { PlaylistItem, OPERATION } from "./types";

export const slider__input = document.querySelector(
  ".slider__input"
) as HTMLInputElement;
export const playButton = document.querySelector(".play") as HTMLElement;
export const pauseButton = document.querySelector(".pause") as HTMLElement;
export const playlist_page = document.querySelector(".playlist") as HTMLElement;
export const search = document.querySelector(".search") as HTMLInputElement;

export const songList = document.querySelector(".song-list") as Element;
export const song_artist = document.querySelector(
  ".song-info__artist"
) as HTMLElement;
export const song_title = document.querySelector(
  ".song-info__title"
) as HTMLElement;
const songElement = songList.querySelector(".song") as Element;
const body = document.querySelector("body") as HTMLElement;
export const slider_label = {
  start: document.querySelector(".slider__label-start") as HTMLElement,
  end: document.querySelector(".slider__label-end") as HTMLElement,
};
const loading_and_hint = document.querySelector(".loading-icon");

export function newSong(
  { track_title, genre, duration, preview, cover, artist }: PlaylistItem,
  playListResultIndex: number,
  playlistIndex: number,
  operation: OPERATION
) {
  const clone = songElement.cloneNode(true) as HTMLElement;
  clone.classList.remove("d-none");
  clone.classList.add("active");
  (clone.querySelector(".song__artist") as Element).textContent = artist;
  (clone.querySelector(".genre") as Element).textContent = genre;
  (clone.querySelector(".song__name") as Element).textContent = track_title;
  (clone.querySelector(".duration__value") as Element).textContent =
    convertSecToString(duration);

  clone.dataset.playlistResultIndex = playListResultIndex.toString();
  clone.dataset.playlistIndex = playlistIndex.toString();
  clone.dataset.operation = operation.toString();

  clone.addEventListener("click", (e) => {
    const song = getSong(clone);
    if (song) {
      playSong(song);
    } else {
      log(
        true,
        "Song doesn't exist in list in ",
        playListResultIndex,
        playlistIndex
      );
    }
  });
  songList.insertBefore(clone, loading_and_hint);
  return clone;
}

export function cleanPlaylist() {
  const songs = songList.querySelectorAll(".active");
  songs.forEach((song) => {
    songList.removeChild(song);
  });
}

export function insertSongValues(song: PlaylistItem) {
  song_artist.textContent = song.artist;
  song_title.textContent = song.track_title;
  body.style.backgroundImage = `url(${song.cover})`;
}

export function showLoading() {
  loading_and_hint?.querySelector(".icon")!.classList.remove("d-none");
  // songList.classList.add("loading");
  // console.log("showing loading");
}
export function hideLoading() {
  loading_and_hint?.querySelector(".icon")!.classList.add("d-none");
  // songList.classList.remove("loading");
  // console.log("hiding loading");
}
export function showHint() {
  loading_and_hint?.querySelector("p")!.classList.remove("d-none");
}
export function hideHint() {
  loading_and_hint?.querySelector("p")!.classList.add("d-none");
}
