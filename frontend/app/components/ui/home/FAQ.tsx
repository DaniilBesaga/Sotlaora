'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.css';

const faqData = [
  {
    question: "Как зарегистрироваться на сайте?",
    answer: "Для регистрации нажмите кнопку 'Создать аккаунт' и заполните форму с вашим email и паролем."
  },
  {
    question: "Как изменить пароль?",
    answer: "Перейдите в настройки аккаунта и выберите 'Изменить пароль', после чего следуйте инструкциям."
  },
  {
    question: "Как защищаются мои данные?",
    answer: "Все данные шифруются с использованием современных стандартов SSL/TLS и хранятся в защищенной базе данных."
  },
  {
    question: "Что делать при подозрении на взлом?",
    answer: "Немедленно свяжитесь с нашей службой поддержки и смените пароль."
  },
  {
    question: "Можно ли удалить аккаунт?",
    answer: "Да, вы можете удалить аккаунт в настройках. После этого все ваши данные будут удалены."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <h3 className={styles.title}>Ответы на часто задаваемые вопросы</h3>
      <div className={styles.faqList}>
        {faqData.map((item, index) => (
          <div key={index} className={styles.faqItem}>
            <button
              className={styles.question}
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
            >
              {item.question}
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
                  <p className={styles.answer}>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
