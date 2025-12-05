import React, { useState } from 'react';
import styles from './Earnings.module.css';

const EarningsPage = () => {
  // Данные для графика (6 месяцев)
  const chartData = [
    { month: 'Янв', amount: 12500, height: '40%' },
    { month: 'Фев', amount: 18200, height: '60%' },
    { month: 'Мар', amount: 15400, height: '50%' },
    { month: 'Апр', amount: 24000, height: '80%' },
    { month: 'Май', amount: 9800,  height: '30%' },
    { month: 'Июн', amount: 28500, height: '95%' },
  ];

  // История заказов
  const [transactions] = useState([
    {
      id: 101,
      title: 'Ремонт проводки в офисе',
      desc: 'Полная замена розеток в переговорной комнате, установка нового щитка и диагностика сети.',
      date: '15 июня 2024',
      amount: 4500,
      status: 'completed'
    },
    {
      id: 102,
      title: 'Установка кондиционера',
      desc: 'Монтаж сплит-системы, штробление стены под трассу, вакуумация и запуск.',
      date: '12 июня 2024',
      amount: 3200,
      status: 'completed'
    },
    {
      id: 103,
      title: 'Сборка мебели IKEA',
      desc: 'Сборка двух шкафов ПАКС и комода. Вынос упаковки. Работа заняла 4 часа.',
      date: '10 июня 2024',
      amount: 1800,
      status: 'completed'
    },
  ]);

  // Функция обрезки текста
  const truncate = (str, n) => {
    return (str.length > n) ? str.slice(0, n-1) + '...' : str;
  };

  return (
    <div className={styles.container}>
      
      {/* Заголовок и Баланс */}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Мои доходы</h1>
        <div className={styles.balanceCard}>
          <span className={styles.balanceLabel}>Доступно к выводу</span>
          <div className={styles.balanceValue}>9 500 ₴</div>
        </div>
      </div>

      {/* График доходов */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h3 className={styles.sectionTitle}>Статистика за полгода</h3>
          <span className={styles.periodBadge}>2024</span>
        </div>
        
        <div className={styles.barChart}>
          {chartData.map((item, index) => (
            <div key={index} className={styles.barColumn}>
              <div className={styles.barWrapper}>
                <div 
                  className={styles.barFill} 
                  style={{ height: item.height }}
                >
                  <span className={styles.tooltip}>{item.amount} ₴</span>
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
                  <span className={styles.transAmount}>+{item.amount} ₴</span>
                </div>
                <p className={styles.transDesc}>
                  {truncate(item.desc, 80)}
                </p>
                <div className={styles.transMeta}>
                  <span>Заказ #{item.id}</span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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