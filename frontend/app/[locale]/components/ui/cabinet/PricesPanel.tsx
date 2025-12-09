import React, { use, useEffect, useState } from 'react';
import styles from './PricesPanel.module.css';
import { LoginContext } from '../../context/LoginContext';
import { PriceType, ServicePricesWithCategory } from '@/types/ServicePrices';

const PricesPanel = () => {
  const [activeTab, setActiveTab] = useState('prices');
  const [pricesData, setPricesData] = useState<ServicePricesWithCategory[]>([]);
  const {userLong} = use(LoginContext)

  useEffect(() => {
    if(userLong?.proSubcategories.length === 0) {
      return;
    }
    const fetchUserPrices = async () => {
      try {
        const response = await fetch('http://localhost:5221/api/user/prices', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          "credentials": "include"
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
      const response = await fetch('http://localhost:5221/api/user/update-prices', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricesData),
        "credentials": "include"
      });
      const data = await response.json();
      console.log('Updated user prices:', data);
    } catch (error) {
      console.error('Error updating user prices:', error);
    }
  };

  const handlePriceChange = (categoryIndex: number, serviceIndex: number, newPrice: string) => {
    setPricesData(prev => prev.map((cat, cIdx) => {
      if (cIdx !== categoryIndex) return cat;
      return {
        ...cat,
        servicePrices: cat.servicePrices.map((svc, sIdx) => 
          sIdx === serviceIndex ? { ...svc, price: parseFloat(newPrice) || 0 } : svc
        )
      };
    }));
  };

  const handleUnitChange = (categoryIndex: number, serviceIndex: number, newUnit: PriceType) => {
    setPricesData(prev => prev.map((cat, cIdx) => {
      if (cIdx !== categoryIndex) return cat;
      return {
        ...cat,
        servicePrices: cat.servicePrices.map((svc, sIdx) => 
          sIdx === serviceIndex ? { ...svc, priceType: parseInt(newUnit as any) } : svc
        )
      };
    }));
  };

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
            {pricesData.map((category, categoryIndex) => (
              <div key={categoryIndex} className={styles.categoryBlock}>
                <h3 className={styles.categoryTitle}>{category.categoryTitle}</h3>
                
                <div className={styles.servicesGrid}>
                  {category.servicePrices.map((service, serviceIndex) => (
                    <div key={service.subcategoryDTO.id} className={styles.serviceRow}>
                      
                      <div className={styles.serviceNameBlock}>
                        <span className={styles.serviceName}>{service.subcategoryDTO.title}</span>
                      </div>

                      <div className={styles.priceControls}>
                        <div className={styles.inputGroup}>
                          <span className={styles.currencyLabel}>от</span>
                          <input 
                            type="number" 
                            placeholder="0" 
                            className={styles.priceInput}
                            value={service.price || ''}
                            onChange={(e) => handlePriceChange(categoryIndex, serviceIndex, e.target.value)}
                          />
                          <span className={styles.currencySymbol}>RON</span>
                        </div>

                        <select 
                          className={styles.unitSelect}
                          value={service.priceType}
                          onChange={(e) => handleUnitChange(categoryIndex, serviceIndex, e.target.value as any)}
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
            <button className={styles.orangeButton} onClick={updatePrices}>Сохранить прайс-лист</button>
          </div>

        </div>
      )}
    </div>
  );
};

export default PricesPanel;
