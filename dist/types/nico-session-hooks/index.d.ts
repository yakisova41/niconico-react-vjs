import { type InitialWatchDataType } from "./types/intialWatchData";
import React, { type ReactNode } from "react";
import { type SessionResponse } from "./types/session";
export declare const NicoSessionProvider: React.FunctionComponent<NicoProviderProps>;
export default NicoSessionProvider;
interface NicoProviderProps {
    children?: ReactNode;
    videoid: string;
}
export declare const NicoDataContext: React.Context<NicoData>;
export declare const useNico: () => NicoData;
export interface NicoData {
    ready: boolean;
    session?: SessionResponse;
    initialWatchData?: InitialWatchDataType;
}
