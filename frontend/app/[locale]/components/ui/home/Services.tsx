'use client';
import { useTranslations } from 'next-intl';
import { motion } from "motion/react";
import styles from './Services.module.css';

export function ServicesSection() {
  const t = useTranslations('ServicesSection');

  const serviceKeys = [
    'repair',
    'electric',
    'meters',
    'appliances',
    'gas',
    'climate',
    'security',
    'clean',
    'transport'
  ];

  const images = {
    repair: '/images/services/repair.jpg',
    electric: '/images/services/electrician.jpg',
    meters: '/images/services/meters.jpg',
    appliances: '/images/services/household.jpg',
    gas: '/images/services/gas.jpg',
    climate: '/images/services/air.jpg',
    security: '/images/services/security.jpg',
    clean: '/images/services/cleaning.jpg',
    transport: '/images/services/transport.jpg',
  };

  const appearOrder = [
    'repair',
    'appliances',
    'security',
    'clean',
    'transport',
    'climate',
    'meters',
    'electric',
    'gas'
  ];

  return (
    <section className={styles.photoCards} aria-label={t('title')}>
      <div className={styles.wrap}>
        <h3 className={styles.head}>{t('title')}</h3>
        <p className={styles.sub}>{t('subtitle')}</p>

        <div className={styles.grid}>
          {serviceKeys.map((key) => {
            const title = t(`services.${key}.title`);
            const subtitle = t(`services.${key}.subtitle`);
            const image = images[key];

            return (
              <motion.a
                key={key}
                href={`#${key}`}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                    ease: "easeOut",
                    delay: appearOrder.indexOf(key) * 0.25,
                  },
                }}
                whileHover={{ scale: 1.03 }}
              >
                <div className={styles.media}>
                  <div
                    className={styles.bg}
                    style={{ backgroundImage: `url(${image})` }}
                    role="img"
                    aria-label={title}
                  />
                  <div className={styles.cardOverlay} aria-hidden />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.centerText}>
                    <div className={styles.title}>{title}</div>
                    <div className={styles.subtitle}>{subtitle}</div>
                  </div>

                  <div className={styles.corner}>
                    <button className={styles.arrow}>›</button>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
