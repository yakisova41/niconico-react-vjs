import React, { ReactNode } from "react";
import "../style.css";
export declare const NiconicoReactVjs: React.FunctionComponent<NiconicoReactVjsProps>;
export default NiconicoReactVjs;
export interface NiconicoReactVjsProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    videoid: string;
    children?: ReactNode;
    id?: string;
    className?: string;
    width: number;
    height: number;
}
