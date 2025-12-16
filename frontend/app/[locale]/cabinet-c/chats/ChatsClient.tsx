'use client'

import { ChatShortDTO } from "@/types/Chat"
import styles from '../../components/ui/cabinet/ChatList.module.css';

export default function ChatsClient({chats}: {chats: ChatShortDTO[]}) {

  console.log(chats)

    return(
        <div className={styles.container}>
            {/* Заголовок и поиск */}
            <div className={styles.headerRow}>
              <h2 className={styles.pageTitle}>
                Сообщения <span className={styles.counter}>{chats.length}</span>
              </h2>
            {chats.length === 0 && (
                <p className={styles.noChatsMessage}>Нет доступных чатов</p>
            )}
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
                className={`${styles.chatCard} ${chat.unread ? styles.unread : ''}`}
                >
                {/* Аватар */}
                <div className={styles.avatarWrap}>
                  <img src={chat.avatar || '/default-avatar.png'} alt={chat.clientName} className={styles.avatarImg} />
                  <span className={`${styles.statusDot} ${styles.online}`} />
                </div>

                {/* Контент */}
                <div className={styles.content}>
                  <div className={styles.topRow}>
                    <h3 className={styles.name}>{chat.clientName}</h3>
                    <span className={styles.time}>{chat.time}</span>
                  </div>
                  
                  <div className={styles.metaRow}>
                    <span className={styles.orderTag}>#{chat.orderId}</span>
                    <span className={styles.serviceText}>{chat.orderTitle}</span>
                  </div>

                  <p className={styles.messagePreview}>
                    {chat.unread && <span className={styles.unreadDot}>•</span>}
                    {chat.lastMessage}
                  </p>
                </div>

                {/* Кнопка */}
                <button className={styles.actionBtn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
                </div>
              ))}
            </div>
            </div>
    )
}