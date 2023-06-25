import {
  useEffect,
  useRef,
  createContext,
  type ReactNode,
  useState,
  useContext,
} from "react";
import { useNico } from "../nico-session-hooks";
import getComments from "./getComments";
import NiconiComments from "@xpadev-net/niconicomments";
import { useVideoJS } from "../react-videojs-player";

export const Comments: React.FunctionComponent<{
  children?: ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className, id }) => {
  const { initialWatchData } = useNico();
  const niconiComments = useRef<NiconiComments>();
  const commentInterval = useRef<number>();
  const vjsPlayer = useVideoJS();
  const [isCommentShow, setCommentShow] = useState(true);

  const defaultId = "niconico-react-vjs-comment-layer";

  useEffect(() => {
    const commentLayer = document.querySelector<HTMLCanvasElement>(
      `#${id !== undefined ? id : defaultId}`
    );
    if (commentLayer === null) {
      return;
    }

    if (initialWatchData !== undefined) {
      clearInterval(commentInterval.current);

      void getComments(initialWatchData).then((commentsRes) => {
        niconiComments.current = new NiconiComments(
          commentLayer,
          commentsRes.data.threads,
          {
            format: "v1",
            scale: 1,
            mode: "default",
          }
        );
      });

      commentInterval.current = setInterval(() => {
        const time = vjsPlayer.currentTime();
        if (time === undefined) {
          clearInterval(commentInterval.current);
          return;
        }

        niconiComments.current?.drawCanvas(Math.floor(time * 100));
      }, 10);
    }
  }, [initialWatchData]);

  return (
    <CommentContext.Provider
      value={{
        enable: () => {
          setCommentShow(true);
        },
        disable: () => {
          setCommentShow(false);
        },
        get: () => isCommentShow,
      }}
    >
      <canvas
        id={id !== undefined ? id : defaultId}
        className={
          (isCommentShow ? "" : "niconico-react-vjs-comment-hide ") +
          (className !== undefined ? className + " " : "") +
          "niconico-react-vjs-comment niconico-react-vjs-layer-item"
        }
        width={1920}
        height={1080}
      ></canvas>
      {children}
    </CommentContext.Provider>
  );
};

export default Comments;

export const CommentContext = createContext<CommentContextType | undefined>(
  undefined
);
export const useComment: () => CommentContextType = () => {
  const c = useContext(CommentContext);
  if (!c) throw new Error("Comment context is undefined!!");
  return c;
};

export interface CommentContextType {
  enable: () => void;
  disable: () => void;
  get: () => boolean;
}
