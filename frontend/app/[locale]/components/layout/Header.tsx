'use client'
import { use, useEffect, useState } from 'react';
import styles from './Header.module.css';
import { useTranslations } from 'next-intl';
import { LoginContext } from '../context/LoginContext';
import { Role } from '@/types/Role';

export default function Header() {
  const t = useTranslations('Header');
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatsCount, setChatsCount] = useState(0);

  const { user, authenticated, userLong, authorizedFetch } = use(LoginContext);

  useEffect(() => {
    const fetchChatsCount = async () => {
      if (authenticated !== 'authenticated') return;
      try {
        const res = await authorizedFetch('http://localhost:5221/api/chat/chatsCount');
        if (res.ok) {
          const data = await res.json();
          setChatsCount(data.chatsCount);
        }
      } catch (e) {
        console.error("Chat count error", e);
      }
    }
    fetchChatsCount();
  }, [authenticated]);

  // Determine profile image
  const profileImg = (user?.imageRef || userLong?.imageRef) 
    ? (user?.imageRef || userLong?.imageRef) 
    : '/images/default-profile.png';

  // Determine profile link
  const profileLink = userLong?.role === Role.Client ? '/cabinet-c' : '/cabinet';
  const chatLink = userLong?.role === Role.Client ? '/cabinet-c/chats' : '/cabinet/messages';

  return (
    <header className={styles.siteHeader} role="banner">
      <div className={styles.container}>
        <div className={styles.headerInner}>
          
          {/* 1. Brand */}
          <a href="/" className={styles.brand}>
            <img src="/images/logo.png" alt="Logo" />
          </a>

          {/* 2. Desktop Nav (Hidden on Mobile) */}
          <nav className={styles.mainNav}>
            <ul>
              <li><a href="/create-order" className={styles.navLink}>{t('nav.createOrder')}</a></li>
              <li><a href="/searchpros" className={styles.navLink}>{t('nav.findPro')}</a></li>
              <li><a href="#" className={styles.navLink}>{t('nav.myOrders')}</a></li>
              <li><a href="#" className={styles.navLink}>{t('nav.becomePro')}</a></li>
            </ul>
          </nav>

          {/* 3. Actions */}
          <div className={styles.actionsRow}>
            
            {/* Language */}
            <div className={styles.langSwitch}>
              <button className={`${styles.langBtn} ${styles.langActive}`}>RO</button>
              <button className={styles.langBtn}>EN</button>
            </div>

            {/* Authenticated: Profile & Chat */}
            {authenticated === 'authenticated' && (
              <>
                 <a href={chatLink} className={styles.iconBtn} aria-label={t('chat')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path d="M7 17L3 20V7C3 5.343 4.343 4 6 4H18C19.657 4 21 5.343 21 7V14C21 15.657 19.657 17 18 17H7Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {chatsCount > 0 && <span className={styles.chatBadge}>{chatsCount}</span>}
                </a>

                <a href={profileLink} className={styles.iconBtn} aria-label="Profile">
                  <img src={profileImg} alt="Profile" className={styles.profilePic} />
                </a>
              </>
            )}

            {/* Unauthenticated: Login */}
            {(authenticated === 'unauthenticated' || authenticated === 'loading') && (
              <a href='/auth' className={styles.iconBtn} aria-label="Login">
                <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <circle cx="12" cy="7" r="4" strokeWidth="2"/>
                  <path d="M4 21c0-4 4-7 8-7s8 3 8 7" strokeWidth="2"/>
                </svg>
              </a>
            )}

            {/* CTA Button (Hidden on very small screens via CSS if needed) */}
            <a href="#" className={`${styles.btn} ${styles.primary}`}>
              {t('auth.order')}
            </a>

            {/* Hamburger Button */}
            <button
              className={styles.hamburger}
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 {menuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* 4. Mobile Menu Dropdown */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
           <ul className={styles.mobileNavList}>
             <li><a href="/create-order" className={styles.mobileNavLink}>{t('nav.createOrder')}</a></li>
             <li><a href="/searchpros" className={styles.mobileNavLink}>{t('nav.findPro')}</a></li>
             <li><a href="#" className={styles.mobileNavLink}>{t('nav.myOrders')}</a></li>
             <li><a href="#" className={styles.mobileNavLink}>{t('nav.becomePro')}</a></li>
             <hr style={{opacity: 0.1, margin: '8px 0'}} />
             {/* Mobile Language Switcher */}
             <li style={{display: 'flex', gap: 10, padding: '0 12px'}}>
               <button className={`${styles.langBtn} ${styles.langActive}`} style={{fontSize: 14}}>RO</button>
               <button className={styles.langBtn} style={{fontSize: 14}}>EN</button>
             </li>
           </ul>
        </div>
      </div>
    </header>
  );
}