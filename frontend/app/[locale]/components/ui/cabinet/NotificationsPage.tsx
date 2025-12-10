import React, { use, useEffect, useState } from 'react';
import styles from './NotificationsPage.module.css';
import { LoginContext } from '../../context/LoginContext';

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
    },
    {
      id: 5,
      type: 'urgent', // СРОЧНОЕ (Красное)
      title: 'Подтвердите выезд к клиенту',
      message: 'Заказ #3991102 на завтра. Клиент ждет подтверждения, иначе заказ будет передан другому мастеру через 30 минут.',
      time: 'Только что',
      isUnread: true,
      meta: {
        orderId: '3991102'
      }
    },
    {
      id: 6,
      type: 'setup_required', // НАПОМИНАНИЕ О НАСТРОЙКЕ (Оранжевое/Предупреждение)
      title: 'Вы не выбрали категории услуг',
      message: 'Ваш профиль не виден заказчикам. Чтобы получать заказы, укажите, какие услуги вы выполняете.',
      time: '1 час назад',
      isUnread: true,
    }
  ]);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const response = await authorizedFetch('http://localhost:5221/api/notification', {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data)
        }
      } catch (error) {
        console.error('Ошибка при загрузке уведомлений:', error);
      }
    };

    fetchAllNotifications();
  }, []);

  const { authorizedFetch } = use(LoginContext);

  const markAllRead = async ()=>{
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
    try {
      const response = await authorizedFetch('http://localhost:5221/api/notification/read-all', {
        method: 'PATCH',
      });
      if(response.ok){
        setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса на отметку всех уведомлений как прочитанных:', error);
    }
  }

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
      case 'urgent':
        return (
          <div className={`${styles.iconBox} ${styles.iconUrgent}`}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );

      // НОВЫЙ ТИП: Настройка (Список с восклицанием или шестеренка)
      case 'setup_required':
        return (
          <div className={`${styles.iconBox} ${styles.iconSetup}`}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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

                {item.type === 'urgent' && (
                    <>
                      <button className={styles.btnDanger}>Подтвердить</button>
                      <button className={styles.btnSecondary}>Связаться</button>
                    </>
                )}

                {item.type === 'setup_required' && (
                    <button className={styles.btnPrimary}>Выбрать категории</button>
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