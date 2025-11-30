"use client";
import React from "react";
import { motion } from "framer-motion";
import styles from "./Auth.module.css";

export default function AuthFullBg() {
  const [role, setRole] = React.useState("customer"); // 'customer' | 'pro'
  const isCustomer = role === "customer";

  function handleGoogleLogin() {
    // TODO: подключить реальный OAuth (NextAuth / Google)
    alert(`Google login as: ${role}`);
  }

  return (
    <div className={styles.wrapper} role="main">
      <div
        className={styles.bg}
        aria-hidden
        style={{
          backgroundImage: "url('/images/account/back.jpg')",
        }}
      />
      <div className={styles.overlay} aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
        className={styles.cardWrap}
      >
        {/* добавили класс карты в зависимости от роли */}
        <div
          className={`${styles.card} ${isCustomer ? styles.customerCard : styles.proCard}`}
          role="region"
          aria-label="Авторизация"
        >
          <header className={styles.header}>
            <div className={styles.brand}>Sot la Ora</div>

            {/* роль-бейдж рядом с подсказкой */}
            <div className={styles.hintRow}>
              <div className={styles.hint}>
                {isCustomer ? "Войти или зарегистрироваться как заказчик" : "Войти или зарегистрироваться как мастер"}
              </div>
              <div className={`${styles.roleBadge} ${isCustomer ? styles.badgeCustomer : styles.badgePro}`}>
                {isCustomer ? "Заказчик" : "Мастер"}
              </div>
            </div>
          </header>

          {/* Role switch */}
          <div className={styles.roleSwitch} role="tablist" aria-label="Выбор роли">
            <button
              className={`${styles.role} ${role === "customer" ? styles.activeRole : ""}`}
              onClick={() => setRole("customer")}
              role="tab"
              aria-selected={role === "customer"}
            >
              Я заказчик
            </button>
            <button
              className={`${styles.role} ${role === "pro" ? styles.activeRole : ""}`}
              onClick={() => setRole("pro")}
              role="tab"
              aria-selected={role === "pro"}
            >
              Я мастер
            </button>
          </div>

          {/* вспомогательное описание роли */}
          <div className={styles.roleDesc} aria-hidden={false}>
            {isCustomer ? (
              <span>
                Быстро найдите исполнителя: публикуйте заявку, сравнивайте профили и отзывы.
              </span>
            ) : (
              <span>
                Войдите как мастер: управляйте портфолио, откликайтесь на заявки и получайте заказы.
              </span>
            )}
          </div>

          {/* Single auth path — Google */}
          <div className={styles.content}>

            <button
              className={`${styles.googleBtn} ${isCustomer ? styles.customerBtn : styles.proBtn}`}
              onClick={handleGoogleLogin}
              aria-label={isCustomer ? "Войти как заказчик через Google" : "Войти как мастер через Google"}
            >
              <span className={styles.googleIcon} aria-hidden>
                {/* SVG Google mark (тональность не меняется) */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.35 11.1H12v2.9h5.35c-.25 1.45-1.6 4.25-5.35 4.25-3.2 0-5.85-2.65-5.85-5.85s2.65-5.85 5.85-5.85c1.85 0 3.1.8 3.8 1.5l2.6-2.5C16.45 3.4 14.4 2.5 12 2.5 6.75 2.5 2.5 6.75 2.5 12s4.25 9.5 9.5 9.5c5.5 0 9.15-3.9 9.15-9.4 0-.65-.1-1.1-.2-1.5z" fill="#4285F4"/>
                </svg>
              </span>
              <span className={styles.googleText}>
                {isCustomer ? "Войти как заказчик через Google" : "Войти как мастер через Google"}
              </span>
            </button>

            <div className={styles.sep}>
              <span>Нажимая, вы принимаете условия</span>
            </div>
          </div>

          <div className={styles.footerNote}>
            <span className={styles.smallLink}>Политика конфиденциальности</span>
          </div>

          {/* aria-live для экранных читалок: уведомляет о смене роли */}
          <div className={styles.srOnly} aria-live="polite">
            {isCustomer ? "Вы выбрали роль: заказчик" : "Вы выбрали роль: мастер"}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
