'use client';

import React, { useState } from 'react';
import { Mail, Phone, User, Hammer, AlignLeft } from 'lucide-react';
// Імпортуємо об'єкт стилів
import styles from './ProDashboard.module.css';

export default function ProDashboard() {
  const [activeTab, setActiveTab] = useState('general');

  const categories = [
    'Сантехнік',
    'Електрик',
    'Чоловік на годину',
    'Столяр',
    'Слюсар',
    'Установка побутової техніки',
    'Інші послуги майстра',
    'Створення AI відео',
  ];

  const tabs = [
    { id: 'general', label: 'Загальна інформація' },
    { id: 'portfolio', label: 'Портфоліо' },
    { id: 'price', label: 'Вартість робіт' },
    { id: 'password', label: 'Змінити пароль' },
  ];

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

      <div className={styles.content}>
        {/* --- Контактні дані --- */}
        <div className={styles.row}>
          <Mail className={styles.icon} />
          <div className={styles.infoBlock}>
            <span className={styles.label}>Контактний email: </span>
            <span className={styles.value}>zloikot.mya@gmail.com</span>
          </div>
        </div>

        <div className={styles.row}>
          <Phone className={styles.icon} />
          <div className={styles.infoBlock}>
            <span className={styles.label}>Контактний телефон: </span>
            <span className={styles.value}>+380980564592</span>
          </div>
        </div>

        {/* --- Особиста інформація --- */}
        <div className={styles.row}>
          <User className={styles.icon} />
          <div className={styles.detailsList}>
            <div className={styles.infoBlock}>
              <span className={styles.label}>Місто: </span>
              <span className={styles.value}>Березань</span>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.label}>Дата народження: </span>
              <button className={styles.addLink}>Додати</button>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.label}>Стать: </span>
              <button className={styles.addLink}>Додати</button>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.label}>Про себе: </span>
              <button className={styles.addLink}>Додати</button>
            </div>
          </div>
        </div>

        <br /> 

        {/* --- Категорії замовлень --- */}
        <div className={styles.row}>
          <Hammer className={styles.icon} />
          <div style={{ width: '100%' }}>
            <h3 className={styles.sectionTitle}>Категорії замовлень</h3>
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
            <h3 className={styles.sectionTitle}>Опис послуг</h3>
            <p className={styles.subText}>0/8 послуг</p>
          </div>
        </div>
      </div>
    </div>
  );
}