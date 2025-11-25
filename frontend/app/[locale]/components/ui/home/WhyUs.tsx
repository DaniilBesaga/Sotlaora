'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import styles from './WhyUs.module.css';

export default function WhyUs() {
  const t = useTranslations('WhyUs');
  const heroImg = '/images/whyus/family.webp';

  const cards = [
    { key: 'trust',    position: { top: '40px',  left: '80px' }, size: 72 },
    { key: 'benefit',  position: { top: '40px',  right: '80px' }, size: 72 },
    { key: 'technology', position: { bottom: '80px', left: '80px' }, size: 56 },
    { key: 'near',       position: { bottom: '80px', right: '80px' }, size: 56 }
  ];

  return (
    <section className={styles.hero} aria-label={t('title')}>
      <div className={styles.bgLayer} aria-hidden="true" />

      <div className={styles.container}>

        {/* Title */}
        <h1 className={styles.title}>
          {t('title').split('—')[0]} —<br />
          {t('title').split('—')[1]}
        </h1>

        {/* Cards */}
        {cards.map(({ key, position, size }) => (
          <div key={key} className={styles.card} style={position}>
            <h3>{t(`cards.${key}.title`)}</h3>
            <p>{t(`cards.${key}.text`)}</p>

            <div className={size > 60 ? styles.badge : styles.smallBadge}>
              <Image
                src={heroImg}
                alt={t('imageAlt')}
                width={size}
                height={size}
              />
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
