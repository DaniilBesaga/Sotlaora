'use client';
import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ProOrders.module.css';
import OrderLocation from './OrderLocation';
import ProDashboard from './ProDashboard';
import { LoginContext } from '../../context/LoginContext';
import { useRouter } from 'next/navigation';
import OrderStatusBadge from './OrderStatusBadge';
import ChatList from './ChatList';
import EarningsPage from './Earnings';
import NotificationsPage from './NotificationsPage';
import CategorySelector from '../auth/CategorySelector';

export default function ProOrders(){

  const {user, authenticated, getMeLong, userLong, logout, refresh} = use(LoginContext);

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  
  
  // sample data
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
    
    if (authenticated === 'authenticated' && userLong !== undefined) {
        setProfile(prevProfile => ({ ...prevProfile, name: userLong.userName || prevProfile.name, avatar: userLong.imageRef || prevProfile.avatar, id: `#${userLong.id}`,
        city: userLong.location || 'Timisoara', phone: userLong.phoneNumber || prevProfile.phone }));
    }
    console.log(userLong)
  }, [userLong]);

  // quick nav (правый столбец)
  const quick = [
    { key: 'orders', label: 'Заказы', icon: '🧾', count: 4, href: '#orders' },
    { key: 'subscriptions', label: 'Подписки', icon: '🔔', count: 2, href: '#subscriptions' },
    { key: 'messages', label: 'Сообщения', icon: '💬', count: 3, href: '#messages' },
    { key: 'earnings', label: 'Заработок', icon: '💵', count: null, href: '#earnings' },
    { key: 'settings', label: 'Настройки', icon: '⚙️', count: null, href: '#settings' },
  ];

  const [activeSection, setActiveSection] = useState('orders');

  const handleChangeTab = (tab: string) => {
    setActiveSection(tab);
  }

  // tabs & data
  const [activeTab, setActiveTab] = useState('inwork'); // inwork | proposals | search | all | boost
  const orders = sampleOrders;
  const proposals = sampleProposals;
  const newOrders = sampleNewOrders;

  return ( (authenticated === 'loading' && loading) ? <div>Loading...</div> :
    <div className={styles.page}>
      {/* {userLong?.subcategories.length === 0 && <CategorySelector/>} */}
      <div className={styles.container}>
        {/* HEADER (профиль вверху, занимает 2 колонки) */}
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

        {/* MAIN: tabs + main content */}
        {activeSection === 'orders' && (
          <main className={styles.main}>
            {/* Topbar (заголовок) */}
            <div className={styles.topbarRow}>
              <h1 className={styles.h1}>Заказы</h1>
            </div>

            {/* HORIZONTAL TABS (под topbar) */}
            <nav className={styles.tabs} role="tablist" aria-label="Навигация заказов">
              <button
                role="tab"
                className={`${styles.tab} ${activeTab==='inwork'?styles.active:''}`}
                onClick={() => setActiveTab('inwork')}
              >
                В процессе
              </button>
              <button
                role="tab"
                className={`${styles.tab} ${activeTab==='proposals'?styles.active:''}`}
                onClick={() => setActiveTab('proposals')}
              >
                Предложения
              </button>
              <button
                role="tab"
                className={`${styles.tab} ${activeTab==='search'?styles.active:''}`}
                onClick={() => setActiveTab('search')}
              >
                Поиск заказов
              </button>
              <button
                role="tab"
                className={`${styles.tab} ${activeTab==='all'?styles.active:''}`}
                onClick={() => setActiveTab('all')}
              >
                Все заказы
              </button>
            </nav>

            {/* Content area */}
            <section className={userLong?.proSubcategories.length === 0 ? styles.emptyNotice : styles.contentCard}>
            {userLong?.proSubcategories.length === 0 ? (
              <div className={styles.emptyNotice} role="status" aria-live="polite">
                <div className={styles.emptyNoticeRow}>
                  <div className={styles.emptyContent}>
                    <p className={styles.emptyText}>
                      Пока вы не укажете категории и подкатегории, мы не сможем отправлять вам релевантные заказы.
                      Перейдите в <a href="/cabinet/categories-selector" className={styles.infoLink}>настройки категорий</a> и отметьте те услуги, которые вы выполняете.
                    </p>

                  </div>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'inwork' && (
                  <OrdersGrid items={orders.filter(o => o.status === 'active')} emptyText="В работе нет заказов" />
                )}

                {activeTab === 'proposals' && (
                  <OrdersGrid items={proposals} emptyText="У вас еще нет предложений" />
                )}

                {activeTab === 'search' && (
                  <OrdersGrid items={newOrders} emptyText="Новых заказов не найдено" />
                )}

                {activeTab === 'all' && (
                  <OrdersGrid items={orders} emptyText="Нет заказов" />
                )}
              </>
            )}
          </section>

          </main>
        )}

        {activeSection === 'settings' && (
          <ProDashboard />)}

        {activeSection === 'earnings' && (
          <EarningsPage />)}

        {activeSection === 'messages' && (
          <ChatList />)}

        {activeSection === 'subscriptions' && (
          <NotificationsPage />)}
          

        {/* RIGHT: quick navigation */}
        <aside className={styles.quickNav} aria-label="Быстрая навигация">
          <div className={styles.quickCard}>
            {quick.map(item => (
              <Link key={item.key} href={item.href} className={styles.qItem} onClick={()=>handleChangeTab(item.key)}>
                <div className={styles.qLeft} aria-hidden>{item.icon}</div>
                <div className={styles.qCenter}>
                  <div className={styles.qLabel}>{item.label}</div>
                  {item.count != null && <div className={styles.qSub}>{item.count} новых</div>}
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


function OrdersGrid({ items, emptyText }) {
  if (!items || items.length === 0) {
    return <div className={styles.empty}>{emptyText}</div>;
  }

  return (
    <div className={styles.list}>
      {items.map(it => (
  <motion.article key={it.id} className={styles.card} whileHover={{ y: -6 }}>
    {/* LEFT: media / thumbnails (если у тебя была большая колонка — оставляем) */}
    <div className={styles.cardMedia}>
      <div className={styles.mainThumb}>
        <img src={it.images?.[0] ?? '/images/placeholder.jpg'} alt={it.title} />
    <OrderStatusBadge status={it.status} />
      </div>
      {it.images && it.images.length > 1 && (
        <div className={styles.thumbRow}>
          {it.images.slice(0, 3).map((src, i) => (
            <div key={i} className={styles.thumb}>
              <img src={src} alt={`${it.title} ${i+1}`} />
            </div>
          ))}
          {it.images.length > 3 && (
            <div className={styles.moreThumb}>+{it.images.length - 3}</div>
          )}
        </div>
      )}
    </div>

    {/* CENTER: main content */}
    <div className={styles.cardBody}>
      <div className={styles.cardHeadRow}>
        <h3 className={styles.cardTitle} title={it.title}>{it.title}</h3>
        <div className={styles.cardMeta}>{it.city} · {it.urgency}</div>
      </div>

      {/* NEW: горизонтальная полоса мини-картинок между заголовком и описанием */}
      {it.images && it.images.length > 0 && (
        <div className={styles.thumbStrip} role="list" aria-label="Фото заказа">
          {it.images.map((src, i) => (
            <div className={styles.thumbItem} role="listitem" key={i}>
              <img src={src} alt={`${it.title} фото ${i+1}`} />
            </div>
          ))}
        </div>
      )}

      <p className={styles.cardDesc}>{it.desc}</p>

      <div className={styles.metaRow}>
        <div className={styles.tags}>
          {it.tags.map(t => <span key={t} className={styles.chip}>{t}</span>)}
        </div>

        <div className={styles.locationWrap}>
          <OrderLocation type={it.locationType} />
        </div>
      </div>
    </div>

    {/* RIGHT: actions */}
    <div className={styles.cardActions}>
      <button className={styles.ghost}>Чат</button>
      <button className={styles.primary}>Откликнуться</button>
      <button className={styles.secondary}>Детали</button>
    </div>
  </motion.article>
))}

    </div>
  );
}


/* ---------- sample data ---------- */
const sampleOrders = [
  { id: 'o1', images: ['/images/services/air.jpg'], title: 'Протекает кран — требуется замена', desc: 'Необходимо заменить смеситель в ванной. Уточнить возможный подъезд.', price: 350, urgency: 'Сегодня', status: 'active', city: 'Брашов', tags: ['Сантехника','Выезд'] },
  { id: 'o2', images: ['/images/services/air.jpg'], title: 'Установка люстры на 3 точки', desc: 'Монтаж люстры, проверка скрытой проводки.', price: 250, urgency: '2 дня', status: 'active', city: 'Брашов', tags: ['Электрика'] },
  { id: 'o3', images: ['/images/services/air.jpg'], title: 'Сборка мебели IKEA — 2 шкафа', desc: 'Сборка двух шкафов PAX, двери и фурнитура в комплекте.', price: 180, urgency: 'Не срочно', status: 'done', city: 'Брашов', tags: ['Сборка'] },
];

const sampleProposals = [
  { id: 'p1', images: ['/images/services/air.jpg'], title: 'Проблема с дверным замком', desc: 'Клиент пропонує 120 RON за замену', price: 120, urgency: 'Сегодня', city: 'Брашов', tags: ['Замки'] },
];

const sampleNewOrders = [
  { id: 'n1', images: ['/images/services/air.jpg'], title: 'Поклеїти шпалери', desc: 'Квартира 40м² — потрібен майстер', price: 400, urgency: 'Цього тижня', city: 'Брашов', tags: ['Ремонт'] },
];
