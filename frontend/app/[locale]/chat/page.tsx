'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { 
  Send, Paperclip, MoreVertical, Phone, Video, 
  CheckCircle2, ShieldAlert, BadgeCheck, DollarSign, XCircle,
  Edit3, MapPin, Calendar, Clock, Info
} from 'lucide-react';
import styles from './ChatPage.module.css';
import { socket } from '../components/socket';
import { ChatInfoDTO } from '@/types/Chat';
import { LoginContext } from '../components/context/LoginContext';

// --- Types ---

type UserRole = 'client' | 'pro' | 'admin';

interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
}

interface Message {
  id: string;
  senderId: string;
  text?: string;
  type: 'text' | 'img' | 'offer' | 'system';
  timestamp: Date;
  offerPrice?: number;
  offerStatus?: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
}

// Updated OrderDTO based on your C# class
// Note: I kept 'finalPrice' and 'initialPrice' for the chat negotiation logic
interface OrderDTO {
  id: string;
  title: string;
  description: string;
  postedAt: Date;
  location: 'AtClients' | 'AtPros' | 'Online';
  address?: string; // Optional for UI display
  additionalComment: string;
  deadlineDate?: Date;
  desiredTimeStart?: string; // "10:00"
  desiredTimeEnd?: string;   // "14:00"
  imgFileRef: string;
  status: 'negotiating' | 'in_work' | 'completed';
  clientName: string;
  proName: string;
  
  // Pricing (Essential for Chat Flow)
  initialBudget: number; 
  finalPrice?: number;
}

type NewMessage = {
  text: string;
  senderType: string;
  timestamp: Date;
  readed: boolean;
};

// --- Mock Data ---

const CURRENT_USER_CLIENT: User = { id: 'u1', name: 'Alexandru P.', avatar: 'https://imgs.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80', role: 'client' };
const CURRENT_USER_PRO: User = { id: 'u2', name: 'Master John', avatar: 'https://imgs.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=100&q=80', role: 'pro' };
const CURRENT_USER_ADMIN: User = { id: 'u3', name: 'Support', avatar: '', role: 'admin' };

const MOCK_ORDER: OrderDTO = {
  id: '#ORD-9921',
  title: 'Fix Kitchen Faucet & Pipes',
  description: 'Old faucet needs replacing. Pipes underneath show signs of rust. I have the new Grohe faucet ready.',
  postedAt: new Date('2023-10-25T09:30:00'),
  location: 'AtClients',
  address: 'Brașov, Tractorul',
  additionalComment: 'Free parking available.',
  deadlineDate: new Date('2023-10-28'),
  desiredTimeStart: '10:00',
  desiredTimeEnd: '14:00',
  imgFileRef: 'https://imgs.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80', // Order specific img
  status: 'negotiating',
  clientName: 'Alexandru P.',
  proName: 'Master John',
  initialBudget: 250
};

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'u1', text: 'Hi, I posted the photos. Can you do it?', type: 'text', timestamp: new Date(Date.now() - 10000000) },
  { id: 'm2', senderId: 'u2', text: 'Hello! Yes, I see the faucet type. I have the tools.', type: 'text', timestamp: new Date(Date.now() - 9000000) },
];

export default function ChatPage() {
  const [myRole, setMyRole] = useState<UserRole>('pro'); 
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [order, setOrder] = useState<OrderDTO>(MOCK_ORDER);
  
  const {user} = use(LoginContext)
  const [newMessages, setNewMessages] = useState<NewMessage[]>([]);
  
  const [isOfferModalOpen, setOfferModalOpen] = useState(false);
  const [offerInput, setOfferInput] = useState<number>(order.initialBudget);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const me = myRole === 'client' ? CURRENT_USER_CLIENT : myRole === 'pro' ? CURRENT_USER_PRO : CURRENT_USER_ADMIN;
  const otherUser = myRole === 'client' ? CURRENT_USER_PRO : CURRENT_USER_CLIENT;

  // Helper: Date Formatter
  const formatDate = (date?: Date) => {
    if (!date) return 'Flexible';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: me.id,
      text: inputText,
      type: 'text',
      timestamp: new Date()
    };
    setMessages([...messages, newMsg]);
    setInputText('');

    socket.emit("sendMessage", { room: "chat123", message: inputText, 
      senderType: chatInfo.clientId === user.id ? 'client' : chatInfo.proId === user.id ? 'pro' : 'system' });
  };

  const handleCreateOffer = () => {

    const newPrice = offerInput

    socket.emit("newOffer", { room: "chat123", price: newPrice});

    const updatedMessages = messages.map(msg => {
      if (msg.type === 'offer' && msg.offerStatus === 'pending') {
        return { ...msg, offerStatus: 'withdrawn' as const };
      }
      return msg;
    });

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: me.id,
      type: 'offer',
      offerPrice: offerInput,
      offerStatus: 'pending',
      timestamp: new Date()
    };

    setMessages([...updatedMessages, newMsg]);
    setOfferModalOpen(false);
    
  };

  const handleAcceptOffer = (msgId: string, price: number) => {
    setMessages(msgs => msgs.map(m => m.id === msgId ? { ...m, offerStatus: 'accepted' } : m));
    setOrder(prev => ({ ...prev, status: 'in_work', finalPrice: price }));
    setMessages(prev => [...prev, {
      id: Date.now().toString(), senderId: 'system', text: `Deal accepted! Final price: ${price} RON. Work can begin.`, type: 'system', timestamp: new Date()
    }]);
  };

  const handleRejectOffer = (msgId: string) => {
    setMessages(msgs => msgs.map(m => m.id === msgId ? { ...m, offerStatus: 'rejected' } : m));
  };

  const openChangePriceModal = (currentPrice?: number) => {
    if(currentPrice) setOfferInput(currentPrice);
    setOfferModalOpen(true);
  }

  useEffect(() => {
    socket.on("previousMessages", (messages) => {
      setMessages(messages.filter((i)=>i.senderType !== 'system').map(m => ({
          sender: m.sender ?? '',
          message: m.text,
          senderType: m.senderType,
          timestamp: m.timestamp,
          readed: m.readed,
      })));
    });

    socket.emit("joinRoom", { room: "chat123"});

    socket.on("newMessage", (msg: NewMessage) => {
      setNewMessages((prev) => [...prev, {
        senderType: msg.senderType === 'client' ? chatInfo.clientId.toString() : msg.senderType === 'pro' ? chatInfo.proId.toString() : 'system',
        text: msg.text,
        timestamp: new Date(msg.timestamp),
        readed: msg.readed,
      }]);
    })

    return () => {socket.off('receivedMessage');
        socket.off('typing');
        socket.off('stopTyping');
        socket.off('newMessage');
    }

  }, []);

  const [chatInfo, setChatInfo] = useState<ChatInfoDTO>({clientId: 0, proId: 0});

  useEffect(() => {
    const chatId = 'chat123'; // This would be dynamic in a real app
    const fetchInfo = async () => {
      const res = await fetch(`http://localhost:5221/api/chat/${chatId}/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setChatInfo(data);
    }
    fetchInfo();
  }, []);

  return (
    <div className={styles.page}>
      
      <div className={styles.debugBar}>
        <span>Viewing as:</span>
        <select value={myRole} onChange={(e) => setMyRole(e.target.value as UserRole)} className={styles.roleSelect}>
          <option value="client">Client (Alex)</option>
          <option value="pro">Pro (John)</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className={styles.layout}>
        
        {/* --- LEFT: Chat Area --- */}
        <div className={styles.chatContainer}>
          <header className={styles.chatHeader}>
            <div className={styles.headerUser}>
              <div className={styles.avatarWrapper}>
                <img src={otherUser.avatar || '/default-user.png'} alt={otherUser.name} width={48} height={48} className={styles.avatar} />
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
              const isMe = msg.senderId === me.id;
              const isSystem = msg.type === 'system';
              const isAdmin = msg.senderId === 'u3';

              if (isSystem) return <div key={msg.id} className={styles.systemMessage}><span>{msg.text}</span></div>;

              return (
                <div key={msg.id} className={`${styles.messageRow} ${isMe ? styles.rowMe : styles.rowThem}`}>
                  {!isMe && !isAdmin && <img src={otherUser.avatar} alt="Sender" width={32} height={32} className={styles.miniAvatar} />}
                  <div className={`${styles.bubble} ${isMe ? styles.bubbleMe : isAdmin ? styles.bubbleAdmin : styles.bubbleThem} ${msg.type === 'offer' ? styles.bubbleOffer : ''}`}>
                    {msg.type === 'text' && <p>{msg.text}</p>}
                    
                    {msg.type === 'offer' && (
                      <div className={`${styles.offerCard} ${msg.offerStatus === 'withdrawn' ? styles.offerCardDimmed : ''}`}>
                        <div className={styles.offerHeader}>
                          <DollarSign size={18} />
                          <span>{msg.offerStatus === 'withdrawn' ? 'Previous Offer' : 'Final Price Proposal'}</span>
                        </div>
                        <div className={styles.offerAmount}>{msg.offerPrice} RON</div>
                        
                        {msg.offerStatus === 'pending' && <div className={styles.offerStatusPending}>Waiting for acceptance...</div>}
                        {msg.offerStatus === 'accepted' && <div className={styles.offerStatusAccepted}><CheckCircle2 size={16}/> Accepted</div>}
                        {msg.offerStatus === 'rejected' && <div className={styles.offerStatusRejected}><XCircle size={16}/> Rejected</div>}
                        {msg.offerStatus === 'withdrawn' && <div className={styles.offerStatusWithdrawn}>Outdated</div>}

                        {msg.offerStatus === 'pending' && me.role === 'client' && (
                          <div className={styles.offerActions}>
                            <button onClick={() => handleRejectOffer(msg.id)} className={styles.btnReject}>Reject</button>
                            <button onClick={() => handleAcceptOffer(msg.id, msg.offerPrice!)} className={styles.btnAccept}>Accept Deal</button>
                          </div>
                        )}

                        {msg.offerStatus === 'pending' && me.role === 'pro' && (
                          <div className={styles.offerActions}>
                             <button onClick={() => openChangePriceModal(msg.offerPrice)} className={styles.btnChange}>
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
            
            {/* 1. Order img */}
            <div className={styles.orderimgContainer}>
              <img 
                src={order.imgFileRef} 
                alt="Order" 
                className={styles.orderimg} 
              />
              <span className={`${styles.imgStatusBadge} ${styles[order.status]}`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>

            {/* 2. Order Info */}
            <div className={styles.orderContent}>
                <h4 className={styles.orderTitle}>{order.title}</h4>
                <p className={styles.orderDesc}>{order.description}</p>

                {/* Meta icons row */}
                <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                      <Calendar size={14} className={styles.metaIcon} />
                      <span>{formatDate(order.deadlineDate)}</span>
                    </div>

                    <div className={styles.metaItem}>
                      <Clock size={14} className={styles.metaIcon} />
                      <span>{order.desiredTimeStart} – {order.desiredTimeEnd}</span>
                    </div>

                    <div className={styles.metaItem}>
                      <MapPin size={14} className={styles.metaIcon} />
                    <span>
                        {order.location === 'AtClients'
                        ? 'At client'
                        : order.location === 'Online'
                        ? 'Online'
                        : 'Remote'}
                    </span>
                    </div>

                    {/* Address */}
                    <div className={styles.metaItem}>
                      <MapPin size={14} className={styles.metaIconMuted} />
                      <span>{order.address}</span>
                    </div>

                    {/* Posted date */}
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Posted:</span>
                      <span>{formatDate(order.postedAt)}</span>
                    </div>
                </div>

                {/* Client / Pro info */}
                <div className={styles.peopleRow}>
                    <div className={styles.personBadge}>
                      <span className={styles.personLabel}>Client</span>
                      <span className={styles.personName}>{MOCK_ORDER.clientName}</span>
                    </div>

                    <div className={styles.personBadge}>
                      <span className={styles.personLabel}>Pro</span>
                      <span className={styles.personName}>{MOCK_ORDER.proName}</span>
                    </div>
                </div>

                {/* Additional note */}
                {order.additionalComment && (
                    <div className={styles.additionalNote}>
                      <Info size={12} className={styles.infoIcon} />
                      <span>{order.additionalComment}</span>
                    </div>
                )}
                </div>


            <hr className={styles.divider} />

            {/* 3. Pricing Section */}
            <div className={styles.priceSection}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Initial Budget</span>
                <span className={styles.priceValue}>{order.initialBudget} RON</span>
              </div>
              
              {order.finalPrice && (
                <div className={styles.finalPriceRow}>
                  <span className={styles.priceLabel}>Final Price</span>
                  <span className={styles.highlightPrice}>{order.finalPrice} RON</span>
                </div>
              )}
            </div>

            {/* 4. Action Button */}
            <div className={styles.cardFooter}>
              {me.role === 'pro' && order.status === 'negotiating' && (
                <button className={styles.makeOfferBtn} onClick={() => openChangePriceModal(order.finalPrice || order.initialBudget)}>
                  <BadgeCheck size={18} />
                  {messages.some(m => m.type === 'offer' && m.offerStatus === 'pending') ? 'Update Offer' : 'Set Final Price'}
                </button>
              )}
              {me.role === 'client' && order.status === 'negotiating' && (
                 <p className={styles.waitingText}>Negotiating price...</p>
              )}
              {order.status === 'in_work' && (
                 <div className={styles.inWorkBadge}>
                    <CheckCircle2 size={16}/> Work in Progress
                 </div>
              )}
            </div>

          </div>
        </aside>

      </div>

      {/* Modal logic remains the same... */}
      {isOfferModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{messages.some(m => m.type === 'offer' && m.offerStatus === 'pending') ? 'Update Price' : 'Set Final Price'}</h3>
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
              <button onClick={handleCreateOffer} className={styles.btnPrimary}>Send Offer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}