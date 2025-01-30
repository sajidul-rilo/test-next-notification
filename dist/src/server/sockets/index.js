"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socketHandler = (socket, io) => {
    console.log("A user connected:", socket.id);
    socket.on("sendMessage", (message) => {
        socket.broadcast.emit("sendMessage", message);
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
};
exports.default = socketHandler;
