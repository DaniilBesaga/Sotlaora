'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.css';
import { useTranslations } from 'next-intl';

export default function FAQ() {
  const t = useTranslations('FAQSection');
  const [openIndex, setOpenIndex] = useState(null);

  const keys = ['q1', 'q2', 'q3', 'q4', 'q5']; // ключи вопросов в JSON

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <h3 className={styles.title}>{t('title')}</h3>
      <div className={styles.faqList}>
        {keys.map((key, index) => (
          <div key={index} className={styles.faqItem}>
            <button
              className={styles.question}
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              {t(`items.${key}.question`)}
              <span className={styles.icon}>{openIndex === index ? '-' : '+'}</span>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={styles.answerWrapper}
                >
                  <p className={styles.answer}>{t(`items.${key}.answer`)}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
