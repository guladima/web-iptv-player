import { create } from "zustand";
import { persist } from "zustand/middleware";

class NotFoundException extends Error {
  constructor(type: "playlist" | "chanel", id: UUID) {
    super(`Not found ${type} with id: ${id}`);
  }
}

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

interface Chanel {
  id: UUID;
  name: string;
  url: string;
}

export interface Playlist {
  id: UUID;
  name: string;
  url: string;
  chanels: Chanel[];
  updatedAt: number;
  editedAt: number;
  createdAt: number;
}

interface PlayerState {
  playlists: Playlist[];
  chanels: Chanel[];
  selectedPlaylist: UUID;
  selectedChanel: Chanel;

  addPlaylist: (name: string, url: string) => Promise<void>;
  updatePlaylist: (id: UUID) => Promise<void>;
  editPlaylist: (id: UUID, name: string, url: string) => boolean;
  selectPlaylist: (id: UUID) => void;
  selectChanel: (id: UUID) => void;
  deletePlaylist: (id: UUID) => boolean;
}

export const usePlayerStore = create(
  persist<PlayerState>(
    (set, get) => ({
      playlists: [],
      chanels: [],
      selectedPlaylist: "00000000-0000-0000-0000-000000000000",
      selectedChanel: {
        id: "00000000-0000-0000-0000-000000000000",
        name: "",
        url: "",
      },

      addPlaylist: async (name, url) => {
        const response = await fetch(url);
        const newChanels = await response.text().then((str) => {
          const arr: Chanel[] = [];
          let newChanelName: string;

          str.split("\n").forEach((val) => {
            if (val.startsWith("#EXTINF")) {
              newChanelName = val.split(",")[1];
            }

            if (val.startsWith("http")) {
              arr.push({
                id: self.crypto.randomUUID(),
                name: newChanelName,
                url: val,
              });
            }
          });

          return arr;
        });

        set((store) => {
          const id = self.crypto.randomUUID();

          return {
            playlists: [
              ...store.playlists,
              {
                id,
                name,
                url,
                chanels: newChanels,
                updatedAt: Date.now(),
                editedAt: Date.now(),
                createdAt: Date.now(),
              },
            ],
            chanels: newChanels,
            selectedPlaylist: id,
            selectedChanel: newChanels[0],
          };
        });
      },

      updatePlaylist: async (id) => {
        const playlists = get().playlists;
        const selectedPlaylist = get().selectedPlaylist;
        const playlist = playlists.find((playlist) => playlist.id === id);

        if (!playlist) throw new NotFoundException("playlist", id);

        const response = await fetch(playlist.url);
        const newChanels = await response.text().then((str) => {
          const arr: Chanel[] = [];
          let newChanelName: string;

          str.split("\n").forEach((val) => {
            if (val.startsWith("#EXTINF")) {
              newChanelName = val.split(",")[1];
            }

            if (val.startsWith("http")) {
              arr.push({
                id: self.crypto.randomUUID(),
                name: newChanelName,
                url: val,
              });
            }
          });

          return arr;
        });

        const newPlaylists = playlists.map((playlist) => {
          if (playlist.id !== id) return playlist;

          return {
            id,
            name: playlist.name,
            url: playlist.url,
            chanels: newChanels,
            updatedAt: Date.now(),
            editedAt: playlist.editedAt,
            createdAt: playlist.createdAt,
          };
        });

        set(() => {
          if (selectedPlaylist === id) {
            return {
              playlists: newPlaylists,
              chanels: newChanels,
            };
          } else {
            return {
              playlists: newPlaylists,
            };
          }
        });
      },

      editPlaylist: (id, name, url) => {
        const playlists = get().playlists;
        const playlist = playlists.find((playlist) => playlist.id === id);

        if (!playlist) {
          throw new NotFoundException("playlist", id);
        }

        const newPlaylists = playlists.map((playlist) => {
          if (playlist.id !== id) return playlist;

          return {
            id,
            name,
            url,
            chanels: playlist.chanels,
            updatedAt: playlist.updatedAt,
            editedAt: Date.now(),
            createdAt: playlist.createdAt,
          };
        });

        set(() => {
          return {
            playlists: newPlaylists,
          };
        });

        return true;
      },

      selectPlaylist: (id) => {
        set((store) => {
          return {
            selectedPlaylist: id,
            chanels:
              store.playlists.find((playlist) => playlist.id === id)?.chanels ??
              [],
          };
        });
      },

      selectChanel: (id) => {
        const chanel = get().chanels.find((chanel) => chanel.id === id);

        if (!chanel) {
          throw new NotFoundException("chanel", id);
        }

        set(() => {
          return {
            selectedChanel: chanel,
          };
        });
      },

      deletePlaylist: (id) => {
        const playlists = get().playlists.filter((playlist) => {
          if (playlist.id !== id) return playlist;
        });

        set(() => {
          if (playlists.length !== 0) {
            return {
              playlists,
              chanels: playlists[0].chanels,
              selectedPlaylist: playlists[0].id,
              selectedChanel: playlists[0].chanels[0],
            };
          } else {
            return {
              playlists,
              chanels: [],
              selectedPlaylist: "00000000-0000-0000-0000-000000000000",
              selectedChanel: {
                id: "00000000-0000-0000-0000-000000000000",
                name: "",
                url: "",
              },
            };
          }
        });

        return true;
      },
    }),
    { name: "player-state" }
  )
);
