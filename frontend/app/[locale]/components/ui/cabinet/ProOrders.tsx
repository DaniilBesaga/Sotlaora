'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ProOrders.module.css';
import OrderLocation from './OrderLocation';

export default function ProOrders(){
  // sample data
  const profile = {
    name: 'Иван Петров',
    id: '№3831851',
    city: 'Брашов',
    email: 'ivan@example.com',
    phone: '+40 712 345 678',
    avatar: '/images/pros/1.jpg',
    rating: 4.9,
  };

  // quick nav (правый столбец)
  const quick = [
    { key: 'orders', label: 'Заказы', icon: '🧾', count: 4, href: '#orders' },
    { key: 'subscriptions', label: 'Подписки', icon: '🔔', count: 2, href: '#subscriptions' },
    { key: 'messages', label: 'Сообщения', icon: '💬', count: 3, href: '#messages' },
    { key: 'earnings', label: 'Заработок', icon: '💵', count: null, href: '#earnings' },
    { key: 'settings', label: 'Настройки', icon: '⚙️', count: null, href: '#settings' },
  ];

  // tabs & data
  const [activeTab, setActiveTab] = useState('inwork'); // inwork | proposals | search | all | boost
  const orders = sampleOrders;
  const proposals = sampleProposals;
  const newOrders = sampleNewOrders;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* HEADER (профиль вверху, занимает 2 колонки) */}
        <header className={styles.header}>
          <div className={styles.avatarBox}>
            <img src={profile.avatar} alt="avatar" className={styles.avatar} />
          </div>

          <div className={styles.headerInfo}>
            <div className={styles.nameRow}>
              <h2 className={styles.name}>{profile.name}</h2>
              <button className={styles.edit} aria-label="Редактировать профиль">✎</button>
            </div>

            <div className={styles.small}>Профиль {profile.id}</div>

            <div className={styles.metaRow}>
              <div className={styles.meta}>📍 {profile.city}</div>
              <div className={styles.meta}>⭐ {profile.rating}</div>
            </div>
          </div>
        </header>

        {/* MAIN: tabs + main content */}
        <main className={styles.main}>
          {/* Topbar (заголовок) */}
          <div className={styles.topbarRow}>
            <h1 className={styles.h1}>Замовлення</h1>
            <div className={styles.topActions}>
              <button className={styles.primary}>Создать заказ</button>
            </div>
          </div>

          {/* HORIZONTAL TABS (под topbar) */}
          <nav className={styles.tabs} role="tablist" aria-label="Навигация заказов">
            <button
              role="tab"
              className={`${styles.tab} ${activeTab==='inwork'?styles.active:''}`}
              onClick={() => setActiveTab('inwork')}
            >
              В роботі
            </button>
            <button
              role="tab"
              className={`${styles.tab} ${activeTab==='proposals'?styles.active:''}`}
              onClick={() => setActiveTab('proposals')}
            >
              Пропозиції
            </button>
            <button
              role="tab"
              className={`${styles.tab} ${activeTab==='search'?styles.active:''}`}
              onClick={() => setActiveTab('search')}
            >
              Пошук замовлень
            </button>
            <button
              role="tab"
              className={`${styles.tab} ${activeTab==='all'?styles.active:''}`}
              onClick={() => setActiveTab('all')}
            >
              Всі замовлення
            </button>
          </nav>

          {/* Content area */}
          <section className={styles.contentCard}>
            {activeTab === 'inwork' && (
              <OrdersGrid items={orders.filter(o => o.status === 'active')} emptyText="В роботі немає замовлень" />
            )}

            {activeTab === 'proposals' && (
              <OrdersGrid items={proposals} emptyText="У вас ще немає пропозицій" />
            )}

            {activeTab === 'search' && (
              <OrdersGrid items={newOrders} emptyText="Нових замовлень не знайдено" />
            )}

            {activeTab === 'all' && (
              <OrdersGrid items={orders} emptyText="Немає замовлень" />
            )}

          </section>
        </main>

        {/* RIGHT: quick navigation */}
        <aside className={styles.quickNav} aria-label="Быстрая навигация">
          <div className={styles.quickCard}>
            {quick.map(item => (
              <Link key={item.key} href={item.href} className={styles.qItem}>
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

/* ---------- helper components ---------- */

function OrdersGrid({ items, emptyText }){
  if(!items || items.length === 0){
    return <div className={styles.empty}>{emptyText}</div>;
  }

  return (
    <div className={styles.grid}>
      {items.map(it => (
        <motion.article key={it.id} className={styles.card} whileHover={{ y: -6 }}>
          <div className={styles.cardHead}>
            <div className={styles.cardTitle}>{it.title}</div>
            <div className={styles.cardMeta}>{it.city} · {it.urgency}</div>
          </div>

          <p className={styles.cardDesc}>{it.desc}</p>

          <div className={styles.cardFooter}>
            <div className={styles.tags}>
              {it.tags.map(t => <span className={styles.chip} key={t}>{t}</span>)}
            </div>
<OrderLocation type="online" />
            <div className={styles.cardActions}>
              <button className={styles.ghost}>Чат</button>
              <button className={styles.primary}>Откликнуться</button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

/* ---------- sample data ---------- */
const sampleOrders = [
  { id: 'o1', title: 'Протекает кран — требуется замена', desc: 'Необходимо заменить смеситель в ванной. Уточнить возможный подъезд.', price: 350, urgency: 'Сегодня', status: 'active', city: 'Брашов', tags: ['Сантехника','Выезд'] },
  { id: 'o2', title: 'Установка люстры на 3 точки', desc: 'Монтаж люстры, проверка скрытой проводки.', price: 250, urgency: '2 дня', status: 'active', city: 'Брашов', tags: ['Электрика'] },
  { id: 'o3', title: 'Сборка мебели IKEA — 2 шкафа', desc: 'Сборка двух шкафов PAX, двери и фурнитура в комплекте.', price: 180, urgency: 'Не срочно', status: 'done', city: 'Брашов', tags: ['Сборка'] },
];

const sampleProposals = [
  { id: 'p1', title: 'Проблема с дверным замком', desc: 'Клиент пропонує 120 RON за замену', price: 120, urgency: 'Сегодня', city: 'Брашов', tags: ['Замки'] },
];

const sampleNewOrders = [
  { id: 'n1', title: 'Поклеїти шпалери', desc: 'Квартира 40м² — потрібен майстер', price: 400, urgency: 'Цього тижня', city: 'Брашов', tags: ['Ремонт'] },
];
