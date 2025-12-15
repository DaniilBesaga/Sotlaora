import next from "next";
import { Server } from "socket.io";
import "dotenv/config";

export function createMessage({
  text,
  senderType = "user",
  timestamp = Date.now(),
  readed = false
}) {
  return {
    text,
    senderType,
    timestamp,
    readed
  };
}


const hostname = "0.0.0.0";
const port = 3000;

const app = next({ dev: process.env.NODE_ENV !== "production", hostname, port });
const handler = app.getRequestHandler();

const chats = {}

app.prepare().then(() => {
  const httpServer = createServer(handler)

  const io = new Server(httpServer)

  io.on("connection", (socket) => {
    socket.on("joinRoom", async (roomId) => {
        socket.join(roomId);

        const res = await fetch(
            `http://localhost:5221/api/chat/messages?roomId=${roomId}`
        );

        const messages = await res.json();

        socket.emit("previousMessages", messages);
    });
  });


  socket.on("sendMessage", async(room, message, senderType) => {
    const msg = createMessage({ message, senderType });
    chats[room].push(msg);
    console.log(msg)
    io.to(room).emit("newMessage", msg);

    await fetch(`http://localhost:5221/api/chat/${room}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
    });
  });

  socket.on("newOffer", async(room, price) => {
    const msg = createMessage({ text: `New offer: $${price}`, senderType: 'pro' });
    chats[room].push(msg);
    io.to(room).emit("newMessage", msg);
    await fetch(`http://localhost:5221/api/chat/${room}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Server listening at http://${hostname}:${port}`);
  })
  });