'use client'

import { motion } from "motion/react";
import { useState } from "react";
import styles from './PricingSection.module.css'


export default function PricingSection(){
  const [mode, setMode] = useState('hour'); // hour or fixed
  const plans = [
    { id: 'visit', name: 'Минимальный визит', desc: 'Выезд специалиста и диагностика', priceHour: 50, priceFixed: 50, note: 'включено 30 мин' },
    { id: 'hourly', name: 'Почасовой тариф', desc: 'Стандартный тариф для большинства задач', priceHour: 50, priceFixed: null, note: 'минимум 1 час' },
    { id: 'job', name: 'Фиксированная цена', desc: 'Для типовых задач (сборка, замена)', priceHour: null, priceFixed: 100, note: 'фиксированная ставка' },
  ];

  return (
    <section className={styles.pricing} aria-label="Тарифы и цены">
      <div className={styles.wrap}>
        <div className={styles.head}>
          <div>
            <h3 className={styles.title}>Тарифы и прозрачность цен</h3>
            <p className={styles.desc}>Примерные ориентиры — точную стоимость указывает мастер в заявке.</p>
          </div>

          <div className={styles.toggle}>
            <button className={`tbtn ${mode==='hour' ? 'active' : ''}`} onClick={() => setMode('hour')}>Ron / ora</button>
            <button className={`tbtn ${mode==='fixed' ? 'active' : ''}`} onClick={() => setMode('fixed')}>Фикс. цена</button>
          </div>
        </div>

        <div className={styles.grid}>
          {plans.map((p, idx) => (
            <motion.div key={p.id} className={`${styles.plan} ${p.id==='hourly' ? styles.popular : ''}`} whileHover={{ y: -8 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              {p.id==='hourly' && <div className={styles.ribbon}>Популярно</div>}

              <div className={styles.planHead}>
                <div className={styles.pname}>{p.name}</div>
                <div className={styles.pdesc}>{p.desc}</div>
              </div>

              <div className={styles.price}>
                {mode === 'hour' ? (
                  p.priceHour ? <div className={styles.num}>{p.priceHour} <span className={styles.curr}>Ron</span></div> : <div className={styles.na}>—</div>
                ) : (
                  p.priceFixed ? <div className={styles.num}>{p.priceFixed} <span className={styles.curr}>Ron</span></div> : <div className={styles.na}>—</div>
                )}
                <div className={styles.note}>{p.note}</div>
              </div>

              <div className={styles.planFooter}>
                <button className={styles.btn + " " + styles.outline}>Подробнее</button>
                <button className={styles.btn + " " + styles.primary}>Заказать</button>
              </div>

            </motion.div>
          ))}
        </div>

        <div className={styles.disclaimer}>Цены ориентировочные — окончательную стоимость подтверждает мастер после осмотра или по фото.</div>
      </div>
    </section>
  );
}