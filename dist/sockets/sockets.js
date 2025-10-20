import { Server as IOServer } from "socket.io";
let io = null;
export function initSocket(server) {
    if (io)
        return io;
    io = new IOServer(server, {
        cors: { origin: "*" },
    });
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        socket.on("join", (room) => {
            socket.join(room);
        });
        socket.on("leave", (room) => {
            socket.leave(room);
        });
        socket.on("task:editing:start", (payload) => {
            socket.to("tasks").emit("task:editing", { action: "start", payload });
        });
        socket.on("task:editing:stop", (payload) => {
            socket.to("tasks").emit("task:editing", { action: "stop", payload });
        });
        socket.on("task:update", (payload) => {
            socket.to("tasks").emit("task:updated", payload);
        });
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
    return io;
}
export function getIO() {
    if (!io) {
        console.warn("Socket.io not initialized. Call initSocket(server) in index.ts");
    }
    return io;
}
//# sourceMappingURL=sockets.js.map