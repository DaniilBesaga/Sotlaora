'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ProOrders.module.css';
import OrderLocation from './OrderLocation';
import ProDashboard from './ProDashboard';
import { LoginContext } from '../../context/LoginContext';
import OrderStatusBadge from './OrderStatusBadge';
import ChatList from './ChatList';
import EarningsPage from './Earnings';
import NotificationsPage from './NotificationsPage';
import { OrderDTO } from '@/types/Order';
import { ChevronRight, ShieldAlert } from 'lucide-react';

export default function ProOrders(){

  const {authenticated, userLong, authorizedFetch} = use(LoginContext);

  const [loading, setLoading] = useState(true);
  const [ordersData, setOrdersData] = useState<OrderDTO[]>([]);

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await authorizedFetch('http://localhost:5221/api/user/get-all-orders')
        const data = await res.json();
        setOrdersData(data);console.log("order" , data)
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
    
    if (authenticated === 'authenticated' && userLong !== undefined) {
        
        fetchOrders()
        setLoading(false);
      }
  }, [userLong]);

  const quick = [
    { key: 'orders', label: 'Заказы', icon: '🧾', count: 4, href: '#orders' },
    { key: 'subscriptions', label: 'Подписки', icon: '🔔', count: 2, href: '#subscriptions' },
    { key: 'messages', label: 'Сообщения', icon: '💬', count: 3, href: '/cabinet/messages' },
    { key: 'earnings', label: 'Заработок', icon: '💵', count: null, href: '#earnings' },
    { key: 'settings', label: 'Настройки', icon: '⚙️', count: null, href: '#settings' },
  ];

  const [activeSection, setActiveSection] = useState('orders');
  const [activeTab, setActiveTab] = useState('inwork');

  const handleChangeTab = (tab: string) => {
    setActiveSection(tab);
  }

  // Filter orders based on status
  const activeOrders = ordersData.filter(o => o.status === 'Active' || o.status === 'Assigned');
  const completedOrders = ordersData.filter(o => o.status === 'Completed');

  return ( (authenticated === 'loading' && loading && !userLong) ? <div>Loading...</div> :
    <div className={styles.page}>
      <div className={styles.container}>
        {/* --- NEW: Verification Banner --- */}
        {!userLong?.verifiedIdentity && ( // Only show if not verified
          <div className={styles.verificationAlert}>
            <div className={styles.alertContent}>
              <div className={styles.alertIconBox}>
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className={styles.alertTitle}>Подтвердите личность</h4>
                <p className={styles.alertText}>
                  Загрузите фото документов, чтобы повысить доверие и получать больше заказов.
                </p>
              </div>
            </div>
            <Link href="/verification" className={styles.verifyButton}>
              Начать
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
        <header className={styles.headerCard}>
          <img src={userLong?.imageRef} alt="avatar" className={styles.avatar} />
          <div className={styles.headerInfo}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div className={styles.hName}>{userLong?.userName}</div>
                <div className={styles.hMeta}>ID: <strong style={{color:'#374151'}}>{userLong?.id}</strong></div>
              </div>
            </div>

            <div className={styles.badgeList}>
              <span className={styles.badge}>{userLong?.location}</span>
              {userLong?.phoneNumber && <span className={styles.badge}>{userLong?.phoneNumber}</span>}
            </div>
          </div>
        </header>

        {activeSection === 'orders' && (
          <main className={styles.main}>
            <div className={styles.topbarRow}>
              <h1 className={styles.h1}>Заказы</h1>
            </div>

            <nav className={styles.tabs} role="tablist" aria-label="Навигация заказов">
              <button
                role="tab"
                className={`${styles.tab} ${activeTab==='inwork'?styles.active:''}`}
                onClick={() => setActiveTab('inwork')}
              >
                В процессе
              </button>
              <button
                role="tab"
                className={`${styles.tab} ${activeTab==='proposals'?styles.active:''}`}
                onClick={() => setActiveTab('proposals')}
              >
                Предложения
              </button>
              <button
                role="tab"
                className={`${styles.tab} ${activeTab==='search'?styles.active:''}`}
                onClick={() => setActiveTab('search')}
              >
                Поиск заказов
              </button>
              <button
                role="tab"
                className={`${styles.tab} ${activeTab==='all'?styles.active:''}`}
                onClick={() => setActiveTab('all')}
              >
                Все заказы
              </button>
            </nav>

            <section className={userLong?.proSubcategories.length === 0 ? styles.emptyNotice : styles.contentCard}>
            {userLong?.proSubcategories.length === 0 ? (
              <div className={styles.emptyNotice} role="status" aria-live="polite">
                <div className={styles.emptyNoticeRow}>
                  <div className={styles.emptyContent}>
                    <p className={styles.emptyText}>
                      Пока вы не укажете категории и подкатегории, мы не сможем отправлять вам релевантные заказы.
                      Перейдите в <a href="/cabinet/categories-selector" className={styles.infoLink}>настройки категорий</a> и отметьте те услуги, которые вы выполняете.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'inwork' && (
                  <OrdersGrid items={activeOrders} emptyText="В работе нет заказов" />
                )}

                {activeTab === 'proposals' && (
                  <OrdersGrid items={[]} emptyText="У вас еще нет предложений" />
                )}

                {activeTab === 'search' && (
                  <OrdersGrid items={ordersData} emptyText="Новых заказов не найдено" />
                )}

                {activeTab === 'all' && (
                  <OrdersGrid items={ordersData} emptyText="Нет заказов" />
                )}
              </>
            )}
          </section>

          </main>
        )}

        {activeSection === 'settings' && <ProDashboard />}
        {activeSection === 'subscriptions' && <NotificationsPage />}

        <aside className={styles.quickNav} aria-label="Быстрая навигация">
          <div className={styles.quickCard}>
            {quick.map(item => (
              <Link key={item.key} href={item.href} className={styles.qItem} onClick={()=>handleChangeTab(item.key)}>
                <div className={styles.qLeft} aria-hidden>{item.icon}</div>
                <div className={styles.qCenter}>
                  <div className={styles.qLabel}>{item.label}</div>
                  {item.count != null && <div className={styles.qSub}>{item.count} новых</div>}
                </div>
                <div className={styles.qRight} aria-hidden>›</div>
              </Link>
            ))}

            <div className={styles.divider} />

            <Link href="#support" className={styles.support}>🛡️ Безопасность и помощь</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function OrdersGrid({ items, emptyText }: { items: OrderDTO[], emptyText: string }) {
  if (!items || items.length === 0) {
    return <div className={styles.empty}>{emptyText}</div>;
  }

  return (
    <div className={styles.list}>
      {items.map((it: OrderDTO) => (
        <motion.article key={it.id} className={styles.card} whileHover={{ y: -6 }}>
          <div className={styles.cardMedia}>
            <div className={styles.mainThumb}>
              <img src={it.imageFileRefs?.[0] ?? '/images/placeholder.jpg'} alt={it.title} />
              <OrderStatusBadge status={it.status} />
            </div>
            {/* {it.imageFileRefs && it.imageFileRefs.length > 1 && (
              <div className={styles.thumbRow}>
                {it.imageFileRefs.slice(0, 3).map((src: string, i: number) => (
                  <div key={i} className={styles.thumb}>
                    <img src={src} alt={`${it.title} ${i+1}`} />
                  </div>
                ))}
                {it.imageFileRefs.length > 3 && (
                  <div className={styles.moreThumb}>+{it.imageFileRefs.length - 3}</div>
                )}
              </div>
            )} */}
          </div>

          <div className={styles.cardBody}>
            <div className={styles.cardHeadRow}>
              <h3 className={styles.cardTitle} title={it.title}>{it.title}</h3>
              <div className={styles.cardMeta}>{it.location?.city || 'N/A'} · {it.deadlineDate ? new Date(it.deadlineDate).toLocaleDateString() : 'Не срочно'}</div>
            </div>

            {it.imageFileRefs && it.imageFileRefs.length > 0 && (
              <div className={styles.thumbStrip} role="list" aria-label="Фото заказа">
                {it.imageFileRefs.map((src: string, i: number) => (
                  <div className={styles.thumbItem} role="listitem" key={i}>
                    <img src={src} alt={`${it.title} фото ${i+1}`} />
                  </div>
                ))}
              </div>
            )}

            <p className={styles.cardDesc}>{it.description}</p>

            <div className={styles.metaRow}>
              <div className={styles.tags}>
                {it.subcategories.map((t) => <span key={t.id} className={styles.chip}>Категория {t.title}</span>)}
              </div>

              <div className={styles.locationWrap}>
                <OrderLocation type={it.location?.locationType} />
              </div>
            </div>
          </div>

          <div className={styles.cardActions}>
            <button className={styles.ghost}>Чат</button>
            <button className={styles.primary}>Откликнуться</button>
            <button className={styles.secondary}>Детали</button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
