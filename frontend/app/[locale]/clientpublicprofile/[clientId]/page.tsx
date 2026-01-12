'use client';

import React, { useEffect, useState } from 'react';
import { 
  MapPin, Star, MessageCircle, Calendar, ShieldCheck, 
  Briefcase, ThumbsUp, User as UserIcon, CheckCircle2,
  Share2, Flag, Clock
} from 'lucide-react';
// Use the CSS module that contains your .card styles
import styles from './ClientPublicProfile.module.css'; 
import { useParams } from 'next/navigation';
import { LoginContext } from '../../components/context/LoginContext';

// --- Types ---
interface ClientProfileDTO {
  id: number;
  userName: string;
  imageRef: string;
  city: string;
  createdAt: string;
  isVerified: boolean;
  ordersCount: number;
  rating: number;
  reviewsCount: number;
  hireRate?: number; 
}

interface ClientOrderDTO {
  id: number;
  title: string;
  description?: string;
  price: number;
  postedAt: string;
  status: string;
  category: string;
  imageFileRefs?: string[];
  location?: string;
  deadlineDate?: string;
}

interface ProReviewDTO {
  id: string;
  proName: string;
  proAvatar: string;
  rating: number;
  date: string;
  text: string;
}

// Helper: Status Badge (Inline or Import)
function OrderStatusBadge({ status = 'Active' }) {
  const s = {
    Active: { label: 'В работе', color: 'active' },
    Pending: { label: 'В ожидании', color: 'pending' },
    Completed: { label: 'Выполнено', color: 'done' },
    Cancelled: { label: 'Отменён', color: 'cancelled' },
  }[status] || { label: status, color: 'pending' };

  return (
    <div className={`${styles.statusBadge} ${styles['status_' + s.color]}`} role="status">
      <span className={styles.statusText}>{s.label}</span>
    </div>
  );
}

// Helper: Location Icon
function OrderLocation({ location }: { location?: string }) {
    if(!location) return <span>N/A</span>;
    return <span style={{display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#64748b'}}><MapPin size={12}/> {location}</span>;
}


export default function ClientPublicProfilePage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [profile, setProfile] = useState<ClientProfileDTO | null>(null);
  const [activeOrders, setActiveOrders] = useState<ClientOrderDTO[]>([]);
  const [reviews, setReviews] = useState<ProReviewDTO[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'reviews'>('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock Data
        setTimeout(() => {
            setProfile({
                id: Number(clientId),
                userName: "Александр Петров",
                imageRef: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
                city: "Брашов",
                createdAt: "2023-01-15T00:00:00",
                isVerified: true,
                ordersCount: 12,
                rating: 4.8,
                reviewsCount: 8,
                hireRate: 85
            });

            setActiveOrders([
                { 
                  id: 101, 
                  title: "Ремонт крана на кухне", 
                  description: "Течет кран на кухне, нужно заменить прокладку или сам кран. Инструментов нет.",
                  price: 150, 
                  postedAt: "2023-10-26T10:00:00", 
                  status: "Active", 
                  category: "Сантехника",
                  imageFileRefs: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400"],
                  location: "Брашов",
                  deadlineDate: "2023-10-30"
                },
                { 
                  id: 102, 
                  title: "Сборка шкафа IKEA", 
                  description: "Нужно собрать шкаф ПАКС. Высота 236см. Две двери.",
                  price: 300, 
                  postedAt: "2023-10-25T14:30:00", 
                  status: "Active", 
                  category: "Мебель",
                  imageFileRefs: [], 
                  location: "Брашов",
                  deadlineDate: null
                }
            ]);

            setReviews([
                { id: 'r1', proName: 'Иван Мастер', proAvatar: '', rating: 5, date: '10 Окт 2023', text: 'Отличный заказчик! Четко объяснил задачу, оплатил сразу.' },
                { id: 'r2', proName: 'Сергей Электрик', proAvatar: '', rating: 4, date: '05 Сен 2023', text: 'Все хорошо, но немного задержался с выбором времени.' }
            ]);
            setLoading(false);
        }, 600);

      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [clientId]);

  if (loading) return <div className={styles.page}>Загрузка...</div>;
  if (!profile) return <div className={styles.page}>Профиль не найден</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* --- Header Card --- */}
        <header className={styles.headerCard}>
          <div className={styles.headerMain}>
            <div className={styles.avatarWrapper}>
              <img src={profile.imageRef || '/default-avatar.png'} alt={profile.userName} className={styles.avatar} />
              {profile.isVerified && (
                <div className={styles.verifiedBadge} title="Verified Client"><ShieldCheck size={16} /></div>
              )}
            </div>
            <div className={styles.headerInfo}>
              <div className={styles.nameRow}>
                <h1 className={styles.hName}>{profile.userName}</h1>
                <span className={styles.statusDot} title="Online recently" />
              </div>
              <div className={styles.metaRow}>
                <div className={styles.ratingBadge}>
                  <Star size={14} fill="#FFD700" stroke="#FFD700" />
                  <span className={styles.ratingVal}>{profile.rating}</span>
                  <span className={styles.reviewCount}>({profile.reviewsCount} отзывов)</span>
                </div>
                <div className={styles.locationBadge}><MapPin size={14} />{profile.city}</div>
              </div>
              <div className={styles.tagsRow} style={{marginTop: 8}}>
                 <span className={styles.skillTag} style={{background:'#e0e7ff', color:'#4338ca'}}>Заказчик</span>
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.statsRow}>
              <div className={styles.statItem}><Briefcase size={20} className={styles.statIcon} /><div className={styles.statText}><strong>{profile.ordersCount}</strong><span>Заказов</span></div></div>
              <div className={styles.statItem}><ThumbsUp size={20} className={styles.statIcon} /><div className={styles.statText}><strong>{profile.hireRate}%</strong><span>Найм</span></div></div>
              <div className={styles.statItem}><Calendar size={20} className={styles.statIcon} /><div className={styles.statText}><strong>{new Date(profile.createdAt).getFullYear()}</strong><span>На сайте</span></div></div>
            </div>
            <div className={styles.btnGroup}>
                <button className={styles.btnSecondary} style={{width:'100%', justifyContent:'center', display:'flex', gap:8}}><MessageCircle size={18} /> Написать</button>
            </div>
          </div>
        </header>

        <div className={styles.mainGrid}>
          
          {/* --- Sidebar --- */}
          <aside className={styles.sidebar}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Статус доверия</h3>
              <ul className={styles.checkList}>
                {profile.isVerified ? (
                    <li className={styles.checkItem}><CheckCircle2 size={16} color="#10b981" /> Телефон подтвержден</li>
                ) : (
                    <li className={styles.checkItem} style={{color:'#94a3b8'}}><div style={{width:16, height:16, border:'1px solid #cbd5e1', borderRadius:'50%'}}/> Телефон не подтвержден</li>
                )}
                <li className={styles.checkItem}><CheckCircle2 size={16} color="#10b981" /> Email подтвержден</li>
              </ul>
              <div className={styles.safetyNote} style={{marginTop:16}}><ShieldCheck size={14} />Безопасный заказчик</div>
            </div>
          </aside>

          {/* --- Main Content --- */}
          <main className={styles.contentArea}>
            
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`} onClick={() => setActiveTab('orders')}>Активные заказы ({activeOrders.length})</button>
              <button className={`${styles.tab} ${activeTab === 'reviews' ? styles.activeTab : ''}`} onClick={() => setActiveTab('reviews')}>Отзывы мастеров ({profile.reviewsCount})</button>
            </div>

            <div className={styles.tabContent}>
              
              {/* TAB: ORDERS (GRID CARD LAYOUT) */}
              {activeTab === 'orders' && (
                <div className={styles.list}>
                  {activeOrders.length === 0 ? (
                      <p style={{padding:20, color:'#94a3b8'}}>Нет активных заказов.</p>
                  ) : (
                      activeOrders.map(it => (
                        <article key={it.id} className={styles.card} onClick={() => window.location.href=`/orders/${it.id}`}>
                          
                          {/* 1. Media Column */}
                          <div className={styles.cardMedia}>
                            <div className={styles.mainThumb}>
                              <img src={it.imageFileRefs?.[0] || '/images/placeholder.jpg'} alt={it.title} />
                              <OrderStatusBadge status={it.status} />
                            </div>
                          </div>

                          {/* 2. Body Column */}
                          <div className={styles.cardBody}>
                            <div className={styles.cardHeadRow}>
                              <h3 className={styles.cardTitle} title={it.title}>{it.title}</h3>
                              <div className={styles.cardMeta}>
                                {it.location || 'N/A'} · {it.deadlineDate ? new Date(it.deadlineDate).toLocaleDateString() : 'Не срочно'}
                              </div>
                            </div>

                            {/* Optional: Thumb Strip if multiple images */}
                            {it.imageFileRefs && it.imageFileRefs.length > 1 && (
                              <div className={styles.thumbStrip}>
                                {it.imageFileRefs.slice(1).map((src, i) => (
                                  <div className={styles.thumbItem} key={i}>
                                    <img src={src} alt="thumb" />
                                  </div>
                                ))}
                              </div>
                            )}

                            <p className={styles.cardDesc}>{it.description}</p>

                            <div className={styles.metaRow}>
                              <div className={styles.tags}>
                                <span className={styles.chip}>Категория {it.category}</span>
                              </div>
                              <div className={styles.locationWrap}>
                                <OrderLocation location={it.location} />
                              </div>
                            </div>
                          </div>

                          {/* 3. Actions Column */}
                          <div className={styles.cardActions}>
                            <button className={styles.ghost}>Чат</button>
                            <button className={styles.primary}>Откликнуться</button>
                            <button className={styles.secondary}>Детали</button>
                          </div>

                        </article>
                      ))
                  )}
                </div>
              )}

              {/* TAB: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className={styles.reviewsList}>
                  {reviews.length === 0 ? <p style={{padding:20, color:'#94a3b8'}}>Отзывов пока нет.</p> : (
                      reviews.map((review) => (
                        <div key={review.id} className={styles.reviewCard}>
                          <div className={styles.reviewHeader}>
                            <div style={{display:'flex', gap:12, alignItems:'center'}}>
                                <div style={{width:40, height:40, background:'#f1f5f9', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                    <UserIcon size={20} color="#94a3b8"/> 
                                </div>
                                <div className={styles.reviewerInfo}>
                                    <div className={styles.reviewerName}>{review.proName}</div>
                                    <div className={styles.reviewMeta}>
                                        <div className={styles.stars}>{[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "#FFD700" : "none"} stroke={i < review.rating ? "#FFD700" : "#cbd5e1"} />)}</div>
                                        <span className={styles.reviewDate}>{review.date}</span>
                                    </div>
                                </div>
                            </div>
                          </div>
                          <p className={styles.reviewText}>{review.text}</p>
                        </div>
                      ))
                  )}
                </div>
              )}

            </div>
          </main>
        </div>

      </div>
    </div>
  );
}