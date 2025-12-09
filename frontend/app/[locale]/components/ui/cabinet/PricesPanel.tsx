import React, { use, useEffect, useState } from 'react';
import styles from './PricesPanel.module.css';
import { LoginContext } from '../../context/LoginContext';
import { PriceType, ServicePricesWithCategory } from '@/types/ServicePrices';

const PricesPanel = () => {
  const [activeTab, setActiveTab] = useState('prices');
  const [pricesData, setPricesData] = useState<ServicePricesWithCategory[]>([]);

  useEffect(() => {
    const fetchUserPrices = async () => {
      try {
        const response = await fetch('/api/user/prices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        setPricesData(data);

        console.log('Fetched user prices:', data);
      } catch (error) {
        console.error('Error fetching user prices:', error);
      }
    }
    fetchUserPrices();
  }, []);

  const updatePrices = async () => {
    try {
      const response = await fetch('/api/user/update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricesData),
      });
      const data = await response.json();
      console.log('Updated user prices:', data);
    } catch (error) {
      console.error('Error updating user prices:', error);
    }
  };

  // Данные на основе вашего списка (сгруппированы логически)
  const [categories, setCategories] = useState([
    {
      id: 'electric',
      title: 'Электрика',
      services: [
        { id: 4, name: 'Instalare prize', price: '', unit: PriceType.PerPiece },
        { id: 6, name: 'Panou electric', price: '', unit: PriceType.PerPiece },
        { id: 5, name: 'Reparaţii scurtcircuite', price: '', unit: PriceType.PerHour },
      ]
    },
    {
      id: 'plumbing',
      title: 'Сантехника',
      services: [
        { id: 7, name: 'Instalaţii sanitare', price: '', unit: PriceType.PerVisit },
        { id: 9, name: 'Instalare obiecte sanitare', price: '', unit: PriceType.PerHour },
        { id: 8, name: 'Ţevi şi scurgeri', price: '', unit: PriceType.PerVisit },
      ]
    },
    {
      id: 'furniture',
      title: 'Мебель',
      services: [
        { id: 10, name: 'Asamblare mobilă', price: '', unit: PriceType.PerHour },
        { id: 11, name: 'Reparații mobilier', price: '', unit: PriceType.PerVisit },
        { id: 28, name: 'Evacuare mobilier', price: '', unit: PriceType.PerVisit },
      ]
    },
    {
      id: 'cleaning',
      title: 'Уборка и клининг',
      services: [
        { id: 31, name: 'Curăţenie generală', price: '', unit: PriceType.PerHour },
        { id: 33, name: 'Curăţenie birouri', price: '', unit: PriceType.PerHour },
        { id: 32, name: 'Curăţenie după renovare', price: '', unit: PriceType.PerHour },
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

  const {userLong} = use(LoginContext)

  return (
    
    <div className={styles.container}>
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
                        <option value={PriceType.PerVisit}>за визит</option>
                        <option value={PriceType.PerHour}>за час</option>
                        <option value={PriceType.PerPiece}>за шт.</option>
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
      )}
    </div>
  );
};

export default PricesPanel;