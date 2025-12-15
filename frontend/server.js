import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
import "dotenv/config";

export function createMessage({
  text,
  senderType = "user",
  timestamp = Date.now(),
  readed = false,
}) {
  return {
    text,
    senderType,
    timestamp,
    readed,
  };
}

const hostname = "0.0.0.0";
const port = 3000;

const app = next({ dev: process.env.NODE_ENV !== "production", hostname, port });
const handler = app.getRequestHandler();

const chats = {};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    socket.on("joinRoom", async (roomId) => {
      socket.join(roomId);

      // Initialize room if not exists
      if (!chats[roomId]) chats[roomId] = [];

      // Fetch previous messages from backend
      const res = await fetch(
        `http://localhost:5221/api/chat/messages?roomId=${roomId}`
      );
      const messages = await res.json();

      // Optionally merge with in-memory messages
      chats[roomId] = [...messages];

      socket.emit("previousMessages", messages);
    });

    socket.on("sendMessage", async (room, messageText, senderType) => {
      if (!chats[room]) chats[room] = [];

      const msg = createMessage({ text: messageText, senderType });
      chats[room].push(msg);

      console.log("Message sent:", msg);
      io.to(room).emit("newMessage", msg);

      await fetch(`http://localhost:5221/api/chat/${room}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
    });

    socket.on("newOffer", async (room, price) => {
      if (!chats[room]) chats[room] = [];

      const msg = createMessage({ text: `New offer: $${price}`, senderType: "pro" });
      chats[room].push(msg);

      io.to(room).emit("newMessage", msg);

      await fetch(`http://localhost:5221/api/chat/${room}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Server listening at http://${hostname}:${port}`);
  });
});
