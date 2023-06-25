import "video.js/dist/video-js.min.css";
import { type ReactNode } from "react";
import type Player from "video.js/dist/types/player";
import React from "react";
interface ReactVideoJSPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    src: any;
    id: string;
    options?: any;
    children?: ReactNode;
}
declare const ReactVideoJSPlayer: React.FunctionComponent<ReactVideoJSPlayerProps>;
export default ReactVideoJSPlayer;
export declare const VideoJsPlayerCtx: React.Context<Player | null>;
export declare const useVideoJS: () => Player;
