'use client'
import { use, useEffect, useState } from 'react';
import styles from './Header.module.css';
import { useTranslations } from 'next-intl';
import { LoginContext } from '../context/LoginContext';

export default function Header() {
  const t = useTranslations('Header');
  const [menuOpen, setMenuOpen] = useState(false);

  const {user, authenticated, getMe, logout, refresh} = use(LoginContext);

  useEffect(() => {
    const check = async () => {
      const result = await getMe()

      if(result.status === 401){
        const refreshStatus = await refresh();

        if(refreshStatus === 200){
          await getMe();
        }
        else {
          
        }
      }
    }
    check();
  }, [authenticated, user]);

  return (
    <header className={styles.siteHeader} role="banner">
      <div className={`${styles.headerInner} ${styles.container}`}>
        
        {/* Brand */}
        <a href="/" className={styles.brand}>
          {t('brand').replace('.', '')}
          <span className={styles.dot}></span>
        </a>

        {/* Nav */}
        <nav className={styles.mainNav} aria-label="Primary Navigation">
          <ul>
            <li><a href="/create-order" className={styles.navLink}>{t('nav.createOrder')}</a></li>
            <li><a href="/searchpros" className={styles.navLink}>{t('nav.findPro')}</a></li>
            <li><a href="#" className={styles.navLink}>{t('nav.myOrders')}</a></li>
            <li><a href="#" className={styles.navLink}>{t('nav.becomePro')}</a></li>
          </ul>
        </nav>

        {/* Compact actions */}
        <div className={styles.actionsRow}>
          
          {/* Lang */}
          <div className={styles.langSwitch}>
            <button className={`${styles.langBtn} ${styles.langActive}`}>RO</button>
            <button className={styles.langBtn}>EN</button>
          </div>

          {/* Login icon */}
          {authenticated === 'authenticated' && (
            <button className={styles.iconBtn} aria-label={t('account')}>
              <img src={user.ImageRef || '/images/default-profile.png'} alt="Profile" className={styles.profilePic} />
            </button>
          )}

          {authenticated === 'unauthenticated' && (<a href='/auth' className={styles.iconBtn} aria-label="Login">
            <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <circle cx="12" cy="7" r="4" strokeWidth="2"/>
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeWidth="2"/>
            </svg>
          </a>)}

          {/* Chat icon */}
          <button className={styles.iconBtn} aria-label={t('chat')}>
            <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path 
                d="M7 17L3 20V7C3 5.343 4.343 4 6 4H18C19.657 4 21 5.343 21 7V14C21 15.657 19.657 17 18 17H7Z"
                strokeWidth="2"
              />
            </svg>
          </button>

          {/* Primary CTA */}
          <a href="#" className={`${styles.btn} ${styles.primary}`}>{t('auth.order')}</a>

          {/* Mobile burger */}
          <button
            className={styles.hamburger}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
              <path d="M0 1.5h22M0 7h22M0 12.5h22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>

        </div>
      </div>
    </header>
  );
}
