import { createRef, useEffect } from "react";
import Hls, { type HlsConfig } from "hls.js";

import { usePlayerStore } from "@/store/usePlayerStore";

import { TypographyH1 } from "@/components/ui/typography-h1";

const hlsConfig: Partial<HlsConfig> = { debug: true };

function Player() {
  const selectedChanel = usePlayerStore((store) => store.selectedChanel);
  const playerRef = createRef<HTMLVideoElement>();

  useEffect(() => {
    let hls: Hls;

    function initPlayer() {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (hls != null) {
        hls.destroy();
      }

      const newHls = new Hls(hlsConfig);

      if (playerRef.current != null) {
        if (selectedChanel.id !== "00000000-0000-0000-0000-000000000000") {
          newHls.attachMedia(playerRef.current);
        }
      }

      newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
        if (selectedChanel.id !== "00000000-0000-0000-0000-000000000000") {
          newHls.loadSource(selectedChanel.url);
        }

        newHls.on(Hls.Events.MANIFEST_PARSED, () => {
          playerRef.current?.play().catch(() => {
            console.log(
              "Unable to autoplay prior to user interaction with the dom."
            );
          });
        });
      });

      newHls.on(Hls.Events.ERROR, function (_event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              newHls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              newHls.recoverMediaError();
              break;
            default:
              break;
          }
        }
      });

      hls = newHls;
    }

    if (Hls.isSupported()) {
      initPlayer();
    }

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (hls != null) {
        hls.destroy();
      }
    };
  }, [playerRef, selectedChanel]);

  return (
    <div>
      {Hls.isSupported() ? (
        <video
          ref={playerRef}
          className="w-full aspect-video rounded-md"
          controls
        />
      ) : (
        <video ref={playerRef} src={selectedChanel.url} />
      )}

      <TypographyH1 className="my-6">{selectedChanel.name}</TypographyH1>
    </div>
  );
}

export default Player;
