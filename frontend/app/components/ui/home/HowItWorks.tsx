'use client'
import { motion } from "motion/react";

export default function HowItWorks(){
  const steps = [
    { id: 'step1', title: 'Найдите услугу', desc: 'Опишите задачу или выберите категорию — мы подберём мастеров.', icon: 'search' },
    { id: 'step2', title: 'Выберите мастера', desc: 'Сравните профили, рейтинг и отзывы — выберите подходящего.', icon: 'user' },
    { id: 'step3', title: 'Оплатите и подтвердите', desc: 'Оплата через защищённую систему — подтверждение и гарантия.', icon: 'pay' },
  ];

  return (
    <section className="how" aria-label="Как это работает">
      <div className="wrap">
        <div className="top">
          <h3 className="title">Как это работает</h3>
          <p className="lead">Просто и прозрачно — три шага от заявки до выполнения</p>
        </div>

        <div className="grid">
          {steps.map((s, i) => (
            <motion.div key={s.id} className="step" whileHover={{ translateY: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
              <div className="num">{i+1}</div>
              <div className="icon">{renderHowIcon(s.icon)}</div>
              <div className="scontent">
                <div className="stitle">{s.title}</div>
                <div className="sdesc">{s.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="ctaRow">
          <a href="/how-it-works" className="btn primary">Подробнее</a>
        </div>
      </div>
    </section>
  );
}

function renderHowIcon(name){
  switch(name){
    case 'search':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 21l-4.35-4.35" stroke="#6EB0FF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="11" cy="11" r="6" stroke="#6EB0FF" strokeWidth="1.4"/>
        </svg>
      );
    case 'user':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#C58CFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="#C58CFF" strokeWidth="1.4"/>
        </svg>
      );
    case 'pay':
      return (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="#FFB27A" strokeWidth="1.2"/>
          <path d="M6 10h6" stroke="#FFB27A" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      );
    default:
      return null;
  }
}