'use client'

import { motion } from "motion/react";
import { useState } from "react";
import styles from './PricingSection.module.css'
import { useTranslations } from "next-intl";

export default function PricingSection() {
  const t = useTranslations('PricingSection'); 
  const [mode, setMode] = useState('hour'); 

  const plans = [
    { id: 'visit', priceHour: 50, priceFixed: 50 },
    { id: 'hourly', priceHour: 50, priceFixed: null },
    { id: 'job', priceHour: null, priceFixed: 100 },
  ];

  return (
    <section className={styles.pricing} aria-label={t('title')}>
      <div className={styles.wrap}>

        {/* Заголовок */}
        <div className={styles.head}>
          <div>
            <h3 className={styles.title}>{t('title')}</h3>
            <p className={styles.desc}>{t('desc')}</p>
          </div>

          {/* Переключатель тарифов */}
          <div className={styles.toggle}>
            <button className={`tbtn ${mode==='hour' ? 'active' : ''}`} onClick={() => setMode('hour')}>
              {t('toggle.hour')}
            </button>
            <button className={`tbtn ${mode==='fixed' ? 'active' : ''}`} onClick={() => setMode('fixed')}>
              {t('toggle.fixed')}
            </button>
          </div>
        </div>

        {/* Сетки тарифов */}
        <div className={styles.grid}>
          {plans.map((p) => (
            <motion.div
              key={p.id}
              className={`${styles.plan} ${p.id==='hourly' ? styles.popular : ''}`}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              {/* Лейбл "Популярно" */}
              {p.id==='hourly' && t(`plans.${p.id}.ribbon`) && (
                <div className={styles.ribbon}>{t(`plans.${p.id}.ribbon`)}</div>
              )}

              <div className={styles.planHead}>
                <div className={styles.pname}>{t(`plans.${p.id}.name`)}</div>
                <div className={styles.pdesc}>{t(`plans.${p.id}.desc`)}</div>
              </div>

              <div className={styles.price}>
                {mode === 'hour' ? (
                  p.priceHour ? <div className={styles.num}>{p.priceHour} <span className={styles.curr}>Ron</span></div> : <div className={styles.na}>—</div>
                ) : (
                  p.priceFixed ? <div className={styles.num}>{p.priceFixed} <span className={styles.curr}>Ron</span></div> : <div className={styles.na}>—</div>
                )}
                <div className={styles.note}>{t(`plans.${p.id}.note`)}</div>
              </div>

              <div className={styles.planFooter}>
                <button className={`${styles.btn} ${styles.outline}`}>{t('buttons.details')}</button>
                <button className={`${styles.btn} ${styles.primary}`}>{t('buttons.order')}</button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={styles.disclaimer}>{t('disclaimer')}</div>
      </div>
    </section>
  );
}
