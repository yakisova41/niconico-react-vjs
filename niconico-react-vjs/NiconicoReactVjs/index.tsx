import React, { ReactNode } from "react";
import { NicoSessionProvider, NicoDataContext } from "../nico-session-hooks";
import ReactVideoJSPlayer from "../react-videojs-player";

export const NiconicoReactVjs: React.FunctionComponent<
  NiconicoReactVjsProps
> = ({ videoid, children, id, className, width, height, ...props }) => {
  return (
    <div
      className="niconico-react-vjs"
      style={{
        width,
        height,
      }}
    >
      <NicoSessionProvider videoid={videoid}>
        <NicoDataContext.Consumer>
          {({ session }) => {
            return (
              <ReactVideoJSPlayer
                id={id !== undefined ? id : "niconico-react-vjs"}
                src={session?.data.session.content_uri}
                options={{}}
                className={
                  (className !== undefined ? className + " " : "") +
                  "niconico-react-vjs-player"
                }
                {...props}
              >
                {children}
              </ReactVideoJSPlayer>
            );
          }}
        </NicoDataContext.Consumer>
      </NicoSessionProvider>
    </div>
  );
};

export default NiconicoReactVjs;

export interface NiconicoReactVjsProps
  extends React.VideoHTMLAttributes<HTMLVideoElement> {
  videoid: string;
  children?: ReactNode;
  id?: string;
  className?: string;
  width: number;
  height: number;
}
