'use client'
import { motion } from "motion/react";
import styles from './PopularPros.module.css'
import { useRef, useState } from "react";
export default function PopularPros(){

    const pros = [
        { id: 'p1', name: 'Иван Петров', role: 'Электрик', rate: 'от 50 Ron/ora', rating: 4.9, reviews: 312, img: '/images/pros/1.jpg', specialties: ['Монтаж розеток', 'Диагностика', 'Замена проводки', 'Установка освещения'] },
        { id: 'p2', name: 'Мария С.', role: 'Сантехник', rate: 'от 60 Ron/ora', rating: 4.8, reviews: 198, img: '/images/pros/2.jpg', specialties: ['Прочистка труб', 'Установка унитаза'] },
        { id: 'p3', name: 'Алексей К.', role: 'Мастер по отделке', rate: 'от 45 Ron/ora', rating: 4.7, reviews: 144, img: '/images/pros/1.jpg', specialties: ['Штукатурка', 'Шпатлёвка', 'Покраска', 'Укладка плитки'] },
        { id: 'p4', name: 'Олег Н.', role: 'Кондиционеры', rate: 'от 50 Ron/ora', rating: 4.8, reviews: 86, img: '/images/pros/1.jpg', specialties: ['Кондиционеры', 'Заправка фреоном', 'Обслуживание'] },
        { id: 'p5', name: 'Дарья Л.', role: 'Сборка мебели', rate: 'от 50 Ron/ora', rating: 4.9, reviews: 420, img: '/images/pros/2.jpg', specialties: ['IKEA сборка', 'Сборка корпусной мебели', 'Настройка дверей'] },
    ];


    const [expanded, setExpanded] = useState(null); // id of card with expanded specialties
    const scrollRef = useRef(null);


    function scrollBy(dir = 1){
        const el = scrollRef.current;
        if(!el) return;
        const cardWidth = el.querySelector('.proCard')?.clientWidth || 320;
        el.scrollBy({ left: dir * (cardWidth + 16) * 2, behavior: 'smooth' });
    }


    function toggleExpand(id){
        setExpanded(prev => prev === id ? null : id);
    }

    return(
        <section className={styles.popular} aria-label="Популярные мастера">
            <div className={styles.wrap}>
                <div className={styles.headRow}>
                    <div>
                        <h3 className={styles.title}>Популярные мастера</h3>
                        <p className={styles.desc}>Быстрый доступ к проверенным специалистам в вашем городе</p>
                    </div>


                <div className={styles.controls} aria-hidden>
                    <button className={styles.ctrl} onClick={() => scrollBy(-1)} aria-label="Назад">‹</button>
                    <button className={styles.ctrl} onClick={() => scrollBy(1)} aria-label="Вперед">›</button>
                </div>
            </div>


            <div className={styles.carousel} ref={scrollRef} role="list">
                {pros.map((p, idx) => (
                    <motion.a key={p.id} className={styles.proCard} href={`#pro-${p.id}`} whileHover={{ scale: 1.03, y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} role="listitem">
                    <div className={styles.media}>
                        <div className={styles.img} style={{ backgroundImage: `url(${p.img})` }} aria-hidden />
                        <div className={styles.overlay} aria-hidden />
            </div>


            <div className={styles.info}>
            <div className={styles.rowTop}>
            <div className={styles.name}>{p.name}</div>
            </div>
            <div className={styles.role}>{p.role}</div>

            <div className={styles.specs}>
                {p.specialties.slice(0,2).map((s, i) => (
                    <button key={i} className={styles.chip} aria-label={`Специализация ${s}`}>{s}</button>
                ))}


                {p.specialties.length > 2 && (
                    <button className={styles.chip + " " + styles.more} onClick={() => toggleExpand(p.id)} aria-expanded={expanded === p.id} aria-controls={`specs-${p.id}`}>
                        {expanded === p.id ? 'Свернуть' : `+${p.specialties.length - 2}`}
                    </button>
                )}
            </div>


            <div
  className={`${styles.allSpecs} ${expanded === p.id && styles.open}`}
 id={`specs-${p.id}`} aria-hidden={expanded === p.id ? 'false' : 'true'}>
            {p.specialties.map((s, idx) => (
            <span key={idx} className={styles.chip + " " + styles.full}>{s}</span>
            ))}
            </div>


            <div className={styles.metaRow}>
                <div className={styles.rating}>⭐ {p.rating} <span className={styles.reviews}>· {p.reviews}</span></div>
                <div className={styles.rate}>{p.rate}</div>
                <div className={styles.actions}>
                <button className={styles.btn + " " + styles.ghost}>Профиль</button>
                <button className={styles.btn + " " + styles.primary}>Заказать</button>
                </div>
            </div>
            </div>
            </motion.a>
            ))}
            </div>

            </div>
        </section>
    )
}