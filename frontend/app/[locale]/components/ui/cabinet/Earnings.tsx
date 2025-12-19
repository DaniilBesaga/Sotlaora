import React, { useState, useEffect, useMemo, use } from 'react';
import styles from './Earnings.module.css';
import { LoginContext } from '../../context/LoginContext';
// Assuming OrderDTO is in your types folder, but I will define it below for context
// import { OrderDTO } from '@/types/Order'; 

// --- Types Definition (Based on your input) ---
export type OrderStatus = 'Active' | 'Assigned' | 'Discussion' | 'InProgress' | 'Completed' | 'Paid' | 'WaitingForConfirmationByClient' | 'CancelledByClient' | 'CancelledByPro' | 'WaitingForPayment';

export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
}

export interface OrderDTO {
    id: number;
    title: string;
    description: string;
    postedAt: Date | string; // API usually returns string, interface might say Date
    price: number;
    location: Location;
    additionalComment: string;
    deadlineDate?: Date | string;
    desiredTimeStart?: string; 
    desiredTimeEnd?: string;
    subcategories: number[];
    imageFileRefs: string[];
    imageFileIds: number[];
    status: OrderStatus;
    clientId: number;
    proId: number;
}

// --- Component ---

const EarningsPage = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Using React 19 'use' API as per your snippet
  const { authorizedFetch } = use(LoginContext);

  // 1. Fetch Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await authorizedFetch('http://localhost:5221/api/order/allProOrders', {
          method: 'GET',
        });
        
        if (res.ok) {
          const data: OrderDTO[] = await res.json();
          setOrders(data);
        } else {
            console.error("Error fetching orders:", res.status);
        }
      } catch (error) {
        console.error("Failed to load earnings", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [authorizedFetch]);

  // 2. Calculate Total Balance
  // We only count orders that are 'Paid' or 'Completed'
  const totalBalance = useMemo(() => {
    return orders.reduce((sum, order) => {
      if (['Paid', 'Completed'].includes(order.status)) {
        return sum + order.price;
      }
      return sum;
    }, 0);
  }, [orders]);

  // 3. Prepare Chart Data (Dynamic Last 6 Months)
  const chartData = useMemo(() => {
    const today = new Date();
    const result = [];
    
    // Generate buckets for the last 6 months (including current)
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = d.toLocaleDateString('ru-RU', { month: 'short' }); // "Янв", "Фев"
        // Capitalize first letter
        const label = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        
        result.push({
            monthObj: d, // Store date object for comparison
            monthLabel: label,
            amount: 0,
            height: '0%'
        });
    }

    // Aggregate Data from API
    orders.forEach(order => {
        // Only count earnings
        if (!['Paid', 'Completed'].includes(order.status)) return;

        const orderDate = new Date(order.postedAt);
        
        // Find which bucket this order belongs to
        const bucket = result.find(r => 
            r.monthObj.getMonth() === orderDate.getMonth() && 
            r.monthObj.getFullYear() === orderDate.getFullYear()
        );

        if (bucket) {
            bucket.amount += order.price;
        }
    });

    // Calculate Heights based on the Maximum value found
    const maxVal = Math.max(...result.map(d => d.amount));

    return result.map(item => ({
        month: item.monthLabel,
        amount: item.amount,
        // If maxVal is 0, height is 0. Otherwise calculate percentage (max height 95%)
        height: maxVal > 0 ? `${(item.amount / maxVal) * 95}%` : '0%' 
    }));

  }, [orders]);

  // 4. Sort and Format Transactions for the List
  const transactions = useMemo(() => {
    return [...orders]
      // Sort: Newest first
      .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
      // Map to view model
      .map(order => ({
        id: order.id,
        title: order.title,
        desc: order.description,
        amount: order.price,
        // Format date: "15 июня 2024"
        date: new Date(order.postedAt).toLocaleDateString('ru-RU', {
             day: 'numeric', month: 'long', year: 'numeric'
        }),
        status: order.status
      }));
  }, [orders]);

  // Helper
  const truncate = (str: string, n: number) => {
    if (!str) return '';
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      
      {/* Заголовок и Баланс */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Мои доходы</h1>
        <div className={styles.balanceCard}>
          <span className={styles.balanceLabel}>Доступно к выводу</span>
          <div className={styles.balanceValue}>
            {totalBalance.toLocaleString('ru-RU')} ₴
          </div>
        </div>
      </div>

      {/* График доходов */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h3 className={styles.sectionTitle}>Статистика за полгода</h3>
          <span className={styles.periodBadge}>{new Date().getFullYear()}</span>
        </div>
        
        <div className={styles.barChart}>
          {chartData.map((item, index) => (
            <div key={index} className={styles.barColumn}>
              <div className={styles.barWrapper}>
                <div 
                  className={styles.barFill} 
                  style={{ height: item.height }}
                >
                  {/* Only show tooltip if amount > 0 */}
                  {item.amount > 0 && (
                      <span className={styles.tooltip}>{item.amount} ₴</span>
                  )}
                </div>
              </div>
              <span className={styles.monthLabel}>{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* История операций */}
      <div className={styles.historySection}>
        <h3 className={styles.sectionTitle}>История начислений</h3>
        
        {transactions.length === 0 ? (
            <p style={{ color: '#888', padding: '20px' }}>История операций пуста</p>
        ) : (
            <div className={styles.transactionList}>
            {transactions.map((item) => (
                <div key={item.id} className={styles.transCard}>
                <div className={styles.transIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </div>
                
                <div className={styles.transContent}>
                    <div className={styles.transHeader}>
                    <span className={styles.transTitle}>{item.title}</span>
                    <span 
                        className={styles.transAmount}
                        style={{ color: ['Paid', 'Completed'].includes(item.status) ? '#22c55e' : '#64748b' }}
                    >
                        {['Paid', 'Completed'].includes(item.status) ? '+' : ''}{item.amount} ₴
                    </span>
                    </div>
                    <p className={styles.transDesc}>
                        {truncate(item.desc, 80)}
                    </p>
                    <div className={styles.transMeta}>
                    <span>Заказ #{item.id}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                    <span>•</span>
                    {/* Optional: Show status badge text */}
                    <span style={{ fontSize: '0.85em', opacity: 0.8 }}>{item.status}</span>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {/* Блок вывода средств */}
      <div className={styles.withdrawSection}>
        <div className={styles.withdrawCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Вывод средств на карту</span>
            <div className={styles.cardLogos}>
              {/* Visa Logo SVG */}
              <svg className={styles.payLogo} viewBox="0 0 36 36" fill="none">
                 <path fill="currentColor" d="M14.5 24H12l1.6-10h2.5l-1.6 10zm11.3 0l-2.5-10h2.6l1.5 7.4 3.6-7.4h2.7l-5.6 12.6-2.3-2.6zm-8.8-10l-3.3 8.3-.3-1.6c-.5-1.7-2-3.4-3.8-4.4l2.5 9.8h2.6l3.9-10h-2.5v-.1z"/>
              </svg>
              {/* MC Logo Simple */}
              <div className={styles.mcCircles}>
                <div className={styles.circleRed}></div>
                <div className={styles.circleYellow}></div>
              </div>
            </div>
          </div>
          
          <div className={styles.cardInputRow}>
            <div className={styles.selectedCard}>
              <div className={styles.chip}></div>
              <span className={styles.cardLast4}>•••• 4812</span>
            </div>
            <button className={styles.withdrawBtn}>
              Вывести деньги
            </button>
          </div>
          <p className={styles.secureText}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:4}}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Платежи защищены SSL шифрованием
          </p>
        </div>
      </div>

    </div>
  );
};

export default EarningsPage;