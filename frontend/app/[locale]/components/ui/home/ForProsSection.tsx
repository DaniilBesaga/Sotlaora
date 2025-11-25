'use client';
import React from 'react';
import { motion } from 'framer-motion';
import styles from './ForProsSection.module.css'
import { useTranslations } from 'next-intl';

export default function ForProsSection() {
  const t = useTranslations('ForProsSection');
  
  const benefits = ['leads', 'profile', 'payouts', 'protection'];

  const [showForm, setShowForm] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  return (
    <section className={styles.forPros} aria-label={t('title')}>
      <div className={styles.wrap}>
        <div className={styles.leftCol}>
          <h3 className={styles.head}>{t('title')}</h3>
          <p className={styles.lead}>{t('lead')}</p>

          <div className={styles.benefits}>
            {benefits.map((key) => (
              <motion.div
                key={key}
                className={styles.benefit}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <div className={styles.icon}>{renderProIcon(key)}</div>
                <div className={styles.bt}>
                  <div className={styles.btitle}>{t(`benefits.${key}.title`)}</div>
                  <div className={styles.bhint}>{t(`benefits.${key}.hint`)}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={styles.ctaRow}>
            {!showForm && (
              <button
                className={`${styles.btn} ${styles.primary}`}
                onClick={() => setShowForm(true)}
              >
                {t('buttons.becomePro')}
              </button>
            )}
            <button
              className={`${styles.btn} ${styles.ghost}`}
              onClick={() => window.location.href='/partners'}
            >
              {t('buttons.learnMore')}
            </button>
          </div>
        </div>

        <div className={styles.rightCol} aria-hidden={sent}>
          <img src="/images/home/handyman.jpg" alt={t('imageAlt')} />
        </div>
      </div>
    </section>
  );
}

function renderProIcon(key) {
  switch(key) {
    case 'leads':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 11h18" stroke="#6EB0FF" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M6 7v8" stroke="#6EB0FF" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M18 9v6" stroke="#6EB0FF" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      );
    case 'profile':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="3" stroke="#C58CFF" strokeWidth="1.3"/>
          <path d="M4 20c1.8-4 6.2-6 8-6s6.2 2 8 6" stroke="#C58CFF" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      );
    case 'payouts':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="#6EB0FF" strokeWidth="1.2"/>
          <path d="M7 10h10" stroke="#6EB0FF" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      );
    case 'protection':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2l6 3v5c0 5-3.6 9-6 10-2.4-1-6-5-6-10V5l6-3z" stroke="#FFB27A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke="#FFB27A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return null;
  }
}
