'use client'
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.siteHeader} role="banner">
      <div className={`${styles.headerInner} ${styles.container}`}>
        
        <a href="/" className={styles.brand}>
          Soț la Ora<span className={styles.dot}>.</span>
        </a>

        <nav className={styles.mainNav} aria-label="Primary Navigation">
          <ul>
            <li><a href="#" className={`${styles.navLink}`}>Создать заказ</a></li>
            <li><a href="#" className={styles.navLink}>Найти специалиста</a></li>
            <li><a href="#" className={styles.navLink}>Мои заказы</a></li>
            <li><a href="#" className={styles.navLink}>Стать исполнителем</a></li>
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <div className={styles.langSwitch}>
            <button className={`${styles.langBtn} ${styles.langActive}`}>RO</button>
            <button className={`${styles.langBtn}`}>EN</button>
          </div>
          
          <button className={styles.chatButton} aria-label="Открыть чат">
            <svg className={styles.chatIcon} viewBox="0 0 24 24" fill="none">
              <path 
                d="M7 17L3 20V7C3 5.343 4.343 4 6 4H18C19.657 4 21 5.343 21 7V14C21 15.657 19.657 17 18 17H7Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <a href="#" className={`${styles.btn} ${styles.ghost}`}>Войти</a>
          <a href="#" className={`${styles.btn} ${styles.primary}`}>Заказать</a>

          <button
            className={styles.hamburger}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1.5h22M0 7h22M0 12.5h22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={styles.mobileMenu} hidden={!menuOpen}>
        <ul>
          <li><a href="#" className={`${styles.navLink} ${styles.navPill}`}>Услуги</a></li>
          <li><a href="#" className={styles.navLink}>Мастера</a></li>
          <li><a href="#" className={styles.navLink}>Цены</a></li>
          <li><a href="#" className={styles.navLink}>О нас</a></li>
          <li className={styles.mobileCta}><a href="#" className={`${styles.btn} ${styles.primary}`}>Заказать</a></li>
        </ul>
      </div>
    </header>
  );
}
