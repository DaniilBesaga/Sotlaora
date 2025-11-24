
import styles from './CallSection.module.css'

export default function CallSection(){
    
    return(
        <section className={styles.videoCallSection}>
            <div className={styles.videoCallContent}>
                <h2 className={styles.videoTitle}>Мы поддерживаем видеосвязь</h2>
                <p className={styles.videoText}>
                Общайтесь со специалистами прямо через видеозвонок — быстро, удобно и безопасно.
                Покажите проблему в реальном времени и получите профессиональную консультацию без ожиданий.
                </p>

                <a href="#" className={`${styles.btn} ${styles.primary} ${styles.videoBtn}`}>
                Начать видеозвонок
                </a>
            </div>

            <div className={styles.videoCallImage}>
                <img 
                src="/images/home/chat.png" 
                alt="Видеовызов" 
                />
            </div>
        </section>

    )
}