'use client'
import { useTranslations } from 'next-intl'
import styles from './CallSection.module.css'

export default function CallSection() {
    const t = useTranslations('VideoCall'); // указываем namespace

    return (
        <section className={styles.videoCallSection}>
            <div className={styles.videoCallContent}>
                <h2 className={styles.videoTitle}>{t('title')}</h2>

                <p className={styles.videoText}>
                    {t('text')}
                </p>

                <a href="#" className={`${styles.btn} ${styles.primary} ${styles.videoBtn}`}>
                    {t('button')}
                </a>
            </div>

            <div className={styles.videoCallImage}>
                <img 
                    src="/images/home/chat.png"
                    alt={t('imageAlt')}
                />
            </div>
        </section>
    )
}
