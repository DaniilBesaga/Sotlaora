'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import styles from './WhyUs.module.css';

export default function WhyUs() {
  const t = useTranslations('WhyUs');
  const heroImg = '/images/whyus/family.webp';

  const cards = [
    { key: 'trust', position: { top: '40px', left: '80px' }, size: 72 },
    { key: 'benefit', position: { top: '40px', right: '80px' }, size: 72 },
    { key: 'technology', position: { bottom: '80px', left: '80px' }, size: 56 },
    { key: 'near', position: { bottom: '80px', right: '80px' }, size: 56 }
  ];

  return (
    <section className={styles.hero} aria-label={t('title')}>
      <div className={styles.bgLayer} aria-hidden="true" />

      <div className={styles.container}>
        <h1 className={styles.title}>
          <span>{t('title').split('—')[0]} —</span>
          <span>{t('title').split('—')[1]}</span>
        </h1>

        <div className={styles.cardsGrid}>
          {cards.map(({ key, position, size }) => (
            <div
              key={key}
              className={styles.card}
              // The style prop applies top/left.
              // Our CSS !important overrides this on mobile.
              style={position} 
            >
              <h3>{t(`cards.${key}.title`)}</h3>
              <p>{t(`cards.${key}.text`)}</p>

              <div className={size > 60 ? styles.badge : styles.smallBadge}>
                <Image
                  src={heroImg}
                  alt={t('imageAlt') || "Badge icon"}
                  width={size}
                  height={size}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}