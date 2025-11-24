"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './ForProsSection.module.css'

// ForProsSection — компонент для раздела "Для мастеров"
// Использует styled-jsx, framer-motion и выполняет лёгкий микросабмит (эмуляция).

export default function ForProsSection(){
  const benefits = [
    { key: 'leads', title: 'Готовые заявки', hint: 'Переходите к платящим клиентам' },
    { key: 'profile', title: 'Удобный профиль', hint: 'Портфолио, цены, отзывы' },
    { key: 'payouts', title: 'Быстрые выплаты', hint: 'Прямые переводы на карту' },
    { key: 'protection', title: 'Защита и поддержка', hint: 'Спорные ситуации и страховка' },
  ];

  const [showForm, setShowForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = React.useState({});

  function validate(){
    const e = {};
    if(!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Введите корректный email';
    if(!form.phone || !/^\+?\d{7,15}$/.test(form.phone.replace(/\s|-/g,''))) e.phone = 'Введите телефон в международном формате';
    return e;
  }

  function handleSubmit(ev){
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if(Object.keys(e).length) return;
    setLoading(true);
    // эмуляция отправки — в реальном проекте вызов API
    setTimeout(()=>{
      setLoading(false);
      setSent(true);
    }, 700);
  }

  return (
    <section className={styles.forPros} aria-label="Для мастеров">
      <div className={styles.wrap}>
        <div className={styles.leftCol}>
          <h3 className={styles.head}>Станьте мастером на нашей платформе</h3>
          <p className={styles.lead}>Получайте заявки, управляйте профилем, получайте выплаты — всё в одном месте.</p>

          <div className={styles.benefits}>
            {benefits.map((b) => (
              <motion.div key={b.key} className={styles.benefit} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                <div className={styles.icon}>{renderProIcon(b.key)}</div>
                <div className={styles.bt}>
                  <div className={styles.btitle}>{b.title}</div>
                  <div className={styles.bhint}>{b.hint}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={styles.ctaRow}>
            {!showForm && <button className={styles.btn + " " + styles.primary} onClick={() => setShowForm(true)}>Стать мастером</button>}
            <button className={styles.btn + " " + styles.ghost} onClick={() => window.location.href='/partners'}>Узнать подробнее</button>
          </div>
        </div>

        <div className={styles.rightCol} aria-hidden={sent}>
          <img src="/images/home/handyman.jpg" alt="" />
        </div>

      </div>
    </section>
  );
}

// small icons for pros benefits
function renderProIcon(key){
  switch(key){
    case 'leads':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M3 11h18" stroke="#6EB0FF" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M6 7v8" stroke="#6EB0FF" strokeWidth="1.3" strokeLinecap="round"/>
          <path d="M18 9v6" stroke="#6EB0FF" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      );
    case 'profile':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="12" cy="8" r="3" stroke="#C58CFF" strokeWidth="1.3"/>
          <path d="M4 20c1.8-4 6.2-6 8-6s6.2 2 8 6" stroke="#C58CFF" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      );
    case 'payouts':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="#6EB0FF" strokeWidth="1.2"/>
          <path d="M7 10h10" stroke="#6EB0FF" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      );
    case 'protection':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12 2l6 3v5c0 5-3.6 9-6 10-2.4-1-6-5-6-10V5l6-3z" stroke="#FFB27A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke="#FFB27A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return null;
  }
}
