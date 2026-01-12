'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, Calendar, Clock, ChevronLeft, Share2, Flag, 
  CheckCircle2, ShieldCheck, AlertCircle, Tag, User as UserIcon, 
  Circle, Star, MessageSquare, Send, Check, Briefcase, DollarSign,
  Lock
} from 'lucide-react';
import styles from './OrderPage.module.css';
import { useParams } from 'next/navigation';
import { LoginContext } from '../../components/context/LoginContext';
import { OrderStatus } from '@/types/Order';

// --- Interfaces & Enums (Same as before) ---
export enum Location { AtClients = "AtClients", AtPros = "AtPros", Online = "Online" }

export interface SubcategoryDTO { id: number; title: string; slug: string; }
export interface OrderDTO { id: number; title: string; }
export interface ClientDTO {
  id: number;
  email: string;
  userName: string;
  role: string;
  createdAt: Date | string;
  location?: string | null;
  isOnline: boolean;
  imageRef?: string | null;
  phoneNumber?: string | null;
  orders: OrderDTO[];
}

export interface OrderFullDTO {
  id: number;
  title: string;
  description: string;
  postedAt: Date | string;
  price: number;
  location: Location;
  address: string;
  distance: number;
  additionalComment: string;
  deadlineDate?: Date | string | null;
  desiredTimeStart?: string | null;
  desiredTimeEnd?: string | null;
  subcategoriesDTO: SubcategoryDTO[];
  imageFileRefs: string[];
  client: ClientDTO;
  status: OrderStatus;
}

export interface ProposalDTO {
  id: number;
  proId: number;
  proName: string;
  proAvatar: string;
  rating: number;
  reviewsCount: number;
  message: string;
  price: number;
  submittedAt: Date | string;
}

// --- Mock Data ---
const MOCK_ORDER: OrderFullDTO = {
  id: 1024,
  title: "Ремонт кухонного смесителя и проверка труб",
  description: "Мне нужен профессиональный сантехник, чтобы заменить старый протекающий кухонный смеситель. Трубы снизу также имеют следы коррозии...",
  postedAt: "2023-10-25T09:30:00",
  price: 0.00,
  location: Location.AtClients,
  address: "Брашов, район Тракторул",
  distance: 3.2,
  additionalComment: "Пожалуйста, позвоните перед приездом. Есть бесплатная парковка.",
  deadlineDate: "2023-10-28T00:00:00",
  desiredTimeStart: "10:00",
  desiredTimeEnd: "14:00",
  status: OrderStatus.Active,
  subcategoriesDTO: [
    { id: 1, title: "Сантехника", slug: "plumbing" },
    { id: 2, title: "Установка", slug: "installation" }
  ],
  imageFileRefs: [
    "https://images.unsplash.com/photo-1581578731117-104f2a863afa?q=80&w=1200&auto=format&fit=crop"
  ],
  client: {
    id: 55,
    userName: "Alexandru P.",
    email: "alex@example.com",
    role: "Client",
    createdAt: "2021-05-12T00:00:00",
    location: "Brasov, RO",
    isOnline: true,
    phoneNumber: "+40 700 123 456",
    imageRef: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop",
    orders: []
  }
,
};

const EMPTY_ORDER: OrderFullDTO = {
  id: 0,
  title: "",
  description: "",
  postedAt: new Date(),
  price: 0,
  location: Location.Online,
  address: "",
  distance: 0,
  additionalComment: "",
  deadlineDate: null,
  desiredTimeStart: null,
  desiredTimeEnd: null,
  status: OrderStatus.Active,
  subcategoriesDTO: [],
  imageFileRefs: [],
  client: {
    id: 0,
    userName: "",
    email: "",
    role: "",
    createdAt: new Date(),
    location: null,
    isOnline: false,
    imageRef: null,
    phoneNumber: null,
    orders: []
  }
};

const MOCK_PROPOSALS: ProposalDTO[] = [
  {
    id: 101,
    proId: 201,
    proName: "Иван Мастер",
    proAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 124,
    message: "Здравствуйте! Я специализируюсь именно на сантехнике Grohe. Весь инструмент в наличии.",
    price: 250,
    submittedAt: "2023-10-25T10:15:00"
  },
  {
    id: 102,
    proId: 202,
    proName: "Сергей Профи",
    proAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 89,
    message: "Добрый день. Готов выполнить ваш заказ. Но работа сложная, цена будет чуть выше.",
    price: 350,
    submittedAt: "2023-10-25T11:30:00"
  }
];

interface BidInfoDTO {
  bidAmount: number;
  message: string;
}

export interface ReviewDTO {
  id: number;
  rating: number;
  text: string;
  createdAt: string;
  clientName: string;
  clientAvatar?: string;
}

export interface ReviewRequest{
  text: string;
  rating: number;
  orderId: number;
}

// --- Helpers ---
const formatCurrency = (amount: number) => new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(amount);
const formatDate = (dateInput: Date | string | null | undefined) => dateInput ? new Date(dateInput).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : "Flexible";
const getStatusBadge = (status: OrderStatus) => <span className={`${styles.statusBadge} ${styles[status]}`}>{status}</span>;

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {userLong, authorizedFetch} = use(LoginContext)

  const [orderData, setOrderData] = useState<OrderFullDTO | null>(null);
  const [bidsData, setBidsData] = useState<ProposalDTO[] | null>(null);
  const [clientReview, setClientReview] = useState<ReviewDTO | null>(null);
  useEffect(() => {
     const fetchOrderData = async () => {
       try {
         const response = await fetch(`http://localhost:5221/api/order/${id}`);
          if (response.ok) {
            const data: OrderFullDTO = await response.json();
            console.log("Полученные данные заказа:", data);
            setOrderData(data);
            setActiveImage(data.imageFileRefs[0] || '');
            setCustomPrice(data.price);
            setIsCompleted(data.status === OrderStatus.Completed);
          } else {
            console.error("Ошибка при получении данных заказа");
          }
        } catch (error) {
          console.error("Ошибка при выполнении запроса:", error);
        }
      };
      const fetchBidsData = async () => {
        try {
         const response = await fetch(`http://localhost:5221/api/order/${id}/getOrderBids`);
          if (response.ok) {
            const data: ProposalDTO[] = await response.json();
            console.log("Полученные данные ставок:", data);
            setBidsData(data);
          } else {
            console.error("Ошибка при получении данных заказа");
          }
        } catch (error) {
          console.error("Ошибка при выполнении запроса:", error);
        }
      }
      const fetchReviewData = async () => {
        try {
         const response = await fetch(`http://localhost:5221/api/review/${id}/order-review`);
          if (response.ok) {
            const data: ReviewDTO = await response.json();
            console.log("Полученные данные отзыва:", data);
            setClientReview(data);
          } else {
            console.error("Ошибка при получении данных заказа");
          }
        } catch (error) {
          console.error("Ошибка при выполнении запроса:", error);
        }
      }
      fetchOrderData();
      fetchBidsData();
      fetchReviewData();
  }, []);

  useEffect(() => {
    if(userLong?.id !== -1)
      setUserRole(userLong?.role === "Pro" ? 'pro' : 'client')
    else
      setUserRole('guest')
  }, [userLong, orderData]);
  
  const [userRole, setUserRole] = useState<'client' | 'pro' | 'guest'>('guest');
  console.log("Текущая роль пользователя:", userRole);
  
  // Form State
  const [proposalMessage, setProposalMessage] = useState("");
  const [customPrice, setCustomPrice] = useState<number | string>(0); // Initialize with order budget
  const [hasApplied, setHasApplied] = useState(false);
  
  const [activeImage, setActiveImage] = useState(orderData?.imageFileRefs[0] || '');

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalMessage.trim()) return;

    const newProposal: ProposalDTO = {
      id: Date.now(),
      proId: 999,
      proName: "Вы (Мастер)",
      proAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      rating: 5.0,
      reviewsCount: 15,
      message: proposalMessage,
      price: Number(customPrice), // Use the custom price
      submittedAt: new Date().toISOString()
    };

    setBidsData([newProposal, ...bidsData || []]);
    setProposalMessage("");
    setHasApplied(true);
  };

  const sendBid = async (price: number | string) => {
    if (isNaN(Number(price)) || price === '') {
      alert('Пожалуйста, введите корректную цену');
      return;
    }

    const bidInfo = {
      bidAmount: Number(price),
      message: proposalMessage
    } as BidInfoDTO;

    try {
      const response = await authorizedFetch(`http://localhost:5221/api/order/${id}/addProBid/${userLong?.id}`, {
        method: 'POST',
        body: JSON.stringify(bidInfo)
      });
      if (response.ok) {
        console.log("Предложение успешно отправлено");
      } else {
        console.error("Ошибка при отправке предложения");
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  }

  const choosePro = async (proId: number) => {
    const addToPro = { proId: proId, orderId: Number(id) };
    try {
      const response = await authorizedFetch(`http://localhost:5221/api/pro/add-order-to-pro`, {
        method: 'POST',
        body: JSON.stringify({ model: addToPro }),
      });
      if (response.ok) {
        console.log("Исполнитель успешно выбран");
        setOrderData({ ...orderData!, status: OrderStatus.Assigned });
      } else {
        console.error("Ошибка при выборе исполнителя");
      }
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    }
  }

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);



  const handleSubmitReview = async () => {
      if(reviewRating === 0) return alert("Пожалуйста, поставьте оценку");
      setIsSubmittingReview(true);
      
      try{
        const reviewRequest: ReviewRequest = {
          text: reviewText,
          rating: reviewRating,
          orderId: Number(id)
        };
        const response = await authorizedFetch(`http://localhost:5221/api/review/create-review`, {
          method: 'POST',
          body: JSON.stringify(reviewRequest)
        });
        if (response.ok) {
          console.log("Отзыв успешно отправлен");
        } else {
          console.error("Ошибка при отправке отзыва");
        }
      }
      catch(error){
        console.error("Ошибка при выполнении запроса:", error);
      }
      setTimeout(() => {
          setClientReview({
              id: Date.now(),
              rating: reviewRating,
              text: reviewText,
              createdAt: new Date().toISOString(),
              clientName: orderData?.client.userName || "Client",
              clientAvatar: orderData?.client.imageRef || undefined
          });
          setIsSubmittingReview(false);
      }, 1000);
    }

  if (!orderData) {
    return <div>Загрузка заказа...</div>;
  }

  return (
    <div className={styles.page}>
      
      {/* Role Switcher Demo */}
      <div style={{ background: '#333', color: '#fff', padding: '10px', textAlign: 'center', fontSize: '14px' }}>
        <span>Режим просмотра: </span>
        <button onClick={() => setUserRole('client')} style={{ fontWeight: userRole === 'client' ? 'bold' : 'normal', margin: '0 10px', background: 'none', border: 'none', color: userRole === 'client' ? '#4ade80' : '#fff', cursor: 'pointer' }}>Я Клиент</button> | 
        <button onClick={() => setUserRole('pro')} style={{ fontWeight: userRole === 'pro' ? 'bold' : 'normal', margin: '0 10px', background: 'none', border: 'none', color: userRole === 'pro' ? '#4ade80' : '#fff', cursor: 'pointer' }}>Я Мастер</button>
      </div>

      <div className={styles.topNav}>
        <div className={styles.navContent}>
          <Link href="/orders" className={styles.backLink}><ChevronLeft size={20} /><span>Назад к заказам</span></Link>
          <div className={styles.navActions}>
            <button className={styles.iconBtn}><Share2 size={20} /></button>
            <button className={`${styles.iconBtn} ${styles.flagBtn}`}><Flag size={20} /></button>
          </div>
        </div>
      </div>

      <main className={styles.mainContainer}>
        <div className={styles.gridLayout}>
          
          {/* --- LEFT COLUMN --- */}
          <div className={styles.leftColumn}>
            
            {/* Gallery */}
            <div className={styles.galleryCard}>
              <div className={styles.mainImageWrapper}>
                <img src={activeImage} alt="Order" className={styles.imageCover} />
              </div>
              {orderData.imageFileRefs.length > 1 && (
                <div className={styles.thumbsRow}>
                  {orderData.imageFileRefs.map((img, idx) => (
                    <button key={idx} onClick={() => setActiveImage(img)} className={`${styles.thumbBtn} ${activeImage === img ? styles.thumbActive : ''}`}>
                      <img src={img} alt={`Thumb ${idx}`} className={styles.imageCover} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className={styles.contentCard}>
              <div className={styles.desktopHeader}>
                <div className={styles.tagsRow}>
                   {getStatusBadge(orderData.status)}
                   {orderData.subcategoriesDTO.map(cat => (
                     <span key={cat.id} className={styles.categoryTag}><Tag size={12} style={{marginRight: 4}}/>{cat.title}</span>
                   ))}
                </div>
                <h1 className={styles.mainTitle}>{orderData.title}</h1>
                <p className={styles.subTitle}>Опубликовано {formatDate(orderData.postedAt)} • ID: #{orderData.id}</p>
              </div>

              <div className={styles.descriptionSection}>
                <h3 className={styles.sectionTitle}>Описание</h3>
                <p className={styles.descText}>{orderData.description}</p>
                {orderData.additionalComment && (
                  <div className={styles.alertBox}>
                    <AlertCircle size={20} className={styles.alertIcon} />
                    <div><span className={styles.bold}>Важно:</span> {orderData.additionalComment}</div>
                  </div>
                )}
              </div>

              <hr className={styles.divider} />

              <h3 className={styles.sectionTitle}>Детали</h3>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <div className={styles.detailIconBox}><Calendar size={20} /></div>
                  <div><p className={styles.detailLabel}>Срок</p><p className={styles.detailValue}>{formatDate(orderData.deadlineDate)}</p></div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailIconBox}><Clock size={20} /></div>
                  <div><p className={styles.detailLabel}>Время</p><p className={styles.detailValue}>{orderData.desiredTimeStart ? `${orderData.desiredTimeStart} - ${orderData.desiredTimeEnd}` : "Любое"}</p></div>
                </div>
                <div className={styles.detailItem}>
                  <div className={styles.detailIconBox}><MapPin size={20} /></div>
                  <div><p className={styles.detailLabel}>Место</p><p className={styles.detailValue}>{orderData.address}</p></div>
                </div>
              </div>
            </div>

            {isCompleted ? (
                <div className={styles.proposalsSection}>
                    <h3 className={styles.sectionTitle}>Отзыв заказчика</h3>
                    
                    {/* A) Show Existing Review */}
                    {clientReview ? (
                        <div className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.proInfo}>
                                    <img src={clientReview.clientAvatar || '/default-user.png'} className={styles.proAvatar} />
                                    <div>
                                        <h4 className={styles.proName}>{clientReview.clientName}</h4>
                                        <span className={styles.proTime}>{new Date(clientReview.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className={styles.ratingBox}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} fill={i < clientReview.rating ? "#fbbf24" : "#e5e7eb"} strokeWidth={0} />
                                    ))}
                                </div>
                            </div>
                            <p className={styles.reviewText}>{clientReview.text}</p>
                            <div className={styles.reviewFooter}>
                                <div className={styles.verifiedReview}><CheckCircle2 size={16} /> Заказ выполнен и подтвержден</div>
                            </div>
                        </div>
                    ) : (
                        /* B) Show Add Review Form (Only for Client) */
                        userRole === 'client' ? (
                            <div className={styles.interactionCard}>
                                <h3 className={styles.formTitle} style={{marginBottom: 16}}>Оцените работу мастера</h3>
                                <div className={styles.starRatingInput}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setReviewRating(star)} className={styles.starBtn}>
                                            <Star size={32} fill={star <= reviewRating ? "#fbbf24" : "none"} stroke={star <= reviewRating ? "#fbbf24" : "#cbd5e1"} />
                                        </button>
                                    ))}
                                </div>
                                <textarea 
                                    className={styles.proposalInputBig} 
                                    placeholder="Напишите пару слов о работе мастера..." 
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                                <button 
                                    onClick={handleSubmitReview} 
                                    className={styles.bigSubmitBtn} 
                                    disabled={isSubmittingReview || reviewRating === 0}
                                    style={{marginTop: 16}}
                                >
                                    {isSubmittingReview ? "Отправка..." : "Оставить отзыв"}
                                </button>
                            </div>
                        ) : (
                            /* C) No review yet (Guest View) */
                            <div className={styles.emptyStateBox}>
                                <p>Заказчик еще не оставил отзыв.</p>
                            </div>
                        )
                    )}
                </div>
            ) : (
                /* 2. ACTIVE ORDER VIEW (PROPOSALS LIST) */
                (userRole === 'client' || userRole === 'guest') && (
                    <div className={styles.proposalsSection}>
                        <h3 className={styles.sectionTitle}>
                        Отклики мастеров <span className={styles.countBadge}>{bidsData?.length || 0}</span>
                        </h3>
                        <div className={styles.proposalsList}>
                        {bidsData?.map((proposal) => (
                            <div key={proposal.id} className={styles.proposalCard}>
                                {/* ... Proposal Card Content (Same as previous) ... */}
                                <div className={styles.proposalHeader}>
                                    <div className={styles.proInfo}>
                                        <img src={proposal.proAvatar} alt={proposal.proName} className={styles.proAvatar} />
                                        <div>
                                            <div className={styles.proNameRow}>
                                                <h4 className={styles.proName}>{proposal.proName}</h4>
                                                <div className={styles.ratingBox}><Star size={14} fill="#FFD700" stroke="#FFD700" /><span>{proposal.rating}</span></div>
                                            </div>
                                            <span className={styles.proTime}>{new Date(proposal.submittedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                        </div>
                                    </div>
                                    <div className={`${styles.proposalPrice} ${proposal.price > orderData.price ? styles.priceHigher : ''}`}>{formatCurrency(proposal.price)}</div>
                                </div>
                                <div className={styles.proposalMessage}>
                                    <div className={styles.quoteIcon}><MessageSquare size={16} /></div>
                                    <p>{proposal.message}</p>
                                </div>
                                <div className={styles.proposalActions}>
                                    {userRole === 'guest' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.6, fontSize: '13px', color: '#64748b' }}>
                                            <Lock size={14} /><span>Войдите, чтобы нанять</span>
                                        </div>
                                    ) : (
                                        <>
                                            <button className={styles.chatBtn}>Написать</button>
                                            <button className={styles.chooseBtn} onClick={() => choosePro(proposal.proId)} disabled={orderData.status === OrderStatus.Assigned}>
                                                <Check size={18} />{orderData.status === OrderStatus.Assigned ? "Выбран" : "Выбрать"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                )
            )}

            {/* --- INTERACTION SECTION --- */}
            
            {/* 1. PRO VIEW: Submit Proposal Form */}
            {userRole === 'pro' && orderData.status === OrderStatus.Active && !hasApplied && (
              <div className={styles.interactionCard}>
                <div className={styles.formHeader}>
                  <Briefcase size={24} className={styles.formIcon} />
                  <h3 className={styles.formTitle}>Откликнуться на заказ</h3>
                </div>
                <p className={styles.formSub}>Опишите свой опыт и предложите свою цену.</p>
                
                <form onSubmit={handleSubmitProposal} className={styles.applyForm}>
                  
                  {/* --- PRICE INPUT ROW --- */}
                  <div className={styles.priceInputRow}>
                    <label className={styles.priceLabel}>Предложите цену:</label>
                    <div className={styles.priceInputWrapper} style={{gap: '5px'}}>
                      <div>RON</div>
                      <input 
                        type="number"
                        className={styles.priceInput}
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        placeholder={orderData.price.toString()}
                      />
                      <span className={styles.currencyBadge}>RON</span>
                    </div>
                    {Number(customPrice) > orderData.price && (
                      <span className={styles.priceChangeAlert}>(Выше бюджета заказчика)</span>
                    )}
                  </div>

                  <textarea 
                    className={styles.proposalInputBig}
                    placeholder="Здравствуйте! Я готов выполнить этот заказ..."
                    rows={5}
                    value={proposalMessage}
                    onChange={(e) => setProposalMessage(e.target.value)}
                  />
                  
                  <div className={styles.formFooter}>
                    <button type="submit" className={styles.bigSubmitBtn} onClick={()=>sendBid(customPrice)}>
                      <Send size={18} style={{ marginRight: 8 }} />
                      Отправить предложение ({Number(customPrice)} RON)
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 1b. PRO VIEW: Already Applied */}
            {userRole === 'pro' && hasApplied && (
              <div className={styles.successCard}>
                <CheckCircle2 size={32} color="#10b981" />
                <div>
                  <h3 className={styles.successTitle}>Вы откликнулись!</h3>
                  <p className={styles.successText}>Клиент увидит ваше предложение: <b>{formatCurrency(Number(customPrice))}</b></p>
                </div>
              </div>
            )}

          </div>
          {/* --- RIGHT COLUMN: Sidebar --- */}
          <div className={styles.rightColumn}>
            <div className={styles.stickyWrapper}>
              
              <div className={styles.priceCard}>
                <div className={styles.priceHeader}>
                  <p className={styles.budgetLabel}>Бюджет заказа</p>
                  <span className={styles.priceValue}>{formatCurrency(orderData.price)}</span>
                </div>
                
                {/* GUEST SPECIFIC CTA */}
                {userRole === 'guest' && (
                  <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <p style={{ fontSize: '14px', color: '#475569', marginBottom: 12 }}>
                      Хотите выполнить этот заказ или найти мастера?
                    </p>
                    <Link href="/login" style={{ 
                      display: 'block', width: '100%', padding: '12px', 
                      background: '#0abab5', color: 'white', borderRadius: '10px', 
                      textDecoration: 'none', fontWeight: 600, textAlign: 'center' 
                    }}>
                      Войти / Регистрация
                    </Link>
                  </div>
                )}

                <div className={styles.secureBadge}><ShieldCheck size={16} /><span>Безопасная сделка</span></div>
              </div>
              
              <div className={styles.clientCard}>
                <h3 className={styles.sidebarTitle}>Заказчик</h3>
                <div className={styles.clientProfile}>
                  <div className={styles.avatarWrapper}>
                    <img src={orderData.client.imageRef || ''} className={styles.imageCover} />
                    {orderData.client.isOnline && <span className={styles.onlineBadge}></span>}
                  </div>
                  <div><p className={styles.clientName}>{orderData.client.userName}</p><p className={styles.clientRole}>Клиент</p></div>
                </div>
                {/* Actions hidden for Guest in Sidebar generally, or kept visible but redirecting to Login logic would happen elsewhere */}
                {userRole !== 'guest' && (
                   <a href={`/clientpublicprofile/${orderData.client.id}`} className={styles.contactBtn}>Профиль заказчика</a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}