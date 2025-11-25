"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';
import { useTranslations } from 'next-intl';

const sloganVariants = {
  hidden: { opacity: 0, x: -18, scale: 0.98 },
  show: i => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: 0.12 * i, duration: 0.55, ease: [0.22,1,0.36,1] }
  }),
};

export default function HeroSection() {
  const t = useTranslations('Hero');

  return (
    <section className={styles.hero} aria-label="Hero — Найдите мастера">
      <div
        className={styles.bgLayer}
        style={{ backgroundImage: `url('/images/home/hero2.jfif')` }}
        aria-hidden="true"
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
        >
          <h1 className={styles.headline}>
            <span className={styles.headlineLine}>{t('headlineTop')}</span>
            <br />
            <motion.span
              custom={0}
              variants={sloganVariants}
              initial="hidden"
              animate="show"
              className={styles.highlight}
            >
              {t('headlineFast')}
            </motion.span>
            <span className={styles.dot}>.</span>
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

          <div
            className={styles.searchCard}
            role="search"
            aria-label={t('search.ariaLabel')}
          >
            <div className={styles.searchLeft}>
              <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                width="20"
                height="20"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm8.7 14.3-3.4-3.4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                className={styles.searchInput}
                placeholder={t('search.placeholder')}
                aria-label={t('search.ariaLabel')}
              />
            </div>

            <button className={styles.searchBtn} aria-label={t('search.ariaLabel')}>
              {t('search.button')}
            </button>
          </div>

          <div className={styles.badges} aria-hidden="true" role="list">
            {/* Гарантия / Надёжность */}
            <div className={`${styles.badge} ${styles.badgePremiumBoost}`} role="listitem">
              <div className={styles.iconWrap} aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" stroke="currentColor" strokeWidth="2.8" fill="rgba(255,255,255,0.15)" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12l2.2 2.2L15 10" stroke="currentColor" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className={styles.txt}>
                <div className={styles.lbl}>{t('badges.quality')}</div>
                {/* optional small hint line */}
                {/* <div className={styles.sub}>{t('badges.qualityHint')}</div> */}
              </div>
            </div>

              {/* Отзывы */}
              <div className={`${styles.badge} ${styles.badgePremiumBoost}`} role="listitem">
                <div className={styles.iconWrap} aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 3l3 6 7 .8-5 4.5 1.2 6.5L12 18l-6.2 2.8L7 14.3 2 9.8l7-.8 3-6z"
                      stroke="currentColor"
                      stroke-width="2.8"
                      fill="rgba(255,255,255,0.12)"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <div className={styles.txt}>
                  <div className={styles.lbl}>{t('badges.reviews')}</div>
                  {/* optional small hint line */}
                  {/* <div className={styles.sub}>{t('badges.qualityHint')}</div> */}
                </div>
              </div>

  {/* Безопасность / Siguranță */}
  <div className={`${styles.badge} ${styles.badgePremiumBoost}`} role="listitem">
                <div className={styles.iconWrap} aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <rect
                      x="9"
                      y="11"
                      width="6"
                      height="5"
                      rx="1.5"
                      stroke="currentColor"
                      stroke-width="2"
                      fill="none"
                    />
                    <path
                      d="M12 11v-2"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>

                <div className={styles.txt}>
                  <div className={styles.lbl}>{t("badges.security")}</div>
                  {/* optional small hint line */}
                  {/* <div className={styles.sub}>{t('badges.qualityHint')}</div> */}
                </div>
              </div>
</div>

        </motion.div>
      </div>
    </section>
  );
}
