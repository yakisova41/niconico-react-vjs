import type { InitialWatchDataType } from "../nico-session-hooks/types/intialWatchData";
export default function getComments(initialWatchData: InitialWatchDataType): Promise<CommentResponse>;
export interface CommentResponse {
    meta: Meta;
    data: Data;
}
export interface Data {
    globalComments: GlobalComment[];
    threads: Thread[];
}
export interface GlobalComment {
    id: string;
    count: number;
}
export interface Thread {
    id: string;
    fork: string;
    commentCount: number;
    comments: Comment[];
}
export interface Comment {
    id: string;
    no: number;
    vposMs: number;
    body: string;
    commands: string[];
    userId: string;
    isPremium: boolean;
    score: number;
    postedAt: string;
    nicoruCount: number;
    nicoruId: undefined;
    source: Source;
    isMyPost: boolean;
}
export declare enum Source {
    Leaf = "leaf",
    Trunk = "trunk"
}
export interface Meta {
    status: number;
}
