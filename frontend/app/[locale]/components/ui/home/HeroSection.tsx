'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';
import { useTranslations } from 'next-intl';

const sloganVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + (i * 0.1), duration: 0.6, ease: "easeOut" }
  }),
};

export default function HeroSection() {
  const t = useTranslations('Hero');

  return (
    <section className={styles.hero} aria-label={t('ariaLabel') || "Find a Pro"}>
      
      {/* Background Container */}
      <div className={styles.bgContainer}>
        <div
          className={styles.bgLayer}
          style={{ backgroundImage: `url('/images/home/hero2.jfif')` }}
          aria-hidden="true"
        />
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.headline}>
            {t('headlineTop')}<br />
            <motion.span
              custom={0}
              variants={sloganVariants}
              initial="hidden"
              animate="show"
              className={styles.highlight}
            >
              {t('headlineFast')}
            </motion.span>
            <span className={styles.dot}> & </span>
            <motion.span
              custom={1}
              variants={sloganVariants}
              initial="hidden"
              animate="show"
              className={styles.highlight}
            >
              {t('headlineReliable')}
            </motion.span>
          </h1>

          <p className={styles.lead}>{t('lead')}</p>

          {/* Search Bar */}
          <div className={styles.searchCard} role="search">
            <svg className={styles.icon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              className={styles.searchInput}
              placeholder={t('search.placeholder')}
              aria-label={t('search.ariaLabel')}
            />
            <button className={styles.searchBtn}>
              {t('search.button')}
            </button>
          </div>

          {/* Badges */}
          <div className={styles.badges}>
            
            {/* Badge 1: Quality */}
            <div className={styles.badge}>
              <div className={styles.iconWrap}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span className={styles.lbl}>{t('badges.quality')}</span>
            </div>

            {/* Badge 2: Reviews */}
            <div className={styles.badge}>
              <div className={styles.iconWrap}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <span className={styles.lbl}>{t('badges.reviews')}</span>
            </div>

            {/* Badge 3: Security */}
            <div className={styles.badge}>
              <div className={styles.iconWrap}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                   <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <span className={styles.lbl}>{t('badges.security')}</span>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}