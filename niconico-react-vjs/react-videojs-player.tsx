import videojs from "video.js";
import "video.js/dist/video-js.min.css";
import {
  type ReactNode,
  createContext,
  useEffect,
  useRef,
  useContext,
  useState,
} from "react";
import type Player from "video.js/dist/types/player";
import React from "react";

interface ReactVideoJSPlayerProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: any;
  id: string;
  options?: any;
  children?: ReactNode;
}
const ReactVideoJSPlayer: React.FunctionComponent<ReactVideoJSPlayerProps> = ({
  src,
  id,
  options = {},
  children,
  className,
  ...props
}: ReactVideoJSPlayerProps) => {
  const player = useRef<Player | undefined>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const videoElem = document.querySelector<HTMLVideoElement>(`#${id}`);

    if (videoElem !== null) {
      player.current = videojs(videoElem, options, () => {
        setIsReady(true);
      });
    }
  }, []);

  useEffect(() => {
    player.current?.src(src);
  }, [src]);

  return (
    <>
      <video
        id={id}
        className={
          (className !== undefined ? className + " " : "") + "video-js"
        }
        {...props}
      ></video>
      {isReady && player.current !== undefined && (
        <VideoJsPlayerCtx.Provider value={player.current}>
          {children}
        </VideoJsPlayerCtx.Provider>
      )}
    </>
  );
};

export default ReactVideoJSPlayer;

export const VideoJsPlayerCtx = createContext<Player | null>(null);
export const useVideoJS: () => Player = () => {
  const c = useContext(VideoJsPlayerCtx);
  if (!c) throw new Error("Videojs player is null");
  return c;
};
