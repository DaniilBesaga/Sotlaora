import React, { useState } from 'react';
import styles from './ChatList.module.css';

const ChatList = () => {
  const [chats] = useState([
    {
      id: 1,
      clientName: 'Алексей Смирнов',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      status: 'online',
      orderId: '3831851',
      serviceName: 'Ремонт стиральной машины',
      lastMessage: 'Да, в 14:00 мне подходит. Буду ждать вас.',
      time: '10:42',
      unread: 2,
    },
    {
      id: 2,
      clientName: 'Марина Коваль',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      status: 'offline',
      orderId: '4102290',
      serviceName: 'Уборка после ремонта',
      lastMessage: 'Спасибо большое! Всё блестит.',
      time: 'Вчера',
      unread: 0,
    },
    {
      id: 3,
      clientName: 'Дмитрий Петров',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
      status: 'offline',
      orderId: '3991102',
      serviceName: 'Сборка кухни IKEA',
      lastMessage: 'Здравствуйте, вы сможете приехать со своим инструментом?',
      time: '12 дек',
      unread: 0,
    },
  ]);

  return (
    <div className={styles.container}>
      {/* Заголовок и поиск */}
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>
          Сообщения <span className={styles.counter}>{chats.length}</span>
        </h2>
        
        <div className={styles.searchBlock}>
          <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Поиск..." className={styles.searchInput} />
        </div>
      </div>

      {/* Список чатов */}
      <div className={styles.chatGrid}>
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            className={`${styles.chatCard} ${chat.unread > 0 ? styles.unread : ''}`}
          >
            {/* Аватар (стиль iconWrap) */}
            <div className={styles.avatarWrap}>
              <img src={chat.avatar} alt={chat.clientName} className={styles.avatarImg} />
              <span className={`${styles.statusDot} ${chat.status === 'online' ? styles.online : ''}`} />
            </div>

            {/* Контент */}
            <div className={styles.content}>
              <div className={styles.topRow}>
                <h3 className={styles.name}>{chat.clientName}</h3>
                <span className={styles.time}>{chat.time}</span>
              </div>
              
              <div className={styles.metaRow}>
                <span className={styles.orderTag}>#{chat.orderId}</span>
                <span className={styles.serviceText}>{chat.serviceName}</span>
              </div>

              <p className={styles.messagePreview}>
                {chat.unread > 0 && <span className={styles.unreadDot}>•</span>}
                {chat.lastMessage}
              </p>
            </div>

            {/* Кнопка (стиль stat/btn) */}
            <button className={styles.actionBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;