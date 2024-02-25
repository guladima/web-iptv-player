import { Fragment, useState } from "react";
import { Pencil2Icon, UpdateIcon } from "@radix-ui/react-icons";

import {
  type Playlist,
  usePlayerStore,
  type UUID,
} from "@/store/usePlayerStore";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditPlaylistForm from "@/components/EditPlaylistForm";

function ChanelList() {
  const [playlist, setPlaylist] = useState<Playlist | object>({});
  const [editMode, setEditMode] = useState(false);
  const playlists = usePlayerStore((store) => store.playlists);
  const chanels = usePlayerStore((store) => store.chanels);
  const selectedChanel = usePlayerStore((store) => store.selectedChanel);
  const updatePlaylist = usePlayerStore((store) => store.updatePlaylist);
  const selectChanel = usePlayerStore((store) => store.selectChanel);

  function editPlaylist(id: UUID) {
    setEditMode(true);
    setPlaylist(playlists.find((playlist) => playlist.id === id) ?? {});
  }

  function closeDialog(state: boolean) {
    setEditMode(state);
    setPlaylist({});
  }

  // Scroll to chanel 43
  // document.querySelector("[data-radix-scroll-area-viewport]").scrollTo({ top: 2200, behavior: "smooth" })

  return (
    <>
      <Tabs
        defaultValue={
          selectedChanel.id === "00000000-0000-0000-0000-000000000000"
            ? "playlists"
            : "chanels"
        }
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="chanels">Chanels</TabsTrigger>
        </TabsList>
        <TabsContent value="playlists">
          <ScrollArea className="rounded-md border h-[513px]">
            <div className="p-4 space-y-2">
              {playlists.map((playlist, idx) => (
                <Button
                  key={playlist.id}
                  className="flex w-full justify-between cursor-default group py-6"
                >
                  {`${++idx}. ${playlist.name}`}
                  <div className="flex items-center opacity-0 group-hover:opacity-100 gap-2 transition-opacity duration-200">
                    <UpdateIcon
                      className="h-5 w-5 cursor-pointer"
                      onClick={() => {
                        void updatePlaylist(playlist.id);
                      }}
                    />
                    <Pencil2Icon
                      className="h-5 w-5 cursor-pointer"
                      onClick={() => {
                        editPlaylist(playlist.id);
                      }}
                    />
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="chanels">
          <ScrollArea className="rounded-md border h-[513px]">
            <div className="p-4 space-y-2">
              {chanels.map((chanel, idx) => (
                <Fragment key={chanel.id}>
                  <Button
                    className="block text-left w-full truncate"
                    variant={
                      selectedChanel.id === chanel.id ? "outline" : "default"
                    }
                    onClick={() => {
                      selectChanel(chanel.id);
                    }}
                  >{`${++idx}. ${chanel.name}`}</Button>
                </Fragment>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Dialog open={editMode} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit playlist</DialogTitle>

            <DialogDescription>
              Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <EditPlaylistForm onOpenChange={closeDialog} playlist={playlist} />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChanelList;
