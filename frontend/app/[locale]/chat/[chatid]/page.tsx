'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { 
  Send, Paperclip, Phone, Video, 
  CheckCircle2, XCircle, CheckCheck,
  Edit3, MapPin, Calendar, Clock, Info,
  DollarSign, BadgeCheck,
  AlertCircle, CreditCard, Ban, Lock
} from 'lucide-react';
import styles from '../ChatPage.module.css';
import { socket } from '../../components/socket';
import { LoginContext } from '../../components/context/LoginContext';
import { useParams } from 'next/navigation';

// ... (Interfaces remain the same) ...

interface SubcategoryDTO {
  id: number;
  title: string;
}

interface OrderFullDTO {
  id: number;
  title: string;
  description: string;
  postedAt: string;
  price: number;
  location: string;
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
  status: 'Active' | 'Assigned' | 'Discussion' | 'InProgress' | 'Completed' | 'Paid' | 'WaitingForConfirmationByClient' | 'CancelledByClient' | 'CancelledByPro' | 'WaitingForPayment' | 'CompletedByClient' | 'CompletedByPro' | 'Negotiating';
}

interface ChatInfoDTO {
  fullOrder: OrderFullDTO;
  avatarClient: string;
  avatarPro: string;
  clientId: number;
  proId: number;
  clientName: string;
  proName: string;
}

interface Message {
  id: string;
  senderId: string;
  text?: string;
  type: 'Text' | 'Img' | 'Offer' | 'System';
  timestamp: Date;
  offerPrice?: number;
  offerStatus?: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
}

type NewMessage = {
  text: string;
  senderType: string;
  timestamp: Date;
  readed: boolean;
  price?: number; 
  type?: 'Text' | 'Img' | 'Offer' | 'System'; 
  offerStatus?: 'Pending' | 'Accepted' | 'Rejected' | 'Withdrawn';
};

enum MessageType {
  Text = "Text",
  Offer = "Offer",
  System = "System"
}

export default function ChatPage() {
  
  const { userLong, authorizedFetch } = use(LoginContext);
  const params = useParams<{ chatid: string; }>();
  
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState<ChatInfoDTO | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  
  const [isOfferModalOpen, setOfferModalOpen] = useState(false);
  const [offerInput, setOfferInput] = useState<number>(0);

  // --- NEW STATE FOR PAYMENT CODE MOCK ---
  const [paymentCode, setPaymentCode] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 1. Fetch Chat Details & Messages ---
  useEffect(() => {
    if (!params.chatid || !userLong) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const infoRes = await authorizedFetch(`http://localhost:5221/api/chat/${params.chatid}/info`);
        const infoData: ChatInfoDTO = await infoRes.json();
        setChatInfo(infoData);
        setOfferInput(infoData.fullOrder.price); 

        const msgRes = await authorizedFetch(`http://localhost:5221/api/chat/${params.chatid}/messages`);
        const msgData = await msgRes.json();
        
        const formattedMessages = msgData.map((m: any) => {
            if (m.isSystemMessage || m.type === 'System') {
                return {
                    id: m.id || Math.random().toString(),
                    senderId: 'System',
                    text: m.content || m.text,
                    type: 'System',
                    timestamp: new Date(m.timestamp),
                    offerPrice: null,
                    offerStatus: null
                };
            }
            return {
                id: m.id || Math.random().toString(),
                senderId: m.senderId.toString(), 
                text: m.content || m.text,
                type: m.type || MessageType.Text,
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
  }, [params.chatid, userLong]);

  const amIClient = chatInfo ? userLong?.id.toString() === chatInfo.clientId.toString() : false;
  const amIPro = chatInfo ? userLong?.id.toString() === chatInfo.proId.toString() : false;
  
  const otherUser = chatInfo ? {
    name: amIClient ? chatInfo.proName : chatInfo.clientName,
    avatar: amIClient ? (chatInfo.avatarPro || '/default-avatar.png') : (chatInfo.avatarClient || '/default-avatar.png'),
    id: amIClient ? chatInfo.proId : chatInfo.clientId
  } : { name: 'Loading...', avatar: '', id: 0 };

  useEffect(() => {
    if(!chatInfo) return;
    socket.emit("joinRoom", { room: `chat_${params.chatid}` });
    socket.on("newMessage", (msg: NewMessage) => {
      let msgType = msg.type || 'Text';
      if (msg.price) msgType = 'Offer';
      if (msg.senderType === 'system') msgType = 'System';

      const senderId = msgType === 'System' 
          ? 'System' 
          : (msg.senderType === 'client' ? chatInfo.clientId.toString() : chatInfo.proId.toString());
      
      setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          senderId: senderId,
          text: msg.text,
          type: msgType as any,
          timestamp: new Date(msg.timestamp),
          offerPrice: msg.price, 
          offerStatus: msg.offerStatus || 'Pending'
      }]);
    });
    return () => { socket.off('newMessage'); }
  }, [chatInfo, params.chatid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ... (handleSendMessage, handleCreateOffer, handleAcceptOffer, handleRejectOffer remain the same) ...
  const handleSendMessage = async() => {
    if (!inputText.trim() || !chatInfo) return;
    const senderType = amIClient ? 'client' : 'pro';
    const newMsg: Message = { id: Date.now().toString(), senderId: userLong.id.toString(), text: inputText, type: 'Text', timestamp: new Date() };
    setMessages([...messages, newMsg]);
    socket.emit("sendMessage", { room: `chat_${params.chatid}`, message: inputText, senderType: senderType });
    await authorizedFetch(`http://localhost:5221/api/chat/${params.chatid}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: 'include',
        body: JSON.stringify({ Content: inputText, Type: 'Text', IsSystemMessage: false }),
    });
    setInputText('');
  };

  const handleCreateOffer = async () => {
    if (!chatInfo) return;
    
    const newPrice = offerInput;
    // Emit offer event to socket/API
    socket.emit("newOffer", { room: `chat_${params.chatid}`, price: newPrice });

    // Optimistic UI update
    const newMsg: Message = {
        id: Date.now().toString(),
        senderId: userLong.id.toString(),
        type: 'Offer',
        offerPrice: newPrice,
        offerStatus: 'Pending',
        timestamp: new Date()
    };

    try {
      await authorizedFetch(`http://localhost:5221/api/chat/${params.chatid}/sendMessage`, {
          method: "POST",
          headers: { 
              "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({ 
              Content: `Offer: ${newPrice} RON`, 
              Type: 'Offer  ',
              Price: newPrice, 
              IsSystemMessage: false
          }),
      });
    } catch (err) {
      console.error("Failed to save offer to backend:", err);
    }

    setMessages([...messages, newMsg]);
    setOfferModalOpen(false);
  };

  const handleAcceptOffer = async (msgId: string, price: number) => {
        
    try {
        const res = await authorizedFetch(`http://localhost:5221/api/chat/${params.chatid}/sendMessage`, {
            method: "POST",
            body: JSON.stringify({ 
                Content: `Deal accepted! Final price: ${price} RON. Work can begin.`,
                Type: 'System',
                IsSystemMessage: true
            }),
        });

        const data = await res.json();
        const mesId = data.id - 1; // The pro sends the offer, so the system message is next id, so to update the order we need to -1

        await authorizedFetch(`http://localhost:5221/api/order/${chatInfo?.fullOrder.id}/setNewPrice`, {
            method: "PUT",
            body: JSON.stringify(
                price
            ),
        });

        const status = 'Accepted';

        await authorizedFetch(`http://localhost:5221/api/chat/${params.chatid}/${mesId}/updateOfferStatus`, {
            method: "PUT",
            body: JSON.stringify(
                status
            ),
        });


        await authorizedFetch(`http://localhost:5221/api/order/${chatInfo?.fullOrder.id}/updateStatus`, {
            method: "PUT",
            body: JSON.stringify(
                'WaitingForPayment'
            ),
        });

    } catch (err) {
        console.error("Failed to save system message:", err);
    }

    setMessages(msgs => msgs.map(m => m.id === msgId ? { ...m, offerStatus: 'Accepted' } : m));
    
    // Locally update order status for UI
    if(chatInfo) {
        setChatInfo({
            ...chatInfo,
            fullOrder: { ...chatInfo.fullOrder, status: 'WaitingForPayment', price: price } // 'Active' or whatever your 'In Work' status is
        });
    }

    socket.emit("sendSystemMessage", { 
        room: `chat_${params.chatid}`, 
        content: `Deal accepted! Final price: ${price} RON. Work can begin.` 
    });
  };

  const handleRejectOffer = (msgId: string) => {
    setMessages(msgs => msgs.map(m => m.id === msgId ? { ...m, offerStatus: 'Rejected' } : m));
  };


  // --- UPDATED PAYMENT HANDLER ---
  const handlePayEscrow = async () => {
    // 1. Validation Logic
    try{
      const res = await authorizedFetch(`http://localhost:5221/api/order/${chatInfo?.fullOrder.id}/receivePayment`, { 
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentCode.trim()),
      });
      if (!res.ok) {
          alert("Payment failed. Please check the escrow code and try again.");
          return;
      }
    }
    catch(err){
      console.error("Payment processing error:", err);
      alert("An error occurred during payment processing. Please try again.");
      return;
    }

    const msgText = "Payment confirmed via Escrow. Order is now In Progress.";
    
    // 2. Update Local State
    if(chatInfo) {
        setChatInfo({
            ...chatInfo,
            fullOrder: { ...chatInfo.fullOrder, status: 'InProgress' }
        });
    }

    // 3. Emit & Save System Message
    socket.emit("sendSystemMessage", { room: `chat_${params.chatid}`, content: msgText });
    await authorizedFetch(`http://localhost:5221/api/chat/${params.chatid}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Content: msgText, Type: 'System', IsSystemMessage: true }),
    });
    
    // Clear the code input
    setPaymentCode('');
  }

  useEffect(() => {
    if(paymentCode.length === 7) {
        setChatInfo({
            ...chatInfo!,
            fullOrder: { ...chatInfo!.fullOrder, status: 'InProgress' }
        });
    }
  }, [paymentCode]);

  const handleConfirmCompletion = async () => {

    let msgText = "";
    if(amIClient) {
        msgText = "Order marked as Completed by the client.";
    } else {
        msgText = "Order marked as Completed by the pro.";
    }

    if(chatInfo) {
        setChatInfo({ ...chatInfo, fullOrder: { ...chatInfo.fullOrder, status: 'Completed' } });
    }
    socket.emit("sendSystemMessage", { room: `chat_${params.chatid}`, content: msgText });

    
    const res = await authorizedFetch(`http://localhost:5221/api/chat/${params.chatid}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Content: msgText, Type: 'System', IsSystemMessage: true }),
    });
    
    const data = await res.json();
    const mesId = data.id - 1; // The pro sends the offer, so the system message is next id, so to update the order we need to -1

    const status = 'Completed';

    const resStatus = await authorizedFetch(`http://localhost:5221/api/order/${chatInfo?.fullOrder.id}/updateStatus`, {
        method: "PUT",
        body: JSON.stringify(
            amIClient ? 'CompletedByClient' : 'CompletedByPro'
        ),
    });

    const dataStatus = await resStatus.json();

    const notif = {
        Title: `The order has been completed ${chatInfo?.fullOrder.title}`,
        Message: `You have completed the order '${chatInfo?.fullOrder.title}' and received payment.`,
        Type: 'Completed',
        Slug: `/cabinet/earnings`,
    }

    if(dataStatus.status === status){
      await authorizedFetch(`http://localhost:5221/api/chat/${chatInfo?.fullOrder.id}/create-payment-notification`, {
          method: "POST",
          body: JSON.stringify({notification: notif}),
      });
    }
  }

  const handleCancelOrder = async () => {
    const msgText = "Order was cancelled by the client.";
    if(chatInfo) {
        setChatInfo({ ...chatInfo, fullOrder: { ...chatInfo.fullOrder, status: 'CancelledByClient' } });
    }
    socket.emit("sendSystemMessage", { room: `chat_${params.chatid}`, content: msgText });
    await authorizedFetch(`http://localhost:5221/api/chat/${params.chatid}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Content: msgText, Type: 'System', IsSystemMessage: true }),
    });
  }

  // Helper: Date Formatter
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Flexible';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading || !chatInfo) return <div className={styles.page}>Loading chat...</div>;

  const { status } = chatInfo.fullOrder;

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* LEFT: Chat Area */}
        <div className={styles.chatContainer}>
            {/* Header */}
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

          {/* Messages */}
          <div className={styles.messagesList}>
            {messages.map((msg) => {
              const isMe = msg.senderId.toString() === userLong?.id.toString();
              const isSystem = msg.type === 'System';

              if (isSystem) {
                return (
                  <div key={msg.id} className={styles.systemMessageRow}>
                    <div className={styles.systemMessageBubble}>
                      <AlertCircle size={14} /> <span>{msg.text}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`${styles.messageRow} ${isMe ? styles.rowMe : styles.rowThem}`}>
                  {!isMe && <img src={otherUser.avatar} alt="Sender" width={32} height={32} className={styles.miniAvatar} />}
                  <div className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleThem} ${msg.type === 'Offer' ? styles.bubbleOffer : ''}`}>
                    {msg.type === 'Text' && <p>{msg.text}</p>}
                    {msg.type === 'Offer' && (
                      <div className={`${styles.offerCard} ${msg.offerStatus === 'Withdrawn' ? styles.offerCardDimmed : ''}`}>
                        <div className={styles.offerHeader}>
                          <DollarSign size={18} />
                          <span>{msg.offerStatus === 'Withdrawn' ? 'Previous Offer' : 'Price Proposal'}</span>
                        </div>
                        <div className={styles.offerAmount}>{msg.offerPrice} RON</div>
                        {msg.offerStatus === 'Pending' && <div className={styles.offerStatusPending}>Waiting for acceptance...</div>}
                        {msg.offerStatus === 'Accepted' && <div className={styles.offerStatusAccepted}><CheckCircle2 size={16}/> Accepted</div>}
                        {msg.offerStatus === 'Rejected' && <div className={styles.offerStatusRejected}><XCircle size={16}/> Rejected</div>}
                        
                        {msg.offerStatus === 'Pending' && amIClient && (
                          <div className={styles.offerActions}>
                            <button onClick={() => handleRejectOffer(msg.id)} className={styles.btnReject}>Reject</button>
                            <button onClick={() => handleAcceptOffer(msg.id, msg.offerPrice!)} className={styles.btnAccept}>Accept Deal</button>
                          </div>
                        )}
                        {msg.offerStatus === 'Pending' && amIPro && (
                          <div className={styles.offerActions}>
                             <button onClick={() => { setOfferInput(msg.offerPrice!); setOfferModalOpen(true); }} className={styles.btnChange}><Edit3 size={14} /> Change Price</button>
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
            <input className={styles.inputField} placeholder="Type a message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
            <button className={styles.sendBtn} onClick={handleSendMessage}><Send size={18} /></button>
          </footer>
        </div>

        {/* RIGHT: Detailed Order Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.orderCard}>
            <div className={styles.orderimgContainer}>
              <img src={chatInfo.fullOrder.imageFileRefs?.[0] || '/images/placeholder.jpg'} alt="Order" className={styles.orderimg} width={120} />
              <span className={`${styles.imgStatusBadge} ${styles[status.toLowerCase()] || styles.negotiating}`}>
                {status.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>

            <div className={styles.orderContent}>
                <h4 className={styles.orderTitle} title={chatInfo.fullOrder.title}>#{chatInfo.fullOrder.id} {chatInfo.fullOrder.title}</h4>
                <p className={styles.orderDesc}>{chatInfo.fullOrder.description}</p>
            </div>
            <hr className={styles.divider} />
            <div className={styles.priceSection}>
              <div className={styles.finalPriceRow}>
                <span className={styles.priceLabel}>Current Price</span>
                <span className={styles.highlightPrice}>{chatInfo.fullOrder.price} RON</span>
              </div>
            </div>

            <div className={styles.cardFooter}>
              {/* PRO ACTIONS */}
              {amIPro && (
                  <>
                      {(status === 'Active' || status === 'Discussion' || status === 'Assigned') && (
                        <button className={styles.makeOfferBtn} onClick={() => { setOfferInput(chatInfo.fullOrder.price); setOfferModalOpen(true); }}>
                        <BadgeCheck size={18} /> {chatInfo.fullOrder.price > 0 ? 'Update Price' : 'Make Offer'}
                        </button>
                      )}
                      {status === 'WaitingForPayment' && (
                          <div className={styles.paymentActions} style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                            <div className={styles.waitingText} style={{ textAlign: 'center', width: '100%', padding: 10, background: '#f8fafc', borderRadius: 8 }}>
                             <Clock size={16} style={{display:'inline', marginRight:6}}/> Waiting for client payment...
                            </div>
                            <button onClick={handleCancelOrder} className={styles.btnDestructive} style={{ background: '#fff', border: '1px solid #ef4444', color: '#ef4444', padding: 10, borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Ban size={18} style={{marginRight:8}} /> Cancel Order
                            </button>
                          </div>
                      )}
                      {(status === 'InProgress' || status === 'CompletedByClient' || status === 'CompletedByPro') && (
                          <button className={styles.btnSuccess} onClick={handleConfirmCompletion} style={{ width: '100%', background: '#22c55e', color: 'white', border: 'none', padding: 10, borderRadius: 8, fontWeight: 600 }}>
                              <CheckCheck size={18} style={{marginRight:8}} /> Confirm Completion
                          </button>
                      )}
                  </>
              )}
              
              {/* CLIENT ACTIONS */}
              {amIClient && (
                  <>
                       {/* PAYMENT PHASE (UPDATED WITH INPUT) */}
                       {status === 'WaitingForPayment' && (
                           <div className={styles.paymentActions} style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                              
                              <div style={{ background: '#f0f9ff', padding: 10, borderRadius: 8, border: '1px solid #bae6fd' }}>
                                <label style={{ fontSize: 12, fontWeight: 600, color: '#0369a1', marginBottom: 4, display: 'block' }}>
                                    Escrow Transaction Code
                                </label>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <Lock size={14} style={{ position: 'absolute', top: 11, left: 10, color: '#94a3b8' }} />
                                        <input 
                                            type="text" 
                                            placeholder="Code (e.g. 5731331)" 
                                            value={paymentCode}
                                            onChange={(e) => setPaymentCode(e.target.value)}
                                            style={{ width: '100%', padding: '8px 8px 8px 30px', borderRadius: 6, border: '1px solid #cbd5e1', outline: 'none' }}
                                        />
                                    </div>
                                    <button onClick={handlePayEscrow} className={styles.btnPrimary} style={{ background: '#3b82f6', color: 'white', padding: '0 12px', borderRadius: 6, border: 'none', fontWeight: 600 }}>
                                        Confirm
                                    </button>
                                </div>
                              </div>

                              <button onClick={handleCancelOrder} className={styles.btnDestructive} style={{ background: '#fff', border: '1px solid #ef4444', color: '#ef4444', padding: 10, borderRadius: 8, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                 <Ban size={18} style={{marginRight:8}} /> Cancel Order
                              </button>
                           </div>
                       )}

                       {/* COMPLETION PHASE */}
                       {(status === 'InProgress' || status === 'CompletedByClient' || status === 'CompletedByPro') && (
                           <button onClick={handleConfirmCompletion} style={{ width: '100%', background: '#22c55e', color: 'white', border: 'none', padding: 10, borderRadius: 8, fontWeight: 600 }}>
                              <CheckCheck size={18} style={{marginRight:8}} /> Confirm Completion
                           </button>
                       )}
                  </>
              )}

              {status === 'Completed' && (
                  <div style={{ textAlign: 'center', color: '#166534', fontWeight: 700, padding: 10, background: '#dcfce7', borderRadius: 8, width: '100%' }}>
                      <CheckCircle2 size={18} style={{display:'inline', marginRight:6}}/> Order Completed
                  </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {isOfferModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Update Price</h3>
            <p>Enter the total amount for the job.</p>
            <div className={styles.inputWrapper}>
              <input type="number" className={styles.modalInput} value={offerInput} onChange={(e) => setOfferInput(Number(e.target.value))} autoFocus />
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