'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Phone, User, Hammer, AlignLeft, Bell, Trash, Pencil, Check, X } from 'lucide-react';
import styles from './ProDashboard.module.css';
import PortfolioPanel from './Portfolio';
import PricesPanel from './PricesPanel';
import ServiceDescriptionEdit from './ServiceDescription';
import PersonalDataEdit from './PersonalDataEdit';
import CategorySelector from '../auth/CategorySelector';
import { Gender } from '@/types/UserProfile';
import { ProProfileDTO } from '@/types/ProDTO';
// Импортируем компонент для редактирования услуг

export default function ProDashboard() {
  const [activeTab, setActiveTab] = useState('general');
  // Состояние для отслеживания, какая секция редактируется
  const [editingSection, setEditingSection] = useState('');

  const categoriesList = [
    'Сантехник', 'Електрик', 'Муж на час', 'Столяр', 
    'Слесарь', 'Установка бытовой техники', 'Ремонт квартир'
  ];

  const notifications = { emailStatus: true, newOrders: true, smsImportant: false };
  const [notif, setNotif] = useState(notifications);

  const tabs = [
    { id: 'general', label: 'Общая информация' },
    { id: 'portfolio', label: 'Портфолио' },
    { id: 'price', label: 'Стоимость работ' },
  ];

  const [profileData, setProfileData] = useState<ProProfileDTO>({
    city: 'Тимишоара',
    dateOfBirth: '',
    gender: Gender.Unspecified,
    bio: '',
    phoneNumber: '',
    subcategoryDTOs: [],
    totalCount: 0,
    filledSubcategoriesCount: 0
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await fetch('http://localhost:5221/api/user/profileShort', { method: 'GET', credentials: "include" });
      const data = await res.json();
      setProfileData({
        city: data.city || 'Тимишоара',
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender ? Gender[data.gender as keyof typeof Gender] : Gender.Unspecified,
        bio: data.bio || '',
        phoneNumber: data.phoneNumber || '',
        subcategoryDTOs: data.subcategoryDTOs || [],
        totalCount: data.totalCount || 0,
        filledSubcategoriesCount: data.filledSubcategoriesCount || 0
      });
      console.log(data)
    }
    fetchUserProfile();
  }, []);

  // Функция сохранения данных из формы
  const handlePersonalDataSave = async (newData) => {
    const userProfileNew = {
      city: newData.city,
      dateOfBirth: newData.dateOfBirth,
      gender: newData.gender,
      bio: newData.bio,
      phoneNumber: phoneNumber,
    };
    const res = await fetch('http://localhost:5221/api/user/update-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userProfileNew),
      "credentials": "include"
    });
    const result = await res.json();
    if (!res.ok) {
      alert('Ошибка при сохранении данных: ' + (result.message || 'Неизвестная ошибка'));
      return;
    }

    setProfileData(prev => ({ ...prev, ...newData }));

    setEditingSection(null); // Закрываем модальное окно
  };

  function toggle(key) { setNotif(n => ({ ...n, [key]: !n[key] })); }

  // --- Рендеринг режима редактирования ---
  if (editingSection === 'services') {
    return <ServiceDescriptionEdit onBack={() => setEditingSection('')} />;
  }
  
  if (editingSection === 'categories') {
    return <CategorySelector />;
  }

  useEffect(() => {
    setPhoneNumber(profileData.phoneNumber);
  }, [profileData]);

  // Состояния для телефона
  const [phoneNumber, setPhoneNumber] = useState(profileData.phoneNumber);
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [tempPhone, setTempPhone] = useState('');

  const handleEditClick = () => {
    setTempPhone(profileData.phoneNumber); // Копируем текущий номер во временную переменную
    setIsEditingContacts(true);
  };

  const handleSaveClick = async() => {
    const phoneNumber = tempPhone.trim();
    const res = await fetch('http://localhost:5221/api/user/update-phone', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phoneNumber),
      "credentials": "include"
    });
    const result = await res.json();
    if (!res.ok) {
      alert('Ошибка при сохранении данных: ' + (result.message || 'Неизвестная ошибка'));
      return;
    }

    setPhoneNumber(tempPhone);
    setIsEditingContacts(false);
    // Тут можно отправить запрос на сервер
  };

  const handleCancelClick = () => {
    setIsEditingContacts(false); // Просто закрываем
  };

  // Для контактов и личных данных можно сделать отдельные формы, 
  // но пока сделаем просто заглушку или возврат назад
  
  return (
    <div className={styles.container}>
      {/* --- Навігація --- */}
      <div className={styles.tabsHeader}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
          >
            {tab.label}
            {activeTab === tab.id && <span className={styles.activeLine} />}
          </button>
        ))}
      </div>

      {activeTab === 'portfolio' && (<PortfolioPanel />)}
      {activeTab === 'price' && (<PricesPanel />)}

      {activeTab === 'general' && (
        <div className={styles.content}>
          
          {/* --- Контактні дані --- */}
          <section className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.cardTitle}>Контакты</h3>
              
              {/* Если мы НЕ редактируем, показываем карандаш */}
              {!isEditingContacts && (
                <button className={styles.editBtn} onClick={handleEditClick}>
                  <Pencil size={18} />
                </button>
              )}
            </div>

            <div className={styles.row}>
              <Mail className={styles.icon} />
              <div className={styles.infoBlock}>
                <span className={styles.label}>Контактный email: </span>
                {/* Email всегда просто текст */}
                <span className={styles.value}>zloikot.mya@gmail.com</span>
              </div>
            </div>

            <div className={styles.row}>
              <Phone className={styles.icon} />
              <div className={styles.infoBlock}>
                <span className={styles.label}>Контактный телефон: </span>
                
                {isEditingContacts ? (
                  // Режим редактирования
                  <div className={styles.inlineEditGroup}>
                    <input 
                      type="text" 
                      className={styles.inlineInput}
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                    />
                    <button className={styles.saveIconBtn} onClick={handleSaveClick}>
                      <Check size={18} />
                    </button>
                    <button className={styles.cancelIconBtn} onClick={handleCancelClick}>
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  // Режим просмотра
                  <span className={styles.value}>{phoneNumber}</span>
                )}
                
              </div>
            </div>
          </section>

          {editingSection === 'personal' && (
            <PersonalDataEdit 
              initialData={profileData}
              onSave={handlePersonalDataSave}
              onCancel={() => setEditingSection(null)}
            />
          )}
          {/* --- Категорії замовлень --- */}
          <section className={styles.cardSection}>
             <div className={styles.sectionHeader}>
              <h3 className={styles.cardTitle}>Личная информация</h3>
              {/* Кнопка карандаш открывает модалку */}
              <button className={styles.editBtn} onClick={() => setEditingSection('personal')}>
                <Pencil size={18} />
              </button>
            </div>

            <div className={styles.row}>
              <User className={styles.icon} />
              <div className={styles.detailsList}>
                
                <div className={styles.infoBlock}>
                  <span className={styles.label}>Город: </span>
                  <span className={styles.value}>{profileData.city}</span>
                </div>
                
                <div className={styles.infoBlock}>
                  <span className={styles.label}>Дата рождения: </span>
                    {profileData.birthDate && profileData.birthDate !== '0001-01-01T00:00:00' && new Date(profileData.birthDate).getFullYear() > 1 ? (
                    <span className={styles.value}>{new Date(profileData.birthDate).toLocaleDateString()}</span>
                    ) : (
                    /* Кнопка Добавить тоже открывает модалку */
                    <button className={styles.addLink} onClick={() => setEditingSection('personal')}>
                      Добавить
                    </button>
                  )}
                </div>
                
                <div className={styles.infoBlock}>
                  <span className={styles.label}>Пол: </span>
                  {profileData.gender !== Gender.Unspecified ? (
                    <span className={styles.value}>
                      {profileData.gender === Gender.Male ? 'Мужской' : 'Женский'}
                    </span>
                  ) : (
                    <button className={styles.addLink} onClick={() => setEditingSection('personal')}>
                      Добавить
                    </button>
                  )}
                </div>
                <div className={styles.infoBlock}>
                  <span className={styles.label}>О себе: </span>
                  {profileData.bio ? (
                    <p className={styles.bioText}>{profileData.bio}</p>
                  ) : (
                    <button className={styles.addLink} onClick={() => setEditingSection('personal')}>
                      Добавить
                    </button>
                  )}
                </div>

              </div>
            </div>
          </section>

          {/* --- Опис послуг --- */}
          <section className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.cardTitle}>Описание услуг</h3>
              <a className={styles.editBtn} href='/cabinet/orders-categories'>
                <Pencil size={18} />
              </a>
            </div>

            <div className={styles.row}>
              <AlignLeft className={styles.icon} />
              <div>
                <p className={styles.subText}>{profileData.filledSubcategoriesCount}/{profileData.totalCount} услуг заполнено</p>
                <p className={styles.hintText}>Заполните описание, чтобы привлечь больше клиентов.</p>
              </div>
            </div>
          </section>

          <section className={styles.cardSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.cardTitle}>Категории заказов</h3>
              <a className={styles.editBtn} href='/cabinet/categories-selector'>
                <Pencil size={18} />
              </a>
            </div>
            
            <div className={styles.row}>
              <Hammer className={styles.icon} />
              <div style={{ width: '100%' }}>
                <div className={styles.tagsWrapper}>
                  {profileData.subcategoryDTOs.map((cat, index) => (
                    <span key={index} className={styles.tag}>{cat.title}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* --- Настройки уведомлений --- */}
          <section className={styles.cardSection}>
             <div className={styles.sectionHeader}>
              <h3 className={styles.cardTitle}>Настройка уведомлений</h3>
            </div>
            
            <div className={styles.row}>
              <Bell className={styles.icon} />
              <div className={styles.blockBody}>
                <div className={styles.serviceInfo}>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notif.emailStatus} onChange={() => toggle('emailStatus')}
                    />
                    <span className={styles.slider}></span>
                  </label>
                  <span className={styles.serviceName}>Email сообщение о изменениях статусов</span>
                </div>
                
                <div className={styles.serviceInfo}>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={notif.newOrders} onChange={() => toggle('newOrders')}
                    />
                    <span className={styles.slider}></span>
                  </label>
                  <span className={styles.serviceName}>Рассылка новых заказов</span>
                </div>
              </div>
            </div>
          </section>

          {/* Видалення профілю */}
          <section className={`${styles.cardSection} ${styles.dangerZone}`}>
            <div className={styles.row}>
              <Trash className={styles.icon} />
              <div className={styles.blockBody}>
                <div className={styles.sectionTitleSmall}>Удаление профиля</div>
                <div className={styles.deleteRow}>
                  <button className={styles.deleteBtn}>Удалить</button>
                  <div className={styles.delNote}>После удаления все данные будут утеряны.</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}