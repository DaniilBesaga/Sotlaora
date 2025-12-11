'use client';
import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MapPin, Plus, MessageCircle, Settings, FileText, 
  Wallet, Shield, Star, RotateCcw, Calendar, Clock 
} from 'lucide-react';
import styles from './UserCabinet.module.css';
import { Location, OrderDTO, OrderStatus } from '@/types/Order';
import { LoginContext } from '../components/context/LoginContext';

// --- MOCK HELPER: Subcategory ID to Name mapping ---
const getSubcategoryName = (id: number) => {
  const map: Record<number, string> = {
    1: 'Cleaning',
    2: 'Plumbing',
    3: 'Electrician',
    4: 'Furniture Assembly',
    5: 'Repairs'
  };
  return map[id] || `Service #${id}`;
};

// --- 2. UPDATED MOCK DATA ---
const ALL_ORDERS: OrderDTO[] = [
  {
    id: 1,
    title: 'General house cleaning 60m²',
    description: 'Need a full cleanup after renovation. Must bring own vacuum and supplies.',
    postedAt: new Date('2023-10-25T10:00:00'),
    price: 250,
    location: Location.AtClients, // "At Client's place"
    deadlineDate: new Date('2023-10-28'),
    subcategories: [1, 5], // Cleaning, Repairs
    status: OrderStatus.Active,
    imageFileRefs: ['/images/services/air.jpg', '/images/services/cleaning.jpg'],
    additionalComment: '',
    desiredTimeStart: '',
    desiredTimeEnd: '',
    clientId: 123,
    imageFileIds: [45, 46]
  },
  {
    id: 2,
    title: 'Fix kitchen socket',
    description: 'Socket sparks when using the kettle. Need replacement.',
    postedAt: new Date('2023-10-24T14:30:00'),
    price: 100,
    location: Location.AtClients,
    deadlineDate: new Date('2023-10-25'), // Urgent/Today
    subcategories: [3], // Electrician
    status: OrderStatus.Taken,
    imageFileRefs: ['/images/services/gas.jpg'],
    additionalComment: '',
    desiredTimeStart: '',
    desiredTimeEnd: '',
    clientId: 123,
    imageFileIds: [45, 46]
  },
  {
    id: 3,
    title: 'Assemble PAX Wardrobe',
    description: 'Two meter wide wardrobe from IKEA.',
    postedAt: new Date('2023-09-10T09:00:00'),
    price: 180,
    location: Location.AtClients,
    subcategories: [4], // Furniture
    status: OrderStatus.Completed,
    imageFileRefs: ['/images/services/furniture.jpg'],
    additionalComment: '',
    desiredTimeStart: '',
    desiredTimeEnd: '',
    clientId: 123,
    imageFileIds: [45, 46]
  }
];

export default function UserCabinet() {

  const {getMeLongClient, authorizedFetch, userLong, authenticated} = use(LoginContext)

  const [profile, setProfile] = useState({
      name: 'Иван Петров',
      id: '',
      city: 'Тимишоара, ул. Ласло Петефи 10',
      email: 'ivan@example.com',
      phone: '+40 712 345 678',
      avatar: '/images/pros/1.jpg',
      rating: 4.9,
    });

  useEffect(() => {
      getMeLongClient(false);
  }, []);

  useEffect(() => {
      
    if (authenticated === 'authenticated' && userLong !== undefined) {
        setProfile(prevProfile => ({ ...prevProfile, name: userLong.userName || prevProfile.name, avatar: userLong.imageRef || prevProfile.avatar, id: `#${userLong.id}`,
        city: userLong.location || 'Timisoara', phone: userLong.phoneNumber || prevProfile.phone }));
    }
    console.log(userLong)
  }, [userLong]);

  const [activeTab, setActiveTab] = useState<'active' | 'history' | 'drafts'>('active');

  const displayedOrders = ALL_ORDERS.filter(order => {
    if (activeTab === 'active') return ['searching', 'in_progress'].includes(order.status);
    if (activeTab === 'history') return ['completed', 'cancelled'].includes(order.status);
    return false; 
  });

  // ... (Keep Profile state & Quick Nav array same as before) ...
  const quick = [{ key: 'create', label: 'Create Order', icon: <Plus size={18}/>, href: '/create-order', highlight: true }, { key: 'messages', label: 'Messages', icon: <MessageCircle size={18}/>, count: 2, href: '#messages' }, { key: 'wallet', label: 'Wallet', icon: <Wallet size={18}/>, href: '#wallet' }, { key: 'settings', label: 'Settings', icon: <Settings size={18}/>, href: '#settings' }];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
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

        {/* Main Content */}
        <main className={styles.main}>
          <div className={styles.topbarRow}>
             <h1 className={styles.h1}>{activeTab === 'active' ? 'Active Orders' : 'History'}</h1>
          </div>
          <nav className={styles.tabs} role="tablist">
            <button className={`${styles.tab} ${activeTab==='active'?styles.active:''}`} onClick={() => setActiveTab('active')}>Active</button>
            <button className={`${styles.tab} ${activeTab==='history'?styles.active:''}`} onClick={() => setActiveTab('history')}>History</button>
            <button className={`${styles.tab} ${activeTab==='drafts'?styles.active:''}`} onClick={() => setActiveTab('drafts')}>
              Черновики
            </button>
          </nav>

          <section className={styles.contentArea}>
             {displayedOrders.length > 0 ? (
                <div className={styles.list}>
                  {displayedOrders.map(order => (
                    <ClientOrderCard key={order.id} item={order} />
                  ))}
                </div>
             ) : (
                <div className={styles.emptyState}>
                   {/* Empty state markup same as previous */}
                   <FileText size={48} className={styles.emptyIconMain} />
                   <h3 className={styles.emptyTitle}>No orders here</h3>
                   <button className={styles.createOrderBtnLarge}><Plus size={20}/> Create Order</button>
                </div>
             )}
          </section>
        </main>
        
        {/* Right Nav */}
        <aside className={styles.quickNav}>
           <div className={styles.quickCard}>
              {quick.map(item => (
                <Link key={item.key} href={item.href} className={`${styles.qItem} ${item.highlight ? styles.qItemHighlight : ''}`}>
                   <div className={styles.qLeft}>{item.icon}</div>
                   <div className={styles.qCenter}>
                      <div className={styles.qLabel}>{item.label}</div>
                      {item.count && <div className={styles.qSub}>{item.count} новых</div>}
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

// --- 3. UPDATED CARD COMPONENT ---
function ClientOrderCard({ item }: { item: OrderDTO }) {
  const isHistory = item.status === OrderStatus.Completed || item.status === OrderStatus.Cancelled;

  // Helper: Format Date
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  // Helper: Location Label
  const getLocationLabel = (loc: string) => {
    if (loc === 'AtClients') return "Client's Place";
    if (loc === 'AtPros') return "Pro's Place";
    return loc;
  };

  return (
    <motion.article className={`${styles.card} ${isHistory ? styles.cardHistory : ''}`} whileHover={{ y: -6 }}>
      
      {/* LEFT: Image & Status */}
      <div className={styles.cardMedia}>
        <div className={styles.mainThumb}>
          <img src={item.imageFileRefs?.[0] ?? '/images/placeholder.jpg'} alt={item.title} className={item.status === OrderStatus.Cancelled ? styles.imgGrayscale : ''} />
          {/* Simple status badge logic */}
          <div className={`${styles.statusBadge} ${item.status === OrderStatus.Taken ? styles.status_active : styles.status_pending}`}>
             {item.status.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* CENTER: Body */}
      <div className={styles.cardBody}>
        <div className={styles.cardHeadRow}>
           <h3 className={styles.cardTitle}>{item.title}</h3>
           {/* {item.rating && <div className={styles.ratingBadge}><Star size={12} fill="#fbbf24" stroke="none"/> {item.rating}.0</div>} */}
        </div>

        {/* METADATA ROW (New Info) */}
        <div className={styles.metaInfoGrid}>
            <div className={styles.metaItem} title="Posted Date">
                <Calendar size={14} /> 
                <span>Posted: {formatDate(item.postedAt)}</span>
            </div>
            {item.deadlineDate && (
                <div className={`${styles.metaItem} ${styles.metaUrgent}`} title="Deadline">
                    <Clock size={14} /> 
                    <span>Due: {formatDate(item.deadlineDate)}</span>
                </div>
            )}
            <div className={styles.metaItem} title="Location">
                <MapPin size={14} /> 
                <span>{getLocationLabel(item.location)}</span>
            </div>
        </div>

        <p className={styles.cardDesc}>{item.description}</p>

        {/* BOTTOM ROW: Tags & Price */}
        <div className={styles.metaRow}>
          <div className={styles.tags}>
            {item.subcategories.map(subId => (
                <span key={subId} className={styles.chip}>
                    {getSubcategoryName(subId)}
                </span>
            ))}
          </div>
          <div className={styles.priceTag}>{item.price} RON</div>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className={styles.cardActions}>
        {item.status === OrderStatus.WaitingForPayment && <button className={styles.primary}>Proposals 1</button>}
        {item.status === OrderStatus.Taken && <button className={styles.primary}>Chat</button>}
        {item.status === OrderStatus.Completed && <button className={styles.primary}>Review</button>}
        {!isHistory && <button className={styles.ghost}>Edit</button>}
        <button className={styles.secondary}>Details</button>
      </div>
    </motion.article>
  )
}