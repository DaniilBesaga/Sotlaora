'use client'

import { ChatShortDTO } from "@/types/Chat"
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Plus, 
  MessageCircle, 
  Wallet, 
  Settings, 
  Shield, 
  Search, 
  FileText 
} from 'lucide-react';
import styles from '../UserCabinet.module.css';
import { LoginContext } from "../../components/context/LoginContext";

export default function ChatsClient({chats}: {chats: ChatShortDTO[]}) {

  console.log(chats)

  // 1. Context and Profile State (Copied from UserCabinet to match header)
  const { userLong, authenticated } = use(LoginContext);

  const [profile, setProfile] = useState({
      name: 'Иван Петров',
      id: '',
      city: 'Тимишоара, ул. Ласло Петефи 10',
      email: 'ivan@example.com',
      phone: '+40 712 345 678',
      avatar: '/images/pros/1.jpg',
  });

  // Sync profile with Context
  useEffect(() => {
    if (authenticated === 'authenticated' && userLong !== undefined) {
        setProfile(prevProfile => ({ 
            ...prevProfile, 
            name: userLong.userName || prevProfile.name, 
            avatar: userLong.imageRef || prevProfile.avatar, 
            id: `#${userLong.id}`,
            city: userLong.location || 'Timisoara', 
            phone: userLong.phoneNumber || prevProfile.phone 
        }));
    }
  }, [userLong, authenticated]);

  // 2. Local State for Chats (Search & Filter)
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  // Filter Logic
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          chat.orderTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ? true : chat.unread;
    
    return matchesSearch && matchesTab;
  });

  // 3. Navigation Setup
  const quick = [
    { key: 'create', label: 'Create Order', icon: <Plus size={18}/>, href: '/create-order' }, 
    { key: 'messages', label: 'Messages', icon: <MessageCircle size={18}/>, count: chats.filter(c => c.unread).length, href: '/cabinet-c/chats', highlight: true }, 
    { key: 'wallet', label: 'Wallet', icon: <Wallet size={18}/>, href: '#wallet' }, 
    { key: 'settings', label: 'Settings', icon: <Settings size={18}/>, href: '#settings' }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* --- Header (Shared Layout) --- */}
        <header className={styles.headerCard}>
          <img src={profile.avatar} alt="avatar" className={styles.avatar} />
          <div className={styles.headerInfo}>
            <div className={styles.headerTopRow}>
                <div className={styles.hName}>{profile.name}</div>
                <div className={styles.hMeta}>ID: {profile.id}</div>
            </div>
            <div className={styles.badgeList}>
              <span className={styles.badge}><MapPin size={14}/> {profile.city}</span>
            </div>
          </div>
        </header>

        {/* --- Main Content --- */}
        <main className={styles.main}>
          
          {/* Top Bar with Title and Search */}
          <div className={styles.topbarRow} style={{ flexWrap: 'wrap', gap: 10 }}>
             <h1 className={styles.h1}>Сообщения <span style={{color: '#6b7280', fontSize: '0.8em', marginLeft: 8}}>{chats.length}</span></h1>
             
             {/* Integrated Search Input */}
             <div className={styles.searchBlock} style={{ marginLeft: 'auto', position: 'relative' }}>
                <Search className={styles.searchIcon} size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input 
                    type="text" 
                    placeholder="Поиск..." 
                    className={styles.searchInput} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '10px 10px 10px 40px', borderRadius: 10, border: '1px solid #e5e7eb', width: 240, outline: 'none' }}
                />
             </div>
          </div>

          {/* Tabs */}
          <nav className={styles.tabs} role="tablist">
            <button className={`${styles.tab} ${activeTab==='all'?styles.active:''}`} onClick={() => setActiveTab('all')}>
                Все чаты
            </button>
            <button className={`${styles.tab} ${activeTab==='unread'?styles.active:''}`} onClick={() => setActiveTab('unread')}>
                Непрочитанные {chats.some(c => c.unread) && <span className={styles.unreadDot} style={{color: '#ef4444', marginLeft: 4}}>•</span>}
            </button>
          </nav>

          {/* Content Area */}
          <section className={styles.contentArea}>
             {filteredChats.length > 0 ? (
                <div className={styles.list}>
                  {filteredChats.map(chat => (
                    <ChatCardItem key={chat.id} chat={chat} />
                  ))}
                </div>
             ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIllustration}>
                        <div className={styles.emptyCircle}></div>
                        <MessageCircle size={48} className={styles.emptyIconMain} />
                    </div>
                    <h3 className={styles.emptyTitle}>
                        {searchTerm ? 'Ничего не найдено' : 'Нет сообщений'}
                    </h3>
                    <p className={styles.emptyDesc}>
                        {searchTerm ? 'Попробуйте изменить параметры поиска' : 'Здесь будут отображаться ваши диалоги с исполнителями.'}
                    </p>
                </div>
             )}
          </section>
        </main>
        
        {/* --- Right Nav (Sidebar) --- */}
        <aside className={styles.quickNav}>
           <div className={styles.quickCard}>
              {quick.map(item => (
                <Link key={item.key} href={item.href} className={`${styles.qItem} ${item.highlight ? styles.qItemHighlight : ''}`}>
                   <div className={styles.qLeft}>{item.icon}</div>
                   <div className={styles.qCenter}>
                      <div className={styles.qLabel}>{item.label}</div>
                      {/* Check specifically for messages count */}
                      {item.key === 'messages' && item.count !== undefined && item.count > 0 && (
                          <div className={styles.qSub} style={{color: '#ef4444'}}>{item.count} новых</div>
                      )}
                   </div>
                   <div className={styles.qRight}>›</div>
                </Link>
              ))}
              <div className={styles.divider} />
              <Link href="#support" className={styles.support}>
                <Shield size={16} style={{marginRight:8}}/> Помощь
              </Link>
           </div>
        </aside>

      </div>
    </div>
  );
}

// --- Sub-component for individual Chat Item (Styled like UserCabinet Cards) ---
function ChatCardItem({ chat }: { chat: ChatShortDTO }) {
    
    return (
        <a href={`/chat/${chat.id}`} className={`${styles.card} ${chat.unread ? styles.unreadCard : ''}`} style={{ gridTemplateColumns: '80px 1fr 140px', alignItems: 'center' }}>
            
            {/* 1. Avatar Section */}
            <div className={styles.cardMedia} style={{ width: 80, height: 80 }}>
                <div className={styles.mainThumb} style={{ width: 80, height: 80, borderRadius: '50%' }}>
                    <img 
                        src={chat.avatar || '/default-avatar.png'} 
                        alt={chat.clientName} 
                        style={{ borderRadius: '50%' }}
                    />
                    {/* Online Status Dot */}
                    <span style={{
                        position: 'absolute', bottom: 5, right: 5, 
                        width: 14, height: 14, background: '#22c55e', 
                        borderRadius: '50%', border: '2px solid white'
                    }} />
                </div>
            </div>

            {/* 2. Content Body */}
            <div className={styles.cardBody}>
                <div className={styles.cardHeadRow}>
                    <h3 className={styles.cardTitle} style={{fontSize: 17}}>
                        {chat.clientName}
                    </h3>
                </div>
                
                {/* Meta: Order info */}
                <div className={styles.metaInfoGrid} style={{marginTop: 4, marginBottom: 8}}>
                    <div className={styles.metaItem}>
                        <FileText size={12} />
                        <span>#{chat.orderId}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span>{chat.orderTitle}</span>
                    </div>
                </div>

                {/* Message Preview */}
                <p className={styles.cardDesc} style={{ 
                    color: chat.unread ? '#111827' : '#6b7280',
                    fontWeight: chat.unread ? 600 : 400,
                    background: !chat.unread ? '#f3f4f6' : 'transparent',
                    padding:! chat.unread ? '6px 10px' : 0,
                    borderRadius: !chat.unread ? 8 : 0
                }}>
                    {chat.lastMessage}
                </p>
            </div>

            {/* 3. Right Action / Time */}
            <div className={styles.cardActions} style={{ alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                <span className={styles.time} style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
                    {chat.time}
                </span>
                
                {chat.unread && (
                    <span style={{ 
                        background: '#ef4444', color: 'white', 
                        fontSize: 11, fontWeight: 'bold', 
                        padding: '2px 8px', borderRadius: 10 
                    }}>
                        New
                    </span>
                )}

                <button className={styles.secondary} style={{ marginTop: 'auto', width: 'auto', padding: '8px 16px' }}>
                    Открыть
                </button>
            </div>
        </a>
    )
}