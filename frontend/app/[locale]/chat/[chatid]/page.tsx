'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { 
  Send, Paperclip, Phone, Video, 
  CheckCircle2, XCircle,
  Edit3, MapPin, Calendar, Clock, Info,
  DollarSign, BadgeCheck,
  AlertCircle
} from 'lucide-react';
import styles from '../ChatPage.module.css';
import { socket } from '../../components/socket';
import { LoginContext } from '../../components/context/LoginContext';
import { useParams } from 'next/navigation';

// --- API Data Types (Matching your C# Output) ---

// Represents SubcategoryDTO in C#
interface SubcategoryDTO {
  id: number;
  title: string;
}

// Represents OrderFullDTO in C#
interface OrderFullDTO {
  id: number;
  title: string;
  description: string;
  postedAt: string; // ISO Date string
  price: number;
  location: string; // 'AtClients', 'AtPros', etc.
  address?: string;
  distance: number;
  additionalComment?: string;
  deadlineDate?: string;
  desiredTimeStart?: string;
  desiredTimeEnd?: string;
  subcategoriesDTO: SubcategoryDTO[];
  imageFileRefs: string[];
  client: {
    id: number;
    userName: string;
    email: string;
  };
  status: 'Active' | 'Assigned' | 'Completed' | 'Cancelled'; // Adjust based on your C# Enum
}

// Represents ChatInfoDTO in C#
interface ChatInfoDTO {
  fullOrder: OrderFullDTO;
  avatarClient: string;
  avatarPro: string;
  clientId: number;
  proId: number;
  clientName: string;
  proName: string;
}

// --- Component Internal Types ---

interface Message {
  id: string;
  senderId: string; // We will use string to match LoginContext usually, though API uses int
  text?: string;
  type: 'text' | 'img' | 'offer' | 'system';
  timestamp: Date;
  offerPrice?: number;
  offerStatus?: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
}

type NewMessage = {
  text: string;
  senderType: string;
  timestamp: Date;
  readed: boolean;
  // Add these for offers/system messages
  price?: number; 
  type?: 'text' | 'img' | 'offer' | 'system'; 
  offerStatus?: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
};

export default function ChatPage() {
  
  // Context
  const { userLong, authorizedFetch } = use(LoginContext);
  const params = useParams<{ chatid: string; }>();
  
  // State
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState<ChatInfoDTO | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  
  // Offer Logic State
  const [isOfferModalOpen, setOfferModalOpen] = useState(false);
  const [offerInput, setOfferInput] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 1. Fetch Chat Details & Messages ---
  // --- 1. Fetch Chat Details & Messages ---
  useEffect(() => {
    if (!params.chatid) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Get Info
        const infoRes = await authorizedFetch(`http://localhost:5221/api/chat/${params.chatid}/info`);
        const infoData: ChatInfoDTO = await infoRes.json();
        setChatInfo(infoData);
        setOfferInput(infoData.fullOrder.price); 

        // 2. Get Messages
        const msgRes = await authorizedFetch(`http://localhost:5221/api/chat/${params.chatid}/messages`);
        const msgData = await msgRes.json();
        
        // --- UPDATED MAPPING LOGIC ---
        const formattedMessages = msgData.map((m: any) => {
            // 1. Check if System Message
            if (m.isSystemMessage) {
                return {
                    id: m.id || Math.random().toString(),
                    senderId: 'system', // Specific ID for system
                    text: m.content || m.text,
                    type: 'system',
                    timestamp: new Date(m.timestamp),
                    offerPrice: null,
                    offerStatus: null
                };
            }

            // 2. Regular User Message (Client or Pro)
            // We just take the ID from the DB. The UI compares this ID vs user.id later.
            return {
                id: m.id || Math.random().toString(),
                senderId: m.senderId.toString(), 
                text: m.content || m.text,
                type: m.type || 'text', // 'text' or 'offer'
                timestamp: new Date(m.timestamp),
                offerPrice: m.offerPrice,
                offerStatus: m.offerStatus
            };
        });
        
        setMessages(formattedMessages);

      } catch (error) {
        console.error("Failed to load chat data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.chatid]);

  // --- 2. Computed Properties (Role Logic) ---
  
  const amIClient = chatInfo ? userLong?.id.toString() === chatInfo.clientId.toString() : false;
  const amIPro = chatInfo ? userLong?.id.toString() === chatInfo.proId.toString() : false;
  console.log(userLong?.id);
  
  const myRole = amIClient ? 'client' : amIPro ? 'pro' : 'admin';

  // Define "Other User" for the Header
  const otherUser = chatInfo ? {
    name: amIClient ? chatInfo.proName : chatInfo.clientName,
    avatar: amIClient ? (chatInfo.avatarPro || '/default-avatar.png') : (chatInfo.avatarClient || '/default-avatar.png'),
    id: amIClient ? chatInfo.proId : chatInfo.clientId
  } : { name: 'Loading...', avatar: '', id: 0 };

  // --- 3. Socket Connection ---
  useEffect(() => {
    if(!chatInfo) return;

    socket.emit("joinRoom", { room: `chat_${params.chatid}` });

    socket.on("newMessage", (msg: NewMessage) => {
        let msgType = msg.type || 'text';
      if (msg.price) msgType = 'offer';
      if (msg.senderType === 'system') msgType = 'system';

      // 2. Determine Sender ID
      const senderId = msgType === 'system' 
          ? 'system' 
          : (msg.senderType === 'client' ? chatInfo.clientId.toString() : chatInfo.proId.toString());
      
      // 3. Update State
      setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          senderId: senderId,
          text: msg.text,
          type: msgType as any, // Cast to ensure TS is happy
          timestamp: new Date(msg.timestamp),
          
          // MAP THE PRICE HERE
          offerPrice: msg.price, 
          offerStatus: msg.offerStatus || 'pending'
      }]);
    });

    return () => {
        socket.off('newMessage');
        // socket.emit("leaveRoom", { room: `chat_${params.chatid}` });
    }
  }, [chatInfo, params.chatid]);

  // --- 4. Handlers ---

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async() => {
    if (!inputText.trim() || !chatInfo) return;

    const senderType = amIClient ? 'client' : 'pro';

    // Optimistic Update
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: userLong.id.toString(),
      text: inputText,
      type: 'text',
      timestamp: new Date()
    };
    setMessages([...messages, newMsg]);
    
    // Emit
    socket.emit("sendMessage", { 
        room: `chat_${params.chatid}`, 
        message: inputText, 
        senderType: senderType 
    });

    await fetch(`http://localhost:5221/api/chat/${params.chatid}/sendMessage`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ 
            Content: inputText,
            Type: 'text',
            IsSystemMessage: false
        }),
    });
    
    setInputText('');
  };

  const handleCreateOffer = () => {
    if (!chatInfo) return;
    
    const newPrice = offerInput;
    // Emit offer event to socket/API
    socket.emit("newOffer", { room: `chat_${params.chatid}`, price: newPrice });

    // Optimistic UI update
    const newMsg: Message = {
        id: Date.now().toString(),
        senderId: userLong.id.toString(),
        type: 'offer',
        offerPrice: newPrice,
        offerStatus: 'pending',
        timestamp: new Date()
    };

    setMessages([...messages, newMsg]);
    setOfferModalOpen(false);
  };

  const handleAcceptOffer = (msgId: string, price: number) => {
    // Call API to update Order Status
    // updateOrder(chatInfo.fullOrder.id, price) ...

    setMessages(msgs => msgs.map(m => m.id === msgId ? { ...m, offerStatus: 'accepted' } : m));
    
    // Locally update order status for UI
    if(chatInfo) {
        setChatInfo({
            ...chatInfo,
            fullOrder: { ...chatInfo.fullOrder, status: 'Active', price: price } // 'Active' or whatever your 'In Work' status is
        });
    }

    setMessages(prev => [...prev, {
      id: Date.now().toString(), 
      senderId: 'system', 
      text: `Deal accepted! Final price: ${price} RON. Work can begin.`, 
      type: 'system', 
      timestamp: new Date()
    }]);
  };

  const handleRejectOffer = (msgId: string) => {
    setMessages(msgs => msgs.map(m => m.id === msgId ? { ...m, offerStatus: 'rejected' } : m));
  };

  // Helper: Date Formatter
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Flexible';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // --- Render ---

  if (loading || !chatInfo) {
      return <div className={styles.page} style={{display:'flex', justifyContent:'center', alignItems:'center'}}>Loading chat...</div>;
  }

  return (
    <div className={styles.page}>
      
      <div className={styles.layout}>
        
        {/* --- LEFT: Chat Area --- */}
        <div className={styles.chatContainer}>
          <header className={styles.chatHeader}>
            <div className={styles.headerUser}>
              <div className={styles.avatarWrapper}>
                <img src={otherUser.avatar} alt={otherUser.name} width={48} height={48} className={styles.avatar} />
                <span className={styles.onlineBadge}></span>
              </div>
              <div>
                <h2 className={styles.userName}>{otherUser.name}</h2>
                <p className={styles.userStatus}>Online</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.iconBtn}><Phone size={20} /></button>
              <button className={styles.iconBtn}><Video size={20} /></button>
            </div>
          </header>

          <div className={styles.messagesList}>
            {messages.map((msg) => {
              const isMe = msg.senderId.toString() === userLong?.id.toString();
              const isSystem = msg.type === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className={styles.systemMessageRow}>
                    <div className={styles.systemMessageBubble}>
                      <AlertCircle size={14} /> 
                      <span>{msg.text}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`${styles.messageRow} ${isMe ? styles.rowMe : styles.rowThem}`}>
                  {!isMe && <img src={otherUser.avatar} alt="Sender" width={32} height={32} className={styles.miniAvatar} />}
                  
                  <div className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleThem} ${msg.type === 'offer' ? styles.bubbleOffer : ''}`}>
                    {msg.type === 'text' && <p>{msg.text}</p>}
                    
                    {msg.type === 'offer' && (
                      <div className={`${styles.offerCard} ${msg.offerStatus === 'withdrawn' ? styles.offerCardDimmed : ''}`}>
                        <div className={styles.offerHeader}>
                          <DollarSign size={18} />
                          <span>{msg.offerStatus === 'withdrawn' ? 'Previous Offer' : 'Price Proposal'}</span>
                        </div>
                        <div className={styles.offerAmount}>{msg.offerPrice} RON</div>
                        
                        {msg.offerStatus === 'pending' && <div className={styles.offerStatusPending}>Waiting for acceptance...</div>}
                        {msg.offerStatus === 'accepted' && <div className={styles.offerStatusAccepted}><CheckCircle2 size={16}/> Accepted</div>}
                        {msg.offerStatus === 'rejected' && <div className={styles.offerStatusRejected}><XCircle size={16}/> Rejected</div>}
                        
                        {/* Offer Actions */}
                        {msg.offerStatus === 'pending' && amIClient && (
                          <div className={styles.offerActions}>
                            <button onClick={() => handleRejectOffer(msg.id)} className={styles.btnReject}>Reject</button>
                            <button onClick={() => handleAcceptOffer(msg.id, msg.offerPrice!)} className={styles.btnAccept}>Accept Deal</button>
                          </div>
                        )}

                        {msg.offerStatus === 'pending' && amIPro && (
                          <div className={styles.offerActions}>
                             <button onClick={() => { setOfferInput(msg.offerPrice!); setOfferModalOpen(true); }} className={styles.btnChange}>
                               <Edit3 size={14} /> Change Price
                             </button>
                          </div>
                        )}
                      </div>
                    )}
                    <span className={styles.timestamp}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <footer className={styles.inputArea}>
            <button className={styles.attachBtn}><Paperclip size={20} /></button>
            <input 
              className={styles.inputField} 
              placeholder="Type a message..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button className={styles.sendBtn} onClick={handleSendMessage}><Send size={18} /></button>
          </footer>
        </div>

        {/* --- RIGHT: Detailed Order Sidebar --- */}
        <aside className={styles.sidebar}>
          <div className={styles.orderCard}>
            
            {/* 1. Order Image */}
            <div className={styles.orderimgContainer}>
              <img 
                src={chatInfo.fullOrder.imageFileRefs?.[0] || '/images/placeholder.jpg'} 
                alt="Order" 
                className={styles.orderimg}  width={120}
              />
              <span className={`${styles.imgStatusBadge} ${styles[chatInfo.fullOrder.status.toLowerCase()] || styles.negotiating}`}>
                {chatInfo.fullOrder.status}
              </span>
            </div>

            {/* 2. Order Info */}
            <div className={styles.orderContent}>
                <h4 className={styles.orderTitle} title={chatInfo.fullOrder.title}>
                    #{chatInfo.fullOrder.id} {chatInfo.fullOrder.title}
                </h4>
                <p className={styles.orderDesc}>{chatInfo.fullOrder.description}</p>

                {/* Meta icons row */}
                <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                      <Calendar size={14} className={styles.metaIcon} />
                      <span>{formatDate(chatInfo.fullOrder.deadlineDate)}</span>
                    </div>

                    {(chatInfo.fullOrder.desiredTimeStart || chatInfo.fullOrder.desiredTimeEnd) && (
                        <div className={styles.metaItem}>
                        <Clock size={14} className={styles.metaIcon} />
                        <span>{chatInfo.fullOrder.desiredTimeStart} – {chatInfo.fullOrder.desiredTimeEnd}</span>
                        </div>
                    )}

                    <div className={styles.metaItem}>
                      <MapPin size={14} className={styles.metaIcon} />
                      <span>{chatInfo.fullOrder.location}</span>
                    </div>

                    {chatInfo.fullOrder.address && (
                        <div className={styles.metaItem}>
                        <MapPin size={14} className={styles.metaIconMuted} />
                        <span>{chatInfo.fullOrder.address}</span>
                        </div>
                    )}

                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Posted:</span>
                      <span>{formatDate(chatInfo.fullOrder.postedAt)}</span>
                    </div>
                </div>

                {/* Client / Pro info */}
                <div className={styles.peopleRow}>
                    <div className={styles.personBadge}>
                      <span className={styles.personLabel}>Client</span>
                      <span className={styles.personName}>{chatInfo.clientName}</span>
                    </div>

                    <div className={styles.personBadge}>
                      <span className={styles.personLabel}>Pro</span>
                      <span className={styles.personName}>{chatInfo.proName}</span>
                    </div>
                </div>

                {/* Additional note */}
                {chatInfo.fullOrder.additionalComment && (
                    <div className={styles.additionalNote}>
                      <Info size={12} className={styles.infoIcon} />
                      <span>{chatInfo.fullOrder.additionalComment}</span>
                    </div>
                )}
            </div>

            <hr className={styles.divider} />

            {/* 3. Pricing Section */}
            <div className={styles.priceSection}>
              <div className={styles.finalPriceRow}>
                <span className={styles.priceLabel}>Current Price</span>
                <span className={styles.highlightPrice}>{chatInfo.fullOrder.price} RON</span>
              </div>
            </div>

            {/* 4. Action Button */}
            <div className={styles.cardFooter}>
              {amIPro && chatInfo.fullOrder.status !== 'Completed' && (
                <button className={styles.makeOfferBtn} onClick={() => {
                    setOfferInput(chatInfo.fullOrder.price);
                    setOfferModalOpen(true);
                }}>
                  <BadgeCheck size={18} />
                  {chatInfo.fullOrder.price > 0 ? 'Update Price' : 'Make Offer'}
                </button>
              )}
              
              {chatInfo.fullOrder.status === 'Active' && ( // Assuming 'Active' means In Progress
                 <div className={styles.inWorkBadge}>
                    <CheckCircle2 size={16}/> In Progress
                 </div>
              )}
            </div>

          </div>
        </aside>

      </div>

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Update Price</h3>
            <p>Enter the total amount for the job.</p>
            <div className={styles.inputWrapper}>
              <input 
                type="number" 
                className={styles.modalInput} 
                value={offerInput} 
                onChange={(e) => setOfferInput(Number(e.target.value))}
                autoFocus
              />
              <span className={styles.currencySuffix}>RON</span>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setOfferModalOpen(false)} className={styles.btnGhost}>Cancel</button>
              <button onClick={handleCreateOffer} className={styles.btnPrimary}>Send Proposal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}