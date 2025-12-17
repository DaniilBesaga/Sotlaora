import next from "next";
import { createServer } from "node:http";
import { Server } from "socket.io";
import "dotenv/config";

// Helper to create a standard message object for the UI
export function createMessage({
  text = "",
  senderType = "user",
  timestamp = new Date(),
  readed = false,
  price = undefined,
  type = "text",
  offerStatus = undefined
}) {
  return {
    text,
    senderType,
    timestamp,
    readed,
    price,
    type,
    offerStatus
  };
}

const hostname = "0.0.0.0";
const port = 3000;

const app = next({ dev: process.env.NODE_ENV !== "production", hostname, port });
const handler = app.getRequestHandler();

const chats = {};

// Helper: Extract pure GUID from room string "chat_GUID"
const getChatId = (roomStr) => {
    return roomStr.replace("chat_", ""); 
};

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    // --- 1. Join Room ---
    socket.on("joinRoom", async ({ room }) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined ${room}`);
      
      const chatId = getChatId(room);

      try {
          const headers = {};
          const res = await fetch(
            `http://localhost:5221/api/chat/${chatId}/messages`,
            { headers, credentials: 'include' }
          );
          
          if (res.ok) {
              const messages = await res.json();
              socket.emit("previousMessages", messages);
          } else {
              console.error(`Failed to fetch history: ${res.status}`);
          }
      } catch (e) {
          console.error("Error fetching history:", e);
      }
    });

    // --- 2. Send Text Message ---
    socket.on("sendMessage", async ({ room, content, senderId }) => {
      // 1. Emit to Socket Clients
      const msg = createMessage({ 
          text: content, 
          senderType: senderId, 
          type: 'text' 
      });
      
      io.to(room).emit("newMessage", msg);

      // 2. Persist to Backend
      const chatId = getChatId(room); 
      
      try {
        
      } catch (err) {
          console.error("Failed to save message to backend:", err);
      }
    });

    // --- 3. Send Offer ---
    socket.on("newOffer", async ({ room, price, senderId }) => {
      // 1. Emit to Socket Clients
      const msg = createMessage({ 
          text: `New Price Proposal: ${price} RON`, 
          senderType: senderId || "pro", 
          price: price, 
          type: "offer",
          offerStatus: "pending"
      });
      
      io.to(room).emit("newMessage", msg);

      // 2. Persist to Backend
      const chatId = getChatId(room);

      
    });

    // --- 4. Send System Message (NEW) ---
    // 
    // Use this when you want to trigger a system alert manually from the frontend,
    // though usually, the backend triggers this via a separate API call.
    // If you need the frontend to send a system message (e.g., "User left chat"):
    socket.on("sendSystemMessage", async ({ room, content }) => {
        const msg = createMessage({ 
            text: content, 
            senderType: "system", 
            type: "system" 
        });
        
        io.to(room).emit("newMessage", msg);

        
    });

    socket.on("disconnect", () => {
        // console.log("Socket disconnected:", socket.id);
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Server listening at http://${hostname}:${port}`);
  });
});