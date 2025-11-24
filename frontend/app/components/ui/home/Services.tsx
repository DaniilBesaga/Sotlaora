'use client'
import { motion } from "motion/react";
import styles from './Services.module.css'

export function ServicesSection(){
  const services = [
    { id: 'repair', title: 'Ремонт и отделка', subtitle: 'Капитальный и мелкий ремонт', image: '/images/services/repair.jpg' },
    { id: 'electric', title: 'Электрика и освещение', subtitle: 'Монтаж, замена, диагностика', image: '/images/services/electrician.jpg' },
    { id: 'meters', title: 'Счётчики (газ, электричество, вода)', subtitle: 'Установка и поверка', image: '/images/services/meters.jpg' },
    { id: 'appliances', title: 'Бытовая техника', subtitle: 'Ремонт и подключение', image: '/images/services/household.jpg' },
    { id: 'gas', title: 'Газовое оборудование', subtitle: 'Проверка и подключение', image: '/images/services/gas.jpg' },
    { id: 'climate', title: 'Кондиционирование и климат', subtitle: 'Установка и обслуживание', image: '/images/services/air.jpg' },
    { id: 'security', title: 'Безопасность и замки', subtitle: 'Замки, сигнализации', image: '/images/services/security.jpg' },
    { id: 'clean', title: 'Уборка и дезинфекция', subtitle: 'Быстро и аккуратно', image: '/images/services/cleaning.jpg' },
    { id: 'transport', title: 'Транспорт и техника', subtitle: 'Перевозки и аренда', image: '/images/services/transport.jpg' },
  ];

  const appearOrder = [
    "repair", 
    "appliances", 
    "security", 
    "clean", 
    "transport", 
    "climate", 
    "meters", 
    "electric", 
    "gas",
    ];

  return (
    <section className={styles.photoCards} aria-label="Категории услуг — фото">
      <div className={styles.wrap}>
        <h3 className={styles.head}>Популярные категории</h3>
        <p className={styles.sub}>Выберите услугу — посмотрите мастеров и отзывы</p>

        <div className={styles.grid}>
          {services.map((s, i) => (
            <motion.a
              key={s.id}
              href={`#${s.id}`}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.4,
                    ease: "easeOut",
                    delay: appearOrder.indexOf(s.id) * 0.25, // ← работает идеально
                },
              }}
            whileHover={{ scale: 1.03 }}
            >
              <div className={styles.media}>
                {/* next/image recommended in real project - here we use background-image for easy replacement */}
                <div className={styles.bg} style={{ backgroundImage: `url(${s.image})` }} role="img" aria-label={s.title} />
                <div className={styles.cardOverlay} aria-hidden />
              </div>

              <div className={styles.cardContent}>
                <div className={styles.centerText}>
                  <div className={styles.title}>{s.title}</div>
                  <div className={styles.subtitle}>{s.subtitle}</div>
                </div>

                <div className={styles.corner}>
                  <button className={styles.arrow}>›</button>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}

