import React, { useEffect, useState, useRef } from 'react';
import styles from './ProDashboard.module.css';
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react'; // Added Pencil
import { SubcategoryWithCountBio } from '@/types/Category';

interface Service {
  id: number;
  name: string;
  checked: boolean;
  desc: string;
}

interface Category {
  id: number;
  name: string;
  isOpen: boolean;
  services: Service[];
}

export default function ServiceDescriptionEdit() {
  const [aboutMe, setAboutMe] = useState<string>('');
  const [isBioEditing, setIsBioEditing] = useState<boolean>(false); // State for Bio edit mode
  const [subcategories, setSubcategories] = useState<SubcategoryWithCountBio>({subcategoryDTOs: [], count: 0, bio: ''});
  const [categories, setCategories] = useState<Category[]>([]);

  const bioInputRef = useRef<HTMLTextAreaElement>(null); // Ref to focus textarea

  // Focus the textarea when edit mode is enabled
  useEffect(() => {
    if (isBioEditing && bioInputRef.current) {
      bioInputRef.current.focus();
    }
  }, [isBioEditing]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch('http://localhost:5221/api/user/get-pro-services-details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: "include"
        });
        const data = await response.json();
        setSubcategories(data);
        
        // Map API data to categories format
        const mappedCategories: Category[] = [{
          id: 1,
          name: 'Servicii',
          isOpen: true,
          services: data.subcategoryDTOs.map((sub: any) => ({
            id: sub.id,
            name: sub.title,
            checked: false, // You might want to map this from API if user already has services selected
            desc: sub.description || ''
          }))
        }];
        
        setCategories(mappedCategories);
        setAboutMe(data.bio ?? '');
        // If bio comes from API, set it here: setAboutMe(data.bio)
      }
      catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
  }, []);

  const toggleCategory = (id: number) => {
    setCategories(cats => cats.map(c => c.id === id ? { ...c, isOpen: !c.isOpen } : c));
  };

  const toggleService = (catId: number, serviceId: number) => {
    setCategories(cats => cats.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        services: c.services.map(s => s.id === serviceId ? { ...s, checked: !s.checked } : s)
      };
    }));
  };

  const updateServiceDesc = (catId: number, serviceId: number, text: string) => {
    setCategories(cats => cats.map(c => {
      if (c.id !== catId) return c;
      return {
        ...c,
        services: c.services.map(s => s.id === serviceId ? { ...s, desc: text } : s)
      };
    }));
  };

  const saveAboutMe = async() => {
    try {
      const response = await fetch('http://localhost:5221/api/user/update-bio', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ aboutMe })
      });
      if (response.ok) {
        alert('Информация о себе успешно сохранена!');
        setIsBioEditing(false); // Disable edit mode on success
      }
      else {
        alert('Ошибка при сохранении информации о себе.');
      }
    }
    catch (error) {
      console.error('Error saving about me:', error);
      alert('Ошибка при сохранении информации о себе.');
    }
  }

  const saveServicesDescriptions = async() => {
    try {
      const servicesToSave = categories.flatMap(cat =>
        cat.services
          .filter(s => s.checked)
          .map(s => ({ subcategoryId: s.id, description: s.desc }))
      );
      
      // If no services are checked, maybe warn user or allow saving empty
      if(servicesToSave.length === 0) {
          alert("Нет выбранных услуг для сохранения.");
          return;
      }

      const response = await fetch('http://localhost:5221/api/user/update-services-descriptions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ servicesDescriptions: servicesToSave })
      });
      if (response.ok) {
        alert('Описания услуг успешно сохранены!');
      }
      else {
        alert('Ошибка при сохранении описаний услуг.');
      }
    }
    catch (error) {
      console.error('Error saving service descriptions:', error);
      alert('Ошибка при сохранении описаний услуг.');
    }
  }

  return (
    <div className={styles.editContainer}>
      <h2 className={styles.pageTitle}>Описание услуг</h2>
      
      <p className={styles.helperTextSmall}>
        Добавьте описание о себе и расскажите подробнее про каждую из своих услуг.
      </p>

      {/* --- BIO SECTION --- */}
      <div className={styles.sectionBlock}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <label className={styles.labelSimple} style={{ marginBottom: 0 }}>О себе</label>
            <Pencil 
                size={16} 
                className={styles.editIcon} 
                style={{ cursor: 'pointer', opacity: isBioEditing ? 1 : 0.6 }}
                onClick={() => setIsBioEditing(!isBioEditing)}
            />
        </div>
        
        <div className={styles.textareaWrapper}>
          <textarea
            ref={bioInputRef}
            className={styles.textareaMain}
            placeholder="Напишите о себе по крайней мере 230 символов..."
            value={aboutMe}
            disabled={!isBioEditing} // Disabled by default
            onChange={(e) => setAboutMe(e.target.value)}
            style={{ opacity: isBioEditing ? 1 : 0.7, backgroundColor: isBioEditing ? '#fff' : '#f9f9f9' }}
          />
          <div className={styles.charCount}>Не менее 230 символов</div>
        </div>
        
        {/* Save Bio Button (Visible only when editing, or always if you prefer) */}
        {isBioEditing && (
            <div style={{ marginTop: '10px' }}>
                <button className={styles.saveBtnSmall} onClick={saveAboutMe}>
                    Сохранить информацию о себе
                </button>
            </div>
        )}
      </div>

      <h3 className={styles.subHeader}>Вы работаете в {categories.length} категориях</h3>

      {/* --- SERVICES SECTION --- */}
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
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={service.checked} 
                      onChange={() => toggleService(cat.id, service.id)}
                      className={styles.customCheckbox}
                    />
                    <span className={styles.serviceNameText}>{service.name}</span>
                  </label>

                  {service.checked && (
                    <div className={styles.serviceEditBox}>
                      <textarea
                        className={styles.textareaService}
                        placeholder="Опишите услугу..."
                        value={service.desc}
                        onChange={(e) => updateServiceDesc(cat.id, service.id, e.target.value)}
                      />
                      <div className={styles.charCountRight}>Не менее 130 символов</div>
                      {/* Removed individual save button here to prioritize the bulk save below, 
                          or you can keep it as an immediate action */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* --- SAVE SERVICES BUTTON --- */}
      <div style={{ marginTop: '20px', marginBottom: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <button 
            className={styles.saveBtnSmall} 
            style={{ padding: '10px 20px', fontSize: '1rem' }} 
            onClick={saveServicesDescriptions}
        >
            Сохранить описания услуг
        </button>
      </div>

      <div>
        <button onClick={() => window.history.back()} className={styles.backBtnLink}>← Назад в профиль</button>
      </div>
    </div>
  );
}