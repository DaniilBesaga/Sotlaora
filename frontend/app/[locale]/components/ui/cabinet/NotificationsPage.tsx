import React, { useState } from 'react';
import styles from './NotificationsPage.module.css';

const NotificationsPage = () => {
  // Имитация данных
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'assigned', // Вас выбрали исполнителем
      title: 'Вас выбрали исполнителем!',
      message: 'Заказ #3831851 «Ремонт стиральной машины». Клиент ждет связи.',
      time: '2 мин назад',
      isUnread: true,
      meta: {
        orderId: '3831851',
        clientName: 'Алексей'
      }
    },
    {
      id: 2,
      type: 'new_order', // Новый заказ в категории
      title: 'Новый заказ рядом',
      message: 'В категории «Сантехника» появился заказ на ул. Ленина. Бюджет 1500 ₴.',
      time: '15 мин назад',
      isUnread: true,
      meta: {
        category: 'Plumbing'
      }
    },
    {
      id: 3,
      type: 'completed', // Заказ выполнен
      title: 'Заказ завершен',
      message: 'Поздравляем! Заказ #4102290 успешно закрыт. Средства зачислены на баланс.',
      time: 'Вчера',
      isUnread: false,
      meta: {
        amount: '+ 2000 ₴'
      }
    },
    {
      id: 4,
      type: 'system', // Просто системное
      title: 'Обновление правил',
      message: 'Мы обновили условия работы сервиса. Пожалуйста, ознакомьтесь.',
      time: '3 дня назад',
      isUnread: false,
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  // Рендер иконки в зависимости от типа
  const renderIcon = (type) => {
    switch (type) {
      case 'assigned':
        return (
          <div className={`${styles.iconBox} ${styles.iconAssigned}`}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'new_order':
        return (
          <div className={`${styles.iconBox} ${styles.iconNew}`}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
      case 'completed':
        return (
          <div className={`${styles.iconBox} ${styles.iconSuccess}`}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${styles.iconBox} ${styles.iconSystem}`}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Уведомления</h1>
        <button className={styles.markReadBtn} onClick={markAllRead}>
          Прочитать все
        </button>
      </header>

      <div className={styles.list}>
        {notifications.map((item) => (
          <div 
            key={item.id} 
            className={`${styles.card} ${item.isUnread ? styles.unread : ''}`}
          >
            {/* Левая часть: Иконка */}
            <div className={styles.leftCol}>
              {renderIcon(item.type)}
            </div>

            {/* Центр: Контент */}
            <div className={styles.contentCol}>
              <div className={styles.topRow}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <span className={styles.time}>{item.time}</span>
              </div>
              
              <p className={styles.itemMessage}>{item.message}</p>

              {/* Условный рендеринг кнопок */}
              <div className={styles.actionsRow}>
                
                {item.type === 'assigned' && (
                  <>
                    <button className={styles.btnPrimary}>Чат с клиентом</button>
                    <button className={styles.btnSecondary}>Открыть заказ</button>
                  </>
                )}

                {item.type === 'new_order' && (
                  <button className={styles.btnSecondary}>Посмотреть</button>
                )}

                {item.type === 'completed' && item.meta?.amount && (
                  <span className={styles.amountBadge}>{item.meta.amount}</span>
                )}
                
              </div>
            </div>

            {/* Индикатор непрочитанного (синяя точка) */}
            {item.isUnread && <div className={styles.unreadDot} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;