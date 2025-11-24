import styles from './WhyUs.module.css'
import Image from 'next/image';

export default function WhyUs(){
    const heroImg = '/images/whyus/family.webp';
    return(
        <section className={styles.hero} aria-label="Hero — Сбер стиль">
        <div className={styles.bgLayer} aria-hidden="true" />
            <div className={styles.container}>
                <div className={styles.card} style={{ top: '40px', left: '80px' }}>
                    <h3>Нам доверяют</h3>
                    <p>Тысячи клиентов находят проверенных мастеров — быстро и безопасно</p>
                <div className={styles.badge}>
                <Image src={heroImg} alt="badge" width={72} height={72} />
                </div>
            </div>


        <div className={styles.card} style={{ top: '40px', right: '80px' }}>
            <h3>С нами выгодно</h3>
                <p>Прозрачные цены, никаких скрытых платежей и моментальный расчёт</p>
            <div className={styles.badge}>
                <Image src={heroImg} alt="badge" width={72} height={72} />
            </div>
        </div>


        <h1 className={styles.title}>
        Надёжные мастера — прямо
        <br />
         у вас под рукой
        </h1>


        <div className={styles.card} style={{ bottom: '80px', left: '80px' }}>
        <h3>Технологии помогают</h3>
        <p>Умный подбор мастера по рейтингу, опыту и вашему запросу</p>
        <div className={styles.smallBadge}>
        <Image src={heroImg} alt="badge" width={56} height={56} />
        </div>
        </div>


        <div className={styles.card} style={{ bottom: '80px', right: '80px' }}>
        <h3>Мы всегда рядом</h3>
        <p>Мастера доступны в вашем районе — в любое время дня</p>
        <div className={styles.smallBadge}>
        <Image src={heroImg} alt="badge" width={56} height={56} />
        </div>
        </div>
        </div>
    </section>
    )
}