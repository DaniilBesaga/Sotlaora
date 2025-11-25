'use client';
import { motion } from "motion/react";
import styles from './PopularPros.module.css';
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function PopularPros(){

    const t = useTranslations("PopularProsSection");

    // --- Данные мастеров (имена, фото) остаются статичными ---
    const prosBase = [
        { id: 'p1', name: 'Ion Petrov', img: '/images/pros/1.jpg', rating: 4.9, reviews: 312 },
        { id: 'p2', name: 'Maria S.', img: '/images/pros/2.jpg', rating: 4.8, reviews: 198 },
        { id: 'p3', name: 'Alexandru C.', img: '/images/pros/1.jpg', rating: 4.7, reviews: 144 },
        { id: 'p4', name: 'Oleg N.', img: '/images/pros/1.jpg', rating: 4.8, reviews: 86 },
        { id: 'p5', name: 'Daria L.', img: '/images/pros/2.jpg', rating: 4.9, reviews: 420 },
    ];

    // --- Переносим role/rate/specialties из JSON переводов ---
    const pros = prosBase.map((p) => ({
        ...p,
        role: t(`pros.${p.id}.role`),
        rate: t(`pros.${p.id}.rate`),
        specialties: t.raw(`pros.${p.id}.specialties`)
    }));

    const [expanded, setExpanded] = useState(null);
    const scrollRef = useRef(null);

    function scrollBy(dir = 1){
        const el = scrollRef.current;
        if(!el) return;
        const cardWidth = el.querySelector(`.${styles.proCard}`)?.clientWidth || 320;
        el.scrollBy({ left: dir * (cardWidth + 16) * 2, behavior: 'smooth' });
    }

    function toggleExpand(id){
        setExpanded(prev => prev === id ? null : id);
    }

    return(
        <section className={styles.popular} aria-label={t("title")}>
            <div className={styles.wrap}>
                
                {/* --- Header --- */}
                <div className={styles.headRow}>
                    <div>
                        <h3 className={styles.title}>{t("title")}</h3>
                        <p className={styles.desc}>{t("description")}</p>
                    </div>

                    <div className={styles.controls} aria-hidden>
                        <button 
                            className={styles.ctrl} 
                            onClick={() => scrollBy(-1)}
                            aria-label={t("controls.prev")}
                        >
                            ‹
                        </button>

                        <button 
                            className={styles.ctrl} 
                            onClick={() => scrollBy(1)}
                            aria-label={t("controls.next")}
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* --- Carousel --- */}
                <div className={styles.carousel} ref={scrollRef} role="list">
                    {pros.map((p) => (
                        <motion.a
                            key={p.id}
                            className={styles.proCard}
                            href={`#pro-${p.id}`}
                            whileHover={{ scale: 1.03, y: -6 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            role="listitem"
                        >

                            <div className={styles.media}>
                                <div 
                                    className={styles.img} 
                                    style={{ backgroundImage: `url(${p.img})` }} 
                                    aria-hidden 
                                />
                                <div className={styles.overlay} aria-hidden />
                            </div>

                            <div className={styles.info}>

                                <div className={styles.rowTop}>
                                    <div className={styles.name}>{p.name}</div>
                                </div>

                                <div className={styles.role}>{p.role}</div>

                                {/* ---- Specialities preview (chips) ---- */}
                                <div className={styles.specs}>
                                    {p.specialties.slice(0,2).map((s, i) => (
                                        <button 
                                            key={i} 
                                            className={styles.chip}
                                            aria-label={`${t("chipAriaLabel")} ${s}`}
                                        >
                                            {s}
                                        </button>
                                    ))}

                                    {p.specialties.length > 2 && (
                                        <button
                                            className={`${styles.chip} ${styles.more}`}
                                            onClick={(e) => { e.preventDefault(); toggleExpand(p.id); }}
                                            aria-expanded={expanded === p.id}
                                        >
                                            {expanded === p.id 
                                                ? t("cardActions.collapse") 
                                                : `+${p.specialties.length - 2}`
                                            }
                                        </button>
                                    )}
                                </div>

                                {/* ---- Expanded specialties ---- */}
                                <div
                                    className={`${styles.allSpecs} ${expanded === p.id && styles.open}`}
                                    aria-hidden={expanded === p.id ? 'false' : 'true'}
                                >
                                    {p.specialties.map((s, idx) => (
                                        <span key={idx} className={`${styles.chip} ${styles.full}`}>
                                            {s}
                                        </span>
                                    ))}
                                </div>

                                {/* --- Bottom Row --- */}
                                <div className={styles.metaRow}>
                                    <div className={styles.rating}>⭐ {p.rating} <span className={styles.reviews}>· {p.reviews}</span></div>
                                    <div className={styles.rate}>{p.rate}</div>

                                    <div className={styles.actions}>
                                        <button className={`${styles.btn} ${styles.ghost}`}>
                                            {t("cardActions.profile")}
                                        </button>
                                        <button className={`${styles.btn} ${styles.primary}`}>
                                            {t("cardActions.order")}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
