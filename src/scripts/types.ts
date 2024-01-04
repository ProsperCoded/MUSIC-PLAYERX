import { insertSongValues } from "./Elements";
import { convertSecToString } from "./general";

export type Album = {
  id: number;
  title: string;
  cover: string;
  genres: { data: [{ id: number; name: string }] };
  type: "album";
  tracks: { data: Track[] };
};
export type Track = {
  id?: number;
  duration: number;
  title: string;
  artist: { id?: number; name: string };
  album: { id?: number; title: number; cover_big: string };
  preview: string;
};
export type SearchResponse = {
  data: Track[];
  prev: string;
  next: string;
  total: number;
};

export type PlaylistItem = {
  artist: string;
  track_title: string;
  genre: string;
  duration: number;
  preview: string;
  cover: string;
};
export type TrackListPage = [{ data: Track[] }];
export enum OPERATION {
  SEARCH,
  TOP_TRACKS,
}

// export type Player = {
//   audio_player: Audio;
//   song: PlaylistItem;
// };

// interface Player {
// audio_player: Audio;
// }
export type History = {
  Results: PlaylistItem[][];
  Responses: SearchResponse[];
  query?: string;
};
export class PLAYER extends Audio {
  public song: PlaylistItem;
  private increment: number;
  constructor(
    song: PlaylistItem,
    public startLabel: HTMLElement,
    public endLabel: HTMLElement,
    public slider: HTMLInputElement,
    increment?: number
  ) {
    super(song.preview);
    this.song = song;
    if (!increment) {
      this.increment = 5;
    } else if (song.duration >= increment) {
      this.increment = increment;
    } else throw new Error("Increment is more than audio duration");

    this.startLabel.textContent = "0:00";
    this.endLabel.textContent = convertSecToString(song.duration);
    this.slider.min = "0";
    this.slider.max = this.song.duration.toString();
    this.slider.value = "0";
    this.slider.onchange = (e) => {
      this.setStatus(parseInt((e.target as HTMLInputElement).value));
    };
  }
  restart() {
    this.currentTime = 0;
    this.play();
  }
  stop() {
    this.pause();
    this.currentTime = 0;
    this.updateStatus();
  }
  updateStatus() {
    this.startLabel.textContent = convertSecToString(this.currentTime);
    this.slider.value = this.currentTime.toString();
  }
  protected setStatus(sec: number) {
    this.currentTime = sec;
    this.startLabel.textContent = convertSecToString(sec);
    this.slider.value = this.currentSrc.toString();
  }
  forward() {
    // if(this.currentTime + this.increment > )
    if (this.currentTime >= this.duration) {
      this.restart();
      return;
    }
    this.currentTime += this.increment;
    this.updateStatus();
  }
  backward() {
    if (this.currentTime <= 0) {
      this.restart();
      return;
    }
    this.currentTime -= this.increment;
    this.updateStatus();
  }
}
