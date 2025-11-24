// HeroSection.jsx

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';
import { useTranslations } from 'next-intl';

const sloganVariants = {
  hidden: { opacity: 0, x: -18, scale: 0.98 },
  show: i => ({ opacity: 1, x: 0, scale: 1, transition: { delay: 0.12 * i, duration: 0.55, ease: [0.22,1,0.36,1] } }),
};

export default function HeroSection() {
  const t = useTranslations('Hero');
  
  return (
    <section className={styles.hero} aria-label="Hero — Найдите мастера">
      <div className={styles.bgLayer} style={{ backgroundImage: `url('/images/home/hero2.jfif')` }} aria-hidden="true" />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <motion.div className={styles.left}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        >
          <h1 className={styles.headline}>
            <span className={styles.headlineLine}>Найдите мастера рядом</span>
            <br />
            <motion.span custom={0} variants={sloganVariants} initial="hidden" animate="show" className={styles.highlight}>Быстро</motion.span>
            <span className={styles.dot}>.</span>
            <motion.span custom={1} variants={sloganVariants} initial="hidden" animate="show" className={styles.highlight}>Надёжно</motion.span>
          </h1>

          <p className={styles.lead}>Проверенные специалисты, прозрачные цены, удобный поиск и мгновенные заявки.</p>

          <div className={styles.searchCard} role="search" aria-label="Поиск мастера">
            <div className={styles.searchLeft}>
              <svg className={styles.icon} viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                <path fill="currentColor" d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm8.7 14.3-3.4-3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input className={styles.searchInput} placeholder="Поиск: электрик, сантехник, сборка мебели..." aria-label="Поиск" />
            </div>
            <button className={styles.searchBtn} aria-label="Найти мастера">Найти</button>
          </div>

          <div className={styles.badges} aria-hidden>
            <div className={styles.badge}><svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.9 6.1L21 9.2l-5 3.9L17 21l-5-3.2L7 21l1-7.9L3 9.2l6.1-.9L12 2z"/></svg>Гарантия качества</div>
            <div className={styles.badge}><svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.3l6.2 3.7-1.6-7.2L21 9.6l-7.3-.6L12 2 10.3 9 3 9.6l4.4 4.2-1.6 7.2L12 17.3z"/></svg>Отзывы</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
