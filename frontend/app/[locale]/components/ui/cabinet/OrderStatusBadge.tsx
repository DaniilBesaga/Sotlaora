import { i } from "motion/react-client";

import styles from './ProOrders.module.css';
export default function OrderStatusBadge({ status = 'pending' }) {
  const s = {
    active: { label: 'В работе', color: 'active' },
    pending: { label: 'В ожидании', color: 'pending' },
    done: { label: 'Выполнено', color: 'done' },
    cancelled: { label: 'Отменён', color: 'cancelled' },
  }[status] || { label: status, color: 'pending' };

  return (
    <div className={`${styles.statusBadge} ${styles['status_' + s.color]}`} role="status" aria-label={s.label}>
      {s.color === 'active' && (
        <svg className={styles.statusIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M21 13v6a1 1 0 0 1-1 1h-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 11V7a1 1 0 0 1 1-1h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 21l8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 13l8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}

      {s.color === 'pending' && (
        <svg className={styles.statusIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 8v5l3 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )}

      {s.color === 'done' && (
        <svg className={styles.statusIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      {s.color === 'cancelled' && (
        <svg className={styles.statusIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}

      <span className={styles.statusText}>{s.label}</span>
    </div>
  );
}