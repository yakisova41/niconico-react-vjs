import type { InitialWatchDataType } from "./types/intialWatchData";
import type { SessionResponse } from "./types/session";
export default function getSession(initialWatchData: InitialWatchDataType): Promise<SessionResponse>;
