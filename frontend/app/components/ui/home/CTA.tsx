// components/HeroWithPhoto.jsx
"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="heroPhoto" aria-label="Найдите мастера">
      <div className="media">
        <Image
          src={'/images/services/repair.jpg'}
          alt={''}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 1200px"
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL="/placeholder-small.jpg"
          priority={false}
        />
        <div className="overlay" aria-hidden />
      </div>

      <div className="content">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="centerBlock"
        >
          <h1 className="title">Найдите проверенного мастера рядом — быстро и безопасно</h1>
          <p className="subtitle">Сравнивайте профили, смотрите рейтинг и отзывы — создаём удобный контакт между клиентом и специалистом.</p>

          <div className="ctaRow">
            <button className="cta">Найти мастера</button>
            <button className="ghost">Как это работает</button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.45 }}
            className="miniCard"
            aria-hidden
          >
            <div className="cardLeft">
              <div className="avatar" />
              <div className="info">
                <div className="name">Иван — Электрик</div>
                <div className="meta">⭐ 4.9 · 312 отзывов</div>
              </div>
            </div>
            <div className="cardRight">
              <button className="order">Заказать</button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
