import React, { useState } from 'react';
import { X } from 'lucide-react';
import styles from './ProDashboard.module.css';

export default function PersonalDataEdit({ onSave, onCancel, initialData }) {
  // Инициализация состояния (в реальности данные придут из пропса initialData)
  const [formData, setFormData] = useState({
    city: initialData?.city || 'Тимишоара',
    birthDate: initialData?.birthDate !== "0001-01-01" ? initialData?.birthDate : '',
    gender: initialData?.gender || '', // 'male', 'female'
    about: initialData?.about || ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Личная информация</h3>
          <button onClick={onCancel} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.formScroll}>
          
          {/* Город */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Город проживания</label>
            <input 
              type="text" 
              className={styles.input} 
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Введите город"
            />
          </div>

          {/* Дата рождения */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Дата рождения</label>
            <input 
              type="date" 
              className={styles.input} 
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
            />
          </div>

          {/* Пол (Кнопки-переключатели) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Пол</label>
            <div className={styles.genderSwitch}>
              <button 
                className={`${styles.genderBtn} ${formData.gender === 'male' ? styles.genderBtnActive : ''}`}
                onClick={() => handleChange('gender', 'male')}
              >
                Мужской
              </button>
              <button 
                className={`${styles.genderBtn} ${formData.gender === 'female' ? styles.genderBtnActive : ''}`}
                onClick={() => handleChange('gender', 'female')}
              >
                Женский
              </button>
            </div>
          </div>

          {/* О себе */}
          <div className={styles.formGroup}>
            <label className={styles.label}>О себе</label>
            <textarea 
              className={styles.textarea} 
              rows={5}
              placeholder="Расскажите о своем опыте, инструментах и подходе к работе..."
              value={formData.about}
              onChange={(e) => handleChange('about', e.target.value)}
            />
            <div className={styles.charCount}>
              Рекомендуем написать не менее 100 символов
            </div>
          </div>

        </div>

        <div className={styles.modalActions}>
          <button onClick={() => onSave(formData)} className={styles.saveBtnFull}>
            Сохранить изменения
          </button>
          <button onClick={onCancel} className={styles.cancelBtn}>
            Отмена
          </button>
        </div>

      </div>
    </div>
  );
}