import { type ReactNode } from "react";
export declare const Comments: React.FunctionComponent<{
    children?: ReactNode;
    className?: string;
    id?: string;
}>;
export default Comments;
export declare const CommentContext: import("react").Context<CommentContextType | undefined>;
export declare const useComment: () => CommentContextType;
export interface CommentContextType {
    enable: () => void;
    disable: () => void;
    get: () => boolean;
}
