'use client'

import React from 'react';
import { motion } from 'motion/react';
import CountUp from 'react-countup';
import styles from './TrustSection.module.css';

export default function TrustSection(){
  const trustItems = [
    { key: 'verified', title: 'Проверено', hint: 'ID и документы' },
    { key: 'payment', title: 'Платёжная защита', hint: 'Безопасные транзакции' },
    { key: 'guarantee', title: 'Гарантия возврата', hint: 'Возврат если некачественно' },
    { key: 'support', title: 'Служба поддержки 24/7', hint: 'Помощь в любое время' },
  ];

  // numeric values for CountUp, plus a tiny config for formatting
  const stats = [
    { key: 'orders', value: 20000, label: 'заказов', format: 'compact', duration: 1.6 },
    { key: 'rating', value: 4.8, label: 'средний рейтинг', decimals: 1, duration: 1.2 },
    { key: 'cities', value: 120, label: 'мастеров', duration: 1.1 },
  ];

  const fmt = (n, cfg) => {
    if(cfg?.format === 'compact'){
      if(n >= 1000000) return `${Math.round(n/100000)/10}M`;
      if(n >= 1000) return `${Math.round(n/1000)}k`;
    }
    // rating with decimals handled by CountUp decimals prop
    return n.toLocaleString();
  }

  return (
    <section className={styles.trust} aria-label="Доверие и статистика">
      <h3 className={styles.head}>Почему нам можно верить?</h3>
      <div className={styles.inner}>
        <div className={styles.trustRow}>

          {/* TRUST ICONS */}
          <div className={styles.iconsRow} role="list" aria-hidden>
            {trustItems.map((t, i) => (
              <motion.div
                key={t.key}
                className={styles.trustItem}
                whileHover={{ y: -6, boxShadow: '0 10px 30px rgba(12,18,30,0.08)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <div className={styles.iconWrap} aria-hidden>
                  {renderTrustIcon(t.key)}
                </div>
                <div className={styles.txt}>
                  <div className={styles.tTitle}>{t.title}</div>
                  <div className={styles.tHint}>{t.hint}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* STATS */}
          <div className={styles.statsRow} aria-hidden>
            {stats.map((s, idx) => (
              <motion.div
                key={s.key}
                className={styles.stat}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 * idx, duration: 0.6 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className={styles.num}>
                  <CountUp
                    end={s.value}
                    duration={s.duration}
                    decimals={s.decimals ?? 0}
                    enableScrollSpy={true}
                    scrollSpyOnce={true}
                    formattingFn={(n) => fmt(n, s)}
                  />
                </div>
                <div className={styles.lbl}>{s.label}</div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// Inline SVG icons for trust items
function renderTrustIcon(key){
  switch(key){
    case 'verified':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12 2l2.1 1.6L18 4.4l1.1 2.4L22 9l-1 2.6L20 14l-2.9 1.8L12 18l-2.9 1.8L6 14l-1-2.4L2 9l2-2.2L5.9 4.4 9.9 3.6 12 2z" stroke="#6EB0FF" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M10 12l2 2 4-4" stroke="#6EB0FF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'payment':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="#C58CFF" strokeWidth="1.2"/>
          <path d="M2 10h20" stroke="#C58CFF" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      );
    case 'guarantee':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12 2v6l3 1-3 1v6" stroke="#FFB27A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="9" stroke="#FFB27A" strokeWidth="1" />
        </svg>
      );
    case 'support':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M3 8v6a9 9 0 0 0 18 0V8" stroke="#6EB0FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 3v5" stroke="#6EB0FF" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      );
    default:
      return null;
  }
}