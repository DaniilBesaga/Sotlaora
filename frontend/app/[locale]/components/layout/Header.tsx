'use client'
import { use, useEffect, useState } from 'react';
import styles from './Header.module.css';
import { useTranslations } from 'next-intl';
import { LoginContext } from '../context/LoginContext';
import { Role } from '@/types/Role';

export default function Header() {
  const t = useTranslations('Header');
  const [menuOpen, setMenuOpen] = useState(false);

  const [chatsCount, setChatsCount] = useState<number>(0);

  const {user, authenticated, getMe, logout, refresh, userLong, getMeLongClient, authorizedFetch} = use(LoginContext);

  useEffect(() => {
    
    const fetchChatsCount = async () => {
      if (authenticated === 'unauthenticated') return;

      const res = await authorizedFetch('http://localhost:5221/api/chat/chatsCount');
      if (res.ok) {
        const data = await res.json();
        setChatsCount(data.chatsCount);
      }
    }
    fetchChatsCount();

  }, [authenticated]);

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
            <a href={userLong?.role === Role.Client ? '/cabinet-c' : '/cabinet'} className={styles.iconBtn} aria-label="Profile">
              <img src={(user.imageRef === undefined && userLong?.imageRef === undefined) ?  '/images/default-profile.png' : (user.imageRef || userLong?.imageRef)} alt="Profile" className={styles.profilePic} />
            </a>
          )}

          {(authenticated === 'unauthenticated' || authenticated === 'loading') && (<a href='/auth' className={styles.iconBtn} aria-label="Login">
            <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <circle cx="12" cy="7" r="4" strokeWidth="2"/>
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeWidth="2"/>
            </svg>
          </a>)}

          {/* Chat icon */}
          <a className={styles.iconBtn} aria-label={t('chat')} 
            href={(userLong?.role === Role.Client ? '/cabinet-c/chats' : '/cabinet/messages') }>
            <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path 
                d="M7 17L3 20V7C3 5.343 4.343 4 6 4H18C19.657 4 21 5.343 21 7V14C21 15.657 19.657 17 18 17H7Z"
                strokeWidth="2"
              />
            </svg>
            {chatsCount > 0 && (
              <span className={styles.chatBadge}>{chatsCount}</span>
            )}
          </a>

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
