import { Server as IOServer } from "socket.io";
import type http from "http";
export declare function initSocket(server: http.Server): IOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
export declare function getIO(): IOServer<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | null;
//# sourceMappingURL=sockets.d.ts.map