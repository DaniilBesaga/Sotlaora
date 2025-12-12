'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  Share2, 
  Flag, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle,
  Tag,
  User as UserIcon,
  Circle
} from 'lucide-react';
import styles from './OrderPage.module.css';

// --- 1. Interfaces (Strictly from your provided DTO) ---

export enum Location {
  AtClients = "AtClients",
  AtPros = "AtPros",
  Online = "Online",
}

export interface SubcategoryDTO {
  id: number;
  title: string;
  slug: string;
}

export interface OrderDTO {
  // Minimal order structure referenced in ClientDTO (placeholder)
  id: number;
  title: string;
}

export interface ClientDTO {
  id: number;
  email: string;
  userName: string;
  role: string;
  createdAt: Date | string;
  location?: string | null;
  isOnline: boolean;
  lastSeen?: Date | string | null;
  imageRef?: string | null;
  phoneNumber?: string | null;
  orders: OrderDTO[];
}

export enum OrderStatus {
  Active = "Active",
  Taken = "Taken",
  Completed = "Completed",
  Cancelled = "Cancelled",
  WaitingForPayment = "WaitingForPayment",
  UnderReview = "UnderReview",
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

// --- 2. Mock Data ---

const MOCK_ORDER: OrderFullDTO = {
  id: 1024,
  title: "Ремонт кухонного смесителя и проверка труб",
  description: "Мне нужен профессиональный сантехник, чтобы заменить старый протекающий кухонный смеситель. Трубы снизу также имеют следы коррозии, поэтому их нужно проверить и, возможно, загерметизировать. Новый смеситель (модель Grohe) я уже купил. Пожалуйста, возьмите свои инструменты.",
  postedAt: "2023-10-25T09:30:00",
  price: 250.00,
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
    { id: 2, title: "Установка", slug: "installation" },
    { id: 3, title: "Ремонт", slug: "repairs" }
  ],
  imageFileRefs: [
    "https://images.unsplash.com/photo-1581578731117-104f2a863afa?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=1200&auto=format&fit=crop"
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
    orders: [] // Empty for this view
  }
};

// --- 3. Helpers ---

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(amount);
};

const formatDate = (dateInput: Date | string | null | undefined) => {
  if (!dateInput) return "Flexible";
  return new Date(dateInput).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getLocationLabel = (loc: Location) => {
  switch (loc) {
    case Location.AtClients: return "У клиента";
    case Location.AtPros: return "У мастера";
    case Location.Online: return "Онлайн";
    default: return loc;
  }
};

const getStatusBadge = (status: OrderStatus) => {
  return <span className={`${styles.statusBadge} ${styles[status]}`}>{status}</span>;
};

// --- 4. Component ---

export default function OrderDetailsPage() {
  const order = MOCK_ORDER;
  // Handle case where images might be empty
  const hasImages = order.imageFileRefs && order.imageFileRefs.length > 0;
  const [activeImage, setActiveImage] = useState(hasImages ? order.imageFileRefs[0] : null);

  return (
    <div className={styles.page}>
      
      {/* Top Navigation */}
      <div className={styles.topNav}>
        <div className={styles.navContent}>
          <Link href="/orders" className={styles.backLink}>
            <ChevronLeft size={20} />
            <span>Назад к заказам</span>
          </Link>
          <div className={styles.navActions}>
            <button className={styles.iconBtn}><Share2 size={20} /></button>
            <button className={`${styles.iconBtn} ${styles.flagBtn}`}><Flag size={20} /></button>
          </div>
        </div>
      </div>

      <main className={styles.mainContainer}>
        <div className={styles.gridLayout}>
          
          {/* --- LEFT COLUMN: Main Order Info --- */}
          <div className={styles.leftColumn}>
            
            {/* Mobile Header (Hidden on Desktop) */}
            <div className={styles.mobileHeader}>
              <div className={styles.mobileMetaRow}>
                {getStatusBadge(order.status)}
                <span className={styles.metaDate}>{formatDate(order.postedAt)}</span>
              </div>
              <h1 className={styles.mobileTitle}>{order.title}</h1>
            </div>

            {/* Image Gallery (Conditional) */}
            {hasImages && activeImage && (
              <div className={styles.galleryCard}>
                <div className={styles.mainImageWrapper}>
                  <img 
                    src={activeImage} 
                    alt="Order detail" 
                    className={styles.imageCover}
                  />
                </div>
                {order.imageFileRefs.length > 1 && (
                  <div className={styles.thumbsRow}>
                    {order.imageFileRefs.map((img, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setActiveImage(img)}
                        className={`${styles.thumbBtn} ${activeImage === img ? styles.thumbActive : ''}`}
                      >
                        <img src={img} alt={`Thumb ${idx}`}  className={styles.imageCover} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Main Content Card */}
            <div className={styles.contentCard}>
              
              {/* Desktop Header */}
              <div className={styles.desktopHeader}>
                <div className={styles.tagsRow}>
                   {getStatusBadge(order.status)}
                   {order.subcategoriesDTO.map(cat => (
                     <span key={cat.id} className={styles.categoryTag}>
                       <Tag size={12} style={{marginRight: 4}}/>
                       {cat.title}
                     </span>
                   ))}
                </div>
                <h1 className={styles.mainTitle}>{order.title}</h1>
                <p className={styles.subTitle}>Опубликовано {formatDate(order.postedAt)} • ID: #{order.id}</p>
              </div>

              {/* Description */}
              <div className={styles.descriptionSection}>
                <h3 className={styles.sectionTitle}>Описание задачи</h3>
                <p className={styles.descText}>{order.description}</p>
                
                {order.additionalComment && (
                  <div className={styles.alertBox}>
                    <AlertCircle size={20} className={styles.alertIcon} />
                    <div>
                      <span className={styles.bold}>Дополнительный комментарий:</span> {order.additionalComment}
                    </div>
                  </div>
                )}
              </div>

              <hr className={styles.divider} />

              {/* Job Details Grid */}
              <h3 className={styles.sectionTitle}>Детали заказа</h3>
              <div className={styles.detailsGrid}>
                
                <div className={styles.detailItem}>
                  <div className={styles.detailIconBox}><Calendar size={20} /></div>
                  <div>
                    <p className={styles.detailLabel}>Крайний срок</p>
                    <p className={styles.detailValue}>
                      {formatDate(order.deadlineDate)}
                    </p>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <div className={styles.detailIconBox}><Clock size={20} /></div>
                  <div>
                    <p className={styles.detailLabel}>Желаемое время</p>
                    <p className={styles.detailValue}>
                      {order.desiredTimeStart && order.desiredTimeEnd 
                        ? `${order.desiredTimeStart} - ${order.desiredTimeEnd}` 
                        : "В любое время"}
                    </p>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <div className={styles.detailIconBox}><MapPin size={20} /></div>
                  <div>
                    <p className={styles.detailLabel}>Локация ({getLocationLabel(order.location)})</p>
                    <p className={styles.detailValue}>{order.address}</p>
                    <p className={styles.detailSub}>{order.distance} км от вас</p>
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <div className={styles.detailIconBox}><Tag size={20} /></div>
                  <div>
                    <p className={styles.detailLabel}>Подкатегории</p>
                    <div className={styles.miniTags}>
                      {order.subcategoriesDTO.map(s => <span key={s.id}>{s.title}</span>)}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Sticky Sidebar --- */}
          <div className={styles.rightColumn}>
            <div className={styles.stickyWrapper}>
              
              {/* Price Card */}
              <div className={styles.priceCard}>
                <div className={styles.priceHeader}>
                  <p className={styles.budgetLabel}>Бюджет заказа</p>
                  <span className={styles.priceValue}>{formatCurrency(order.price)}</span>
                </div>

                {/* Conditional Actions based on Status */}
                {order.status === OrderStatus.Active && (
                  <button className={styles.proposalBtn}>Откликнуться</button>
                )}
                {order.status === OrderStatus.Taken && (
                  <button className={`${styles.proposalBtn} ${styles.btnSecondary}`} disabled>Заказ уже в работе</button>
                )}
                
                <p className={styles.proposalNote}>
                  Оплата безопасна через платформу
                </p>
              </div>

              {/* Client Card */}
              <div className={styles.clientCard}>
                <h3 className={styles.sidebarTitle}>Информация о клиенте</h3>
                
                <div className={styles.clientProfile}>
                  <div className={styles.avatarWrapper}>
                    {order.client.imageRef ? (
                      <img src={order.client.imageRef} alt={order.client.userName} className={styles.imageCover} />
                    ) : (
                      <div className={styles.avatarPlaceholder}><UserIcon size={24}/></div>
                    )}
                    {/* Online Status Indicator */}
                    {order.client.isOnline && <span className={styles.onlineBadge} title="Online"></span>}
                  </div>
                  
                  <div>
                    <p className={styles.clientName}>{order.client.userName}</p>
                    <p className={styles.clientRole}>{order.client.role}</p>
                    <p className={styles.clientLocation}>{order.client.location || "Локация скрыта"}</p>
                  </div>
                </div>

                <div className={styles.verifications}>
                  {order.client.phoneNumber ? (
                    <div className={styles.verifyItem}>
                      <CheckCircle2 size={16} className={styles.iconGreen} />
                      <span>Телефон подтвержден</span>
                    </div>
                  ) : (
                    <div className={styles.verifyItem}>
                      <Circle size={16} className={styles.iconGray} />
                      <span>Телефон не подтвержден</span>
                    </div>
                  )}

                  {order.client.email && (
                    <div className={styles.verifyItem}>
                      <CheckCircle2 size={16} className={styles.iconGreen} />
                      <span>Email подтвержден</span>
                    </div>
                  )}

                  <div className={styles.verifyItem}>
                    <ShieldCheck size={16} className={styles.iconIndigo} />
                    <span>На сайте с {new Date(order.client.createdAt).getFullYear()}</span>
                  </div>
                </div>

                <button className={styles.contactBtn}>Написать сообщение</button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}