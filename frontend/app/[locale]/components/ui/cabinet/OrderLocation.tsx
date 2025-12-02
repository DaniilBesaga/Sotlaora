'use client';
import React from 'react';
import styles from './ProOrders.module.css';
import { Home, MapPinHouse, MapPin } from 'lucide-react';

export default function OrderLocation({ type }) {
  const map = {
    client: {
      label: 'У меня',
      icon: <Home size={15} stroke="#0ea5e9" />,
      class: styles.client,
    },

    pro: {
      label: 'У исполнителя',
      icon: <MapPinHouse size={15} stroke="#22c55e" />,
      class: styles.pro,
    },

    onsite: {
      label: 'Выезд / на объект',
      icon: <MapPin size={15} stroke="#f59e0b" />,
      class: styles.onsite,
    },
  };

  const item = map[type] ?? map.client;

  return (
    <div className={`${styles.badge} ${item.class}`}>
      <span className={styles.icon}>{item.icon}</span>
      <span className={styles.label}>{item.label}</span>
    </div>
  );
}
