import React, { useState } from 'react';
import styles from './ProDashboard.module.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ServiceDescriptionEdit() {
  const [aboutMe, setAboutMe] = useState('');
  
  // Данные категорий и услуг
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Домашний мастер',
      isOpen: true,
      services: [
        { id: 's1', name: 'Сантехник', checked: true, desc: '' },
        { id: 's2', name: 'Электрик', checked: false, desc: '' },
        { id: 's3', name: 'Муж на час', checked: false, desc: '' },
        { id: 's4', name: 'Столяр', checked: false, desc: '' },
        { id: 's5', name: 'Слесарь', checked: false, desc: '' },
        { id: 's6', name: 'Установка бытовой техники', checked: false, desc: '' },
        { id: 's7', name: 'Другие услуги мастера', checked: false, desc: '' },
      ]
    }
  ]);

  const toggleCategory = (id) => {
    setCategories(cats => cats.map(c => c.id === id ? { ...c, isOpen: !c.isOpen } : c));
  };

  const toggleService = (catId, serviceId) => {
    setCategories(cats => cats.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        services: c.services.map(s => s.id === serviceId ? { ...s, checked: !s.checked } : s)
      };
    }));
  };

  const updateServiceDesc = (catId, serviceId, text) => {
    setCategories(cats => cats.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        services: c.services.map(s => s.id === serviceId ? { ...s, desc: text } : s)
      };
    }));
  };

  return (
    <div className={styles.editContainer}>
      {/* Заголовок */}
      <h2 className={styles.pageTitle}>Описание услуг</h2>
      
      <p className={styles.helperTextSmall}>
        Добавьте описание о себе и расскажите подробнее про каждую из своих услуг (будет отображаться для заказчиков на страницах категорий услуг).
      </p>
      <p className={styles.helperTextSmall}>
        Рассказ о себе — это ваша визитка: опишите свой опыт работы и сильные качества, расскажите о наличии профессионального инструмента, дипломов, автомобиля, укажите специфическую информацию, присущую вашей специализации.
      </p>

      {/* Секция "О себе" */}
      <div className={styles.sectionBlock}>
        <label className={styles.labelSimple}>О себе</label>
        <div className={styles.textareaWrapper}>
          <textarea
            className={styles.textareaMain}
            placeholder="Напишите о себе по крайней мере 230 символов, чтобы выделиться в списке мастеров"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
          />
          <div className={styles.charCount}>Не менее 230 символов</div>
        </div>
      </div>

      <h3 className={styles.subHeader}>Вы работаете в {categories.length} категориях</h3>

      {/* Аккордеон категорий */}
      {categories.map(cat => (
        <div key={cat.id} className={styles.categoryGroup}>
          <div className={styles.categoryHeaderClean} onClick={() => toggleCategory(cat.id)}>
            <div className={styles.catHeaderLeft}>
              <div className={styles.catIconCircle}>🛠️</div>
              <div>
                <div className={styles.catTitleBold}>{cat.name}</div>
                <div className={styles.catSubText}>{cat.services.filter(s => s.checked).length}/{cat.services.length} услуг</div>
              </div>
            </div>
            {cat.isOpen ? <ChevronUp size={20} color="#00a046" /> : <ChevronDown size={20} color="#00a046" />}
          </div>

          {cat.isOpen && (
            <div className={styles.servicesGrid}>
              {cat.services.map(service => (
                <div key={service.id} className={styles.serviceItem}>
                  {/* Чекбокс и название */}
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={service.checked} 
                      onChange={() => toggleService(cat.id, service.id)}
                      className={styles.customCheckbox}
                    />
                    <span className={styles.serviceNameText}>{service.name}</span>
                  </label>

                  {/* Выпадающий блок редактирования (появляется только если выбрано) */}
                  {service.checked && (
                    <div className={styles.serviceEditBox}>
                      <textarea
                        className={styles.textareaService}
                        placeholder=""
                        value={service.desc}
                        onChange={(e) => updateServiceDesc(cat.id, service.id, e.target.value)}
                      />
                      <div className={styles.charCountRight}>Не менее 130 символов</div>
                      <button className={styles.saveBtnSmall}>Сохранить</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{marginTop: 30}}>
        <button onClick={() => history.back()} className={styles.backBtnLink}>← Назад в профиль</button>
      </div>
    </div>
  );
}