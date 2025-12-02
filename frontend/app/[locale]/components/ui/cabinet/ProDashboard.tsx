'use client';
import React from 'react';
import Link from 'next/link';
import styles from './ProDashboard.module.css';

export default function ProDashboard(){
  // sample data
  const profile = {
    name: 'Иван Петров',
    id: '№3831851',
    city: 'Брашов',
    email: 'ivan@example.com',
    phone: '+40 712 345 678',
    avatar: '/images/default-avatar.png',
    rating: 4.9,
  };

  const quick = [
    { key: 'orders', label: 'Заказы', icon: '🧾', count: 4, href: '#orders' },
    { key: 'subscriptions', label: 'Подписки', icon: '🔔', count: 2, href: '#subscriptions' },
    { key: 'messages', label: 'Сообщения', icon: '💬', count: 3, href: '#messages' },
    { key: 'earnings', label: 'Заработок', icon: '💵', count: null, href: '#earnings' },
    { key: 'settings', label: 'Настройки', icon: '⚙️', count: null, href: '#settings' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* LEFT: profile header */}
        <header className={styles.header}>
          <div className={styles.avatarBox}>
            <img src={profile.avatar} alt="avatar" className={styles.avatar} />
          </div>
          <div className={styles.headerInfo}>
            <div className={styles.nameRow}>
              <h2 className={styles.name}>{profile.name}</h2>
              <button className={styles.edit}>✎</button>
            </div>
            <div className={styles.small}>Профиль {profile.id}</div>
            <div className={styles.metaRow}>
              <div className={styles.meta}>📍 {profile.city}</div>
              <div className={styles.meta}>⭐ {profile.rating}</div>
            </div>
          </div>
        </header>

        {/* MAIN: tabs + content */}
        <main className={styles.main}>
          <nav className={styles.tabs} role="tablist">
            <button role="tab" className={`${styles.tab} ${styles.active}`}>Общая информация</button>
            <button role="tab" className={styles.tab}>Портфолио</button>
            <button role="tab" className={styles.tab}>Стоимость работ</button>
            <button role="tab" className={styles.tab}>Сменить пароль</button>
          </nav>

          <section className={styles.contentCard}>
            <h3 className={styles.sectionTitle}>Контакты</h3>
            <div className={styles.infoRow}>📧 {profile.email}</div>
            <div className={styles.infoRow}>📞 {profile.phone}</div>

            <h3 className={styles.sectionTitle}>Категории</h3>
            <div className={styles.chips}>
              <span className={styles.chip}>Сантехник</span>
              <span className={styles.chip}>Электрик</span>
              <span className={styles.chip}>Муж на час</span>
            </div>

            <h3 className={styles.sectionTitle}>Описание</h3>
            <p className={styles.paragraph}>Краткое описание услуг мастера — опыт работы, инструменты, районы работы и т. д.</p>
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

      <style jsx>{``}</style>
    </div>
  );
}
