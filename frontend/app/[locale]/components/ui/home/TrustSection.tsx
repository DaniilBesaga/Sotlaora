'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'motion/react';
import CountUp from 'react-countup';
import styles from './TrustSection.module.css';

export default function TrustSection() {
  const t = useTranslations('TrustSection');

  const trustItems = ['verified', 'payment', 'guarantee', 'support'];

  const stats = [
    { key: 'orders', value: 20000, format: 'compact', duration: 1.6 },
    { key: 'rating', value: 4.8, decimals: 1, duration: 1.2 },
    { key: 'cities', value: 120, duration: 1.1 }
  ];

  // number formatter (compact + standard)
  const fmt = (n, cfg) => {
    if (cfg?.format === 'compact') {
      if (n >= 1_000_000) return `${Math.round(n / 100000) / 10}M`;
      if (n >= 1000) return `${Math.round(n / 1000)}k`;
    }
    return n.toLocaleString();
  };

  return (
    <section className={styles.trust} aria-label={t('title')}>
      <h3 className={styles.head}>{t('title')}</h3>

      <div className={styles.inner}>
        <div className={styles.trustRow}>

          {/* TRUST ICONS */}
          <div className={styles.iconsRow} role="list" aria-hidden>
            {trustItems.map((key, i) => (
              <motion.div
                key={key}
                className={styles.trustItem}
                whileHover={{ y: -6, boxShadow: '0 10px 30px rgba(12,18,30,0.08)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <div className={styles.iconWrap} aria-hidden>
                  {renderTrustIcon(key)}
                </div>

                <div className={styles.txt}>
                  <div className={styles.tTitle}>{t(`trustItems.${key}.title`)}</div>
                  <div className={styles.tHint}>{t(`trustItems.${key}.hint`)}</div>
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
                <div className={styles.lbl}>{t(`stats.${s.key}.label`)}</div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}


/* ------------------------------------------------------------------
   SVG ICONS — unchanged, just kept inside a utility function
------------------------------------------------------------------- */
function renderTrustIcon(key) {
  switch (key) {
    case 'verified':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2l2.1 1.6L18 4.4l1.1 2.4L22 9l-1 2.6L20 14l-2.9 1.8L12 18l-2.9 1.8L6 14l-1-2.4L2 9l2-2.2L5.9 4.4 9.9 3.6 12 2z"
            stroke="#6EB0FF" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 12l2 2 4-4"
            stroke="#6EB0FF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'payment':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="#C58CFF" strokeWidth="1.2" />
          <path d="M2 10h20" stroke="#C58CFF" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'guarantee':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2v6l3 1-3 1v6"
            stroke="#FFB27A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" stroke="#FFB27A" strokeWidth="1" />
        </svg>
      );

    case 'support':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 8v6a9 9 0 0 0 18 0V8"
            stroke="#6EB0FF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 3v5" stroke="#6EB0FF" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    default:
      return null;
  }
}
