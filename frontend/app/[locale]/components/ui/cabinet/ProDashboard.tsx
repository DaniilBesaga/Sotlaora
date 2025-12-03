/* ProDashboard.module.css */



/* ProDashboard.jsx */

'use client';
import React, { useState } from 'react';
import styles from './ProDashboard.module.css';

export default function ProDashboard({ initial }) {
  const init = initial ?? {
    avatar: '/images/pros/1.jpg',
    name: 'Іван Петров',
    phone: '+380980564592',
    city: 'Березань',
    categories: ['Сантехнік','Електрик','Чоловік на годину','Столяр','Слюсар','Установка побутової техніки'],
    servicesLimit: { 'Сантехнік':200, 'Електрик':150, 'Чоловік на годину':100, 'Столяр':10, 'Слюсар':10, 'Установка побутової техніки':160 },
    servicesCount: { 'Сантехнік':0,'Електрик':0,'Чоловік на годину':0,'Столяр':0,'Слюсар':0,'Установка побутової техніки':0 },
    cities: ['Березань'],
    notifications: { emailStatus: true, newOrders: true, smsImportant: false },
  };

  const [profile, setProfile] = useState(init);
  const [notif, setNotif] = useState(init.notifications);

  function toggle(key){ setNotif(n => ({ ...n, [key]: !n[key] })); }

  function handleDelete(){
    if (confirm('Видалити профіль? Ця дія незворотня.')) {
      alert('Профіль видалено (демо).');
    }
  }

  return (
    <div className={styles.container}>

      <main className={styles.grid}>

        <section className={styles.card}>
          <div className={styles.cardIcon} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 16.5V19a2 2 0 0 1-2 2C10.477 21 3 13.523 3 4A2 2 0 0 1 5 2h2.5A2.5 2.5 0 0 1 10 4.5V7" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.titleSmall}>Контактний телефон</div>
            <div className={styles.valueLarge}>{profile.phone}</div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardIcon} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM21 21c0-4.97-4.03-9-9-9" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className={styles.cardBody}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div className={styles.titleSmall}>Місто</div>
                <div className={styles.valueLarge}>{profile.city}</div>
              </div>
              <button className={styles.btnGhost}>Змінити</button>
            </div>

            <div style={{marginTop:12, display:'flex', gap:8, flexWrap:'wrap', fontSize: '.7rem'}}>
              <button className={styles.pill}>Додати дату народження</button>
              <button className={styles.pill}>Додати стать</button>
              <button className={styles.pill}>Про себе</button>
            </div>
          </div>
        </section>

        <section className={`${styles.card} ${styles.sectionWide}`}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
            <div>
              <div className={styles.titleSmall}>Категорії замовлень</div>
              <div style={{marginTop:8, display:'flex', gap:8, flexWrap:'wrap'}}>
                {profile.categories.map((c,i)=> <span key={c+i} className={styles.badge}>{c}</span>)}
                <button className={styles.btnGhost}>Інші послуги</button>
              </div>
            </div>
            <div className={styles.actionsRow}>
              <button className={styles.btnGhost}>Керувати</button>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardIcon} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.titleSmall}>Опис послуг</div>
            <div className={styles.valueLarge}>{Object.values(profile.servicesCount).reduce((a,b)=>a+b,0)}/{profile.categories.length} послуг</div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardIcon} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" stroke="#94a3b8" strokeWidth="1.6"/><path d="M2 10h20" stroke="#94a3b8" strokeWidth="1.6"/></svg>
          </div>
          <div className={`${styles.cardBody} ${styles.payCard}`}>
            <div className={styles.titleSmall}>Платіжні дані</div>
            <div style={{marginTop:6}} className={styles.valueLarge}>Прив'язати карту — <strong style={{fontWeight:800,color:'#0f172a'}}>Visa / MasterCard</strong></div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardIcon} aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 10-12 0v3a6 6 0 00-2 4h16a6 6 0 00-2-4V8z" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.titleSmall}>Налаштування повідомлень</div>

            <div className={styles.toggles} style={{marginTop:10}}>
              <ToggleRow label="Email повідомлення про зміни статусів замовлень" checked={notif.emailStatus} onChange={()=>toggle('emailStatus')} />
              <ToggleRow label="Розсилка нових замовлень" checked={notif.newOrders} onChange={()=>toggle('newOrders')} />
              <ToggleRow label="SMS повідомлення про важливі події" checked={notif.smsImportant} onChange={()=>toggle('smsImportant')} />
            </div>
          </div>
        </section>

        <section className={`${styles.card} ${styles.sectionWide}`}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
            <div>
              <div className={styles.titleSmall}>Видалення профілю</div>
              <div className={styles.note} style={{marginTop:6}}>Після видалення всі дані будуть втрачені.</div>
            </div>
            <div className={styles.deleteRow}>
              <button className={styles.deleteBtn} onClick={handleDelete}>Видалити</button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }){
  return (
    <div className={styles.toggleRow}>
      <div style={{fontSize:14, color:'var(--text)'}}>{label}</div>
      <div
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`${styles.switch} ${checked? 'on':'off'}`}
        style={{display:'inline-flex', alignItems:'center'}}
      >
        <div className="knob" style={{width:20,height:20,borderRadius:999,background:'#fff',boxShadow:'0 6px 18px rgba(2,6,23,0.12)', transform: checked? 'translateX(18px)':'translateX(0)', transition:'transform .18s'}} />
      </div>
    </div>
  );
}
