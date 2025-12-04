import React, { useState } from 'react';
import styles from './PricesPanel.module.css';

const PricesPanel = () => {
  const [activeTab, setActiveTab] = useState('prices');

  // Данные на основе вашего списка (сгруппированы логически)
  const [categories, setCategories] = useState([
    {
      id: 'electric',
      title: 'Электрика',
      services: [
        { id: 4, name: 'Instalare prize', price: '', unit: 'за шт.' },
        { id: 6, name: 'Panou electric', price: '', unit: 'за шт.' },
        { id: 5, name: 'Reparaţii scurtcircuite', price: '', unit: 'за час' },
      ]
    },
    {
      id: 'plumbing',
      title: 'Сантехника',
      services: [
        { id: 7, name: 'Instalaţii sanitare', price: '', unit: 'за услугу' },
        { id: 9, name: 'Instalare obiecte sanitare', price: '', unit: 'за шт.' },
        { id: 8, name: 'Ţevi şi scurgeri', price: '', unit: 'за п.м.' },
      ]
    },
    {
      id: 'furniture',
      title: 'Мебель',
      services: [
        { id: 10, name: 'Asamblare mobilă', price: '', unit: 'за час' },
        { id: 11, name: 'Reparații mobilier', price: '', unit: 'за услугу' },
        { id: 28, name: 'Evacuare mobilier', price: '', unit: 'за услугу' },
      ]
    },
    {
      id: 'cleaning',
      title: 'Уборка и клининг',
      services: [
        { id: 31, name: 'Curăţenie generală', price: '', unit: 'за м²' },
        { id: 33, name: 'Curăţenie birouri', price: '', unit: 'за м²' },
        { id: 32, name: 'Curăţenie după renovare', price: '', unit: 'за м²' },
      ]
    }
  ]);

  // Обновление цены
  const handlePriceChange = (catId, serviceId, newPrice) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        services: cat.services.map(svc => 
          svc.id === serviceId ? { ...svc, price: newPrice } : svc
        )
      };
    }));
  };

  // Обновление единиц измерения
  const handleUnitChange = (catId, serviceId, newUnit) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        services: cat.services.map(svc => 
          svc.id === serviceId ? { ...svc, unit: newUnit } : svc
        )
      };
    }));
  };

  return (
    <div className={styles.container}>
      {/* Навигация */}

      <div className={styles.content}>
        <div className={styles.headerBlock}>
          <h2 className={styles.title}>Стоимость работ</h2>
          <p className={styles.subtitle}>
            Укажите цены для категорий, на которые вы подписаны. Заказчики видят "от ...", поэтому указывайте минимальную стоимость.
          </p>
        </div>

        <div className={styles.listContainer}>
          {categories.map((category) => (
            <div key={category.id} className={styles.categoryBlock}>
              <h3 className={styles.categoryTitle}>{category.title}</h3>
              
              <div className={styles.servicesGrid}>
                {category.services.map((service) => (
                  <div key={service.id} className={styles.serviceRow}>
                    
                    {/* Название услуги (слева) */}
                    <div className={styles.serviceNameBlock}>
                      <span className={styles.serviceName}>{service.name}</span>
                    </div>

                    {/* Поля ввода (справа) */}
                    <div className={styles.priceControls}>
                      <div className={styles.inputGroup}>
                        <span className={styles.currencyLabel}>от</span>
                        <input 
                          type="number" 
                          placeholder="0" 
                          className={styles.priceInput}
                          value={service.price}
                          onChange={(e) => handlePriceChange(category.id, service.id, e.target.value)}
                        />
                        <span className={styles.currencySymbol}>RON</span>
                      </div>

                      <select 
                        className={styles.unitSelect}
                        value={service.unit}
                        onChange={(e) => handleUnitChange(category.id, service.id, e.target.value)}
                      >
                        <option value="за услугу">за услугу</option>
                        <option value="за час">за час</option>
                        <option value="за м²">за м²</option>
                        <option value="за п.м.">за п.м.</option>
                        <option value="за шт.">за шт.</option>
                      </select>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footerActions}>
          <button className={styles.orangeButton}>Сохранить прайс-лист</button>
        </div>

      </div>
    </div>
  );
};

export default PricesPanel;