import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import socketHandler from "./src/server/sockets";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  /**
   * Socket.io server
   */
  const allowedOrigins = [
    "https://super-kitsune-003168.netlify.app",
    "http://localhost:3000",
    "http://127.0.0.1:5500",
  ];
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
      credentials: true, // Allow cookies or credentials (JWT, etc.)
    },
  });
  io.on("connection", (socket) => {
    socketHandler(socket, io);
  });
  console.log(io, "IOOOOOOOOOO");

  httpServer.listen(port, () => {
    console.log(
      `> Server listening at http://localhost:${port} as ${
        dev ? "development" : process.env.NODE_ENV
      }`
    );
  });
});
