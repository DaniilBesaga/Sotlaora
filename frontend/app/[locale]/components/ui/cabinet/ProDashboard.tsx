'use client';

import React, { useState } from 'react';
import { Mail, Phone, User, Hammer, AlignLeft, Bell, Trash } from 'lucide-react';
// Імпортуємо об'єкт стилів
import styles from './ProDashboard.module.css';
import PortfolioPanel from './Portfolio';
import PricesPanel from './PricesPanel';

export default function ProDashboard() {
  const [activeTab, setActiveTab] = useState('general');

  const categories = [
    'Сантехник',
    'Електрик',
    'Муж на час',
    'Столяр',
    'Слесарь',
    'Установка бытовой техники',
    'Другие услуги по дому',
    'Ремонт квартир',
  ];

  const notifications = { emailStatus: true, newOrders: true, smsImportant: false };

  const tabs = [
    { id: 'general', label: 'Общая информация' },
    { id: 'portfolio', label: 'Портфолио' },
    { id: 'price', label: 'Стоимость работ' },
  ];

  const [notif, setNotif] = useState(notifications);

  function toggle(key){ setNotif(n => ({ ...n, [key]: !n[key] })); }

  return (
    <div className={styles.container}>
      {/* --- Навігація --- */}
      <div className={styles.tabsHeader}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${styles.tabBtn} ${
              activeTab === tab.id ? styles.tabBtnActive : ''
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <span className={styles.activeLine} />}
          </button>
        ))}
      </div>

      {activeTab === 'portfolio' && (<PortfolioPanel/>)}

      {activeTab === 'price' && (<PricesPanel/>)}

      {activeTab === 'general' && (
        <div className={styles.content}>
        {/* --- Контактні дані --- */}
        <div className={styles.row}>
          <Mail className={styles.icon} />
          <div className={styles.infoBlock}>
            <span className={styles.label}>Контактный email: </span>
            <span className={styles.value}>zloikot.mya@gmail.com</span>
          </div>
        </div>

        <div className={styles.row}>
          <Phone className={styles.icon} />
          <div className={styles.infoBlock}>
            <span className={styles.label}>Контактный телефон: </span>
            <span className={styles.value}>+380980564592</span>
          </div>
        </div>

        {/* --- Особиста інформація --- */}
        <div className={styles.row}>
          <User className={styles.icon} />
          <div className={styles.detailsList}>
            <div className={styles.infoBlock}>
              <span className={styles.label}>Город: </span>
              <span className={styles.value}>Тимишоара</span>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.label}>Дата рождения: </span>
              <button className={styles.addLink}>Добавить</button>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.label}>Пол: </span>
              <button className={styles.addLink}>Добавить</button>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.label}>О себе: </span>
              <button className={styles.addLink}>Добавить</button>
            </div>
          </div>
        </div>

        <br /> 

        {/* --- Категорії замовлень --- */}
        <div className={styles.row}>
          <Hammer className={styles.icon} />
          <div style={{ width: '100%' }}>
            <h3 className={styles.sectionTitle}>Категории заказов</h3>
            <div className={styles.tagsWrapper}>
              {categories.map((cat, index) => (
                <span key={index} className={styles.tag}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        <br />

        {/* --- Опис послуг --- */}
        <div className={styles.row}>
          <AlignLeft className={styles.icon} />
          <div>
            <h3 className={styles.sectionTitle}>Описание услуг</h3>
            <p className={styles.subText}>0/8 услуг</p>
          </div>
        </div>

        <section className={styles.row}>
          <Bell className={styles.icon} />

          <div className={styles.blockBody}>
            <div className={styles.sectionTitleSmall}>Настройка уведомлений</div>
            
            <div className={styles.serviceInfo} style={{marginTop: '15px'}}>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={notif.emailStatus} onChange={()=>toggle('emailStatus')}
                />
                <span className={styles.slider}></span>
              </label>
              <span className={styles.serviceName}>Email сообщение о изменениях статусов заказов</span>
            </div>

            <div className={styles.serviceInfo}>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={notif.emailStatus} onChange={()=>toggle('emailStatus')}
                />
                <span className={styles.slider}></span>
              </label>
              <span className={styles.serviceName}>Email сообщение о изменениях статусов заказов</span>
            </div>

            <div className={styles.serviceInfo}>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={notif.newOrders} onChange={()=>toggle('newOrders')}
                />
                <span className={styles.slider}></span>
              </label>
              <span className={styles.serviceName}>Рассылка новых заказов</span>
            </div>

        </div>
      </section>

      {/* Видалення профілю */}
      <section className={styles.row}>
        <Trash className={styles.icon} />

        <div className={styles.blockBody}>
          <div className={styles.sectionTitleSmall}>Удаление профиля</div>
          <div className={styles.deleteRow}>
            <button className={styles.deleteBtn}>Удалить</button>
            <div className={styles.delNote}>После удаления все данные будут утеряны.</div>
          </div>
        </div>
      </section>

      </div>
      )}
    </div>
  );
}