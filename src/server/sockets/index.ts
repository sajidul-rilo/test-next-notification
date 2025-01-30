import { Server, Socket } from "socket.io";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socketHandler = (socket: Socket, io: Server): void => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (message: string) => {
    socket.broadcast.emit("sendMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
};

export default socketHandler;
