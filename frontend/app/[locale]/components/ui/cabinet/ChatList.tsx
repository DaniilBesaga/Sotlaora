'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
// Assuming you are using the same CSS file or a copy of it
import styles from '../cabinet/ProOrders.module.css'; 
import { LoginContext } from '../../context/LoginContext';
import { ChatShortDTO } from "@/types/Chat"; // Ensure this path is correct

export default function ProChats({ chats = [] }: { chats?: ChatShortDTO[] }) {

  const { authenticated, userLong, authorizedFetch } = use(LoginContext);

  // 1. State Management
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived'>('all');

  // 2. Profile State (Matching ProOrders)
  const [profile, setProfile] = useState({
    name: 'Иван Петров',
    id: '',
    city: 'Тимишоара',
    email: 'ivan@example.com',
    phone: '',
    avatar: '/images/pros/1.jpg',
  });

  // 3. Effect: Sync Profile & Fetch Data
  useEffect(() => {
    // Mock fetch or Real fetch logic here
    const fetchChats = async () => {
       // If you need to fetch from API, uncomment below:
       /*
       try {
         const res = await authorizedFetch('http://localhost:5221/api/chat/get-all');
         const data = await res.json();
         setChats(data);
       } catch (e) { console.error(e); }
       */
       // For now, we assume initialChats are passed or already set
       setLoading(false);
    };

    if (authenticated === 'authenticated' && userLong !== undefined) {
        setProfile(prev => ({ 
            ...prev, 
            name: userLong.userName || prev.name, 
            avatar: userLong.imageRef || prev.avatar, 
            id: `#${userLong.id}`,
            city: userLong.location || 'Timisoara', 
            phone: userLong.phoneNumber || prev.phone 
        }));
        fetchChats();
    } else if (authenticated === 'unauthenticated') {
        setLoading(false); 
    }
  }, [userLong, authenticated]);

  // 4. Filtering Logic
 

  // 5. Sidebar Navigation
  const quick = [
    { key: 'orders', label: 'Заказы', icon: '🧾', count: 4, href: '/cabinet/orders' },
    { key: 'subscriptions', label: 'Подписки', icon: '🔔', count: 2, href: '#subscriptions' },
    { key: 'messages', label: 'Сообщения', icon: '💬', count: chats.filter(c => c.unread).length, href: '/cabinet/messages', highlight: true },
    { key: 'earnings', label: 'Заработок', icon: '💵', count: null, href: '/cabinet/earnings' },
    { key: 'settings', label: 'Настройки', icon: '⚙️', count: null, href: '#settings' },
  ];

  if (loading && authenticated === 'loading') return <div className={styles.page}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* --- HEADER --- */}
        <header className={styles.headerCard}>
          <img src={profile.avatar} alt="avatar" className={styles.avatar} />
          <div className={styles.headerInfo}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div className={styles.hName}>{profile.name}</div>
                <div className={styles.hMeta}>ID: <strong style={{color:'#374151'}}>{profile.id}</strong></div>
              </div>
            </div>
            <div className={styles.badgeList}>
              <span className={styles.badge}>{profile.city}</span>
              {profile.phone && <span className={styles.badge}>{profile.phone}</span>}
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className={styles.main}>
            
            {/* Title & Search Bar Row */}
            <div className={styles.topbarRow} style={{ flexWrap: 'wrap', gap: 10 }}>
              <h1 className={styles.h1}>Сообщения</h1>
              
              {/* Integrated Search Input Style */}
              <div style={{ position: 'relative', marginLeft: 'auto', minWidth: 240 }}>
                 <input 
                    type="text" 
                    placeholder="Поиск по имени или заказу..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '10px 10px 10px 36px',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        width: '100%',
                        outline: 'none',
                        fontSize: '14px'
                    }}
                 />
                 <svg style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                 </svg>
              </div>
            </div>

            {/* Tabs */}
            <nav className={styles.tabs} role="tablist">
              <button 
                className={`${styles.tab} ${activeTab==='all'?styles.active:''}`} 
                onClick={() => setActiveTab('all')}
              >
                Все чаты <span style={{color:'#94a3b8', fontSize: '0.8em', marginLeft: 4}}>{chats.length}</span>
              </button>
              <button 
                className={`${styles.tab} ${activeTab==='unread'?styles.active:''}`} 
                onClick={() => setActiveTab('unread')}
              >
                Непрочитанные
                {chats.some(c => c.unread) && <span style={{color: '#ef4444', marginLeft: 4}}>•</span>}
              </button>
            </nav>

            {/* Content Area */}
            <section className={styles.contentCard} style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
                {chats.length > 0 ? (
                    <div className={styles.list}>
                        {chats.map(chat => (
                            <ChatCard key={chat.id} chat={chat} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.empty}>
                        {searchTerm ? 'По вашему запросу ничего не найдено' : 'У вас пока нет сообщений'}
                    </div>
                )}
            </section>

        </main>

        {/* --- RIGHT NAV --- */}
        <aside className={styles.quickNav}>
          <div className={styles.quickCard}>
            {quick.map(item => (
              <Link 
                key={item.key} 
                href={item.href} 
                className={styles.qItem} 
                style={item.highlight ? { background: '#f0f9ff', border: '1px solid #bae6fd' } : {}}
              >
                <div className={styles.qLeft} aria-hidden>{item.icon}</div>
                <div className={styles.qCenter}>
                  <div className={styles.qLabel} style={item.highlight ? {color: '#0284c7'} : {}}>{item.label}</div>
                  {item.count != null && item.count > 0 && <div className={styles.qSub} style={{color: '#ef4444'}}>{item.count} новых</div>}
                </div>
                <div className={styles.qRight} aria-hidden>›</div>
              </Link>
            ))}
            <div className={styles.divider} />
            <Link href="#support" className={styles.support}>🛡️ Безопасность и помощь</Link>
          </div>
        </aside>

      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Chat Card ---
// Uses the same HTML structure as OrdersGrid but adapted for Chat data
function ChatCard({ chat }: { chat: ChatShortDTO }) {
    return (
        <motion.a  href={`/chat/${chat.id}`}
            className={`${styles.card} ${chat.unread ? 'unread-glow' : ''}`} 
            whileHover={{ y: -4 }}
            // Override grid columns specifically for chats (Avatar needs less space than Order Thumbnail)
            style={{ gridTemplateColumns: '80px 1fr 140px', alignItems: 'center' }} 
        >
            
            {/* 1. Media Column (Avatar) */}
            <div className={styles.cardMedia} style={{ width: 80, height: 80 }}>
                <div className={styles.mainThumb} style={{ height: 80, borderRadius: '50%' }}>
                    <img 
                        src={chat.avatar || '/default-avatar.png'} 
                        alt={chat.clientName} 
                        style={{ borderRadius: '50%' }}
                    />
                    {/* Status Dot */}
                    <span style={{
                        position: 'absolute', bottom: 2, right: 2, 
                        width: 14, height: 14, background: '#22c55e', 
                        borderRadius: '50%', border: '2px solid white'
                    }} />
                </div>
            </div>

            {/* 2. Body Column */}
            <div className={styles.cardBody}>
                <div className={styles.cardHeadRow}>
                    <h3 className={styles.cardTitle} style={{ fontSize: 17 }}>{chat.clientName}</h3>
                    <div className={styles.cardMeta} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {chat.unread && (
                             <span style={{ 
                                background: '#ef4444', color: 'white', 
                                fontSize: 10, fontWeight: 'bold', 
                                padding: '2px 8px', borderRadius: 99 
                            }}>NEW</span>
                        )}
                        {chat.time}
                    </div>
                </div>

                {/* Message Preview */}
                <p className={styles.cardDesc} style={{ 
                    fontWeight: chat.unread ? 600 : 400,
                    color: chat.unread ? '#111827' : '#4b5563',
                    WebkitLineClamp: 2 
                }}>
                    {chat.lastMessage}
                </p>

                {/* Order Context Tags */}
                <div className={styles.metaRow} style={{ marginTop: 8 }}>
                    <div className={styles.tags}>
                        <span className={styles.chip} style={{ background: '#f0f9ff', color: '#0369a1' }}>
                            #{chat.orderId}
                        </span>
                        <span className={styles.chip} style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {chat.orderTitle}
                        </span>
                    </div>
                </div>
            </div>

            {/* 3. Actions Column */}
            <div className={styles.cardActions} style={{ marginLeft: 10 }}>
                <button className={styles.primary} style={{ marginTop: 'auto' }}>
                    Ответить
                </button>
                <button className={styles.secondary}>
                    Детали
                </button>
            </div>

        </motion.a>
    )
}