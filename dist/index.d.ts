import React$1, { ReactNode } from 'react';
import Player from 'video.js/dist/types/player';

declare const NiconicoReactVjs: React$1.FunctionComponent<NiconicoReactVjsProps>;

interface NiconicoReactVjsProps extends React$1.VideoHTMLAttributes<HTMLVideoElement> {
    videoid: string;
    children?: ReactNode;
    id?: string;
    className?: string;
    width: number;
    height: number;
}

declare const NicoReactVjsLayerItem: React$1.FunctionComponent<{
    children?: ReactNode;
    enablePointerEvents?: boolean;
}>;

declare const Comments: React.FunctionComponent<{
    children?: ReactNode;
    className?: string;
    id?: string;
}>;

declare const useComment: () => CommentContextType;
interface CommentContextType {
    enable: () => void;
    disable: () => void;
    get: () => boolean;
}

declare const useVideoJS: () => Player;

export { Comments, NicoReactVjsLayerItem, NiconicoReactVjs, useComment, useVideoJS };
