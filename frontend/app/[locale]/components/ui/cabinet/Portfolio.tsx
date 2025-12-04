import React, { useState, useRef } from 'react';
import styles from './PortfolioPanel.module.css';

const PortfolioPanel = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [dragActive, setDragActive] = useState(false);
  
  const [files, setFiles] = useState([]); // Список готовых файлов
  const [editingFile, setEditingFile] = useState(null); // Файл в процессе редактирования

  const [videoLink, setVideoLink] = useState('');
  
  const [formData, setFormData] = useState({
    category: 'Услуги для животных',
    subcategory: 'Уход за собаками',
    description: ''
  });

  const fileInputRef = useRef(null);

  // --- Drag & Drop ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startEditing(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      startEditing(e.target.files[0]);
    }
  };

  const startEditing = (file) => {
    // Если уже что-то редактируем, заменяем или предупреждаем. Здесь просто заменяем.
    const fileUrl = URL.createObjectURL(file);
    setEditingFile({ file, url: fileUrl });
    setFormData({ 
      category: 'Услуги для животных', 
      subcategory: 'Уход за собаками', 
      description: '' 
    });
    
    // Скролл к форме, чтобы пользователь заметил появление снизу
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleSave = () => {
    if (!editingFile) return;
    const newFile = {
      name: editingFile.file.name,
      url: editingFile.url,
      ...formData
    };
    setFiles((prev) => [...prev, newFile]);
    setEditingFile(null); // Закрываем форму после сохранения
  };

  const handleCancel = () => {
    setEditingFile(null); // Просто закрываем форму
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        {/* 1. ЗОНА ЗАГРУЗКИ (Всегда видна) */}
        <div
          className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className={styles.hiddenInput}
            accept="image/*"
            onChange={handleChange}
          />
          <div className={styles.dropContent}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <p>Перетащите сюда файл или <span className={styles.link}>выберите на компьютере</span></p>
          </div>
        </div>

        <p className={styles.helperText}>
          Фото выполненных работ — отличный шанс показать заказчику всё, что вы умеете.
        </p>

        {/* 4. ВИДЕО И ФУТЕР */}
        <div className={styles.videoSection}>
          <div className={styles.youtubeLabel}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#FF0000" className={styles.ytIcon}>
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span style={{fontWeight: 'bold', marginLeft: '5px'}}>YouTube</span>
          </div>
          
          <input 
            type="text" 
            placeholder="Ссылка на видео" 
            className={styles.inputField} 
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
          <button className={styles.orangeButton}>Добавить видео</button>
        </div>

        {/* 2. ФОРМА РЕДАКТИРОВАНИЯ (Появляется СНИЗУ, если есть editingFile) */}
        {editingFile && (
          <div className={`${styles.editFormContainer} ${styles.fadeIn}`}>
            <h3 className={styles.formTitle}>Добавление работы</h3>
            <div className={styles.formLayout}>
              
              {/* Превью */}
              <div className={styles.leftColumn}>
                <div className={styles.imagePreviewBox}>
                  <img src={editingFile.url} alt="Preview" className={styles.uploadedImage} />
                </div>
                {/* Кнопка Удалить здесь работает как "Отмена" для текущего файла */}
                <button className={styles.deleteLink} onClick={handleCancel}>
                  Удалить
                </button>
              </div>

              {/* Поля */}
              <div className={styles.rightColumn}>
                <div className={styles.formRow}>
                  <label className={styles.label}>Категория</label>
                  <div className={styles.selectWrapper}>
                    <select 
                      className={styles.select}
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Услуги для животных</option>
                      <option>Дизайн</option>
                      <option>Разработка</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.label}>Подкатегория</label>
                  <div className={styles.selectWrapper}>
                    <select 
                      className={styles.select}
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                    >
                      <option>Уход за собаками</option>
                      <option>Ветеринария</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.label}>Описание</label>
                  <textarea 
                    className={styles.textarea}
                    placeholder="Опишите выполненную работу..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button className={styles.orangeButton} onClick={handleSave}>Сохранить</button>
              <button className={styles.cancelButton} onClick={handleCancel}>Отмена</button>
            </div>
            
            <hr className={styles.divider} />
          </div>
        )}

        {/* 3. СПИСОК УЖЕ ЗАГРУЖЕННЫХ (Grid) */}
        {files.length > 0 && (
          <div className={styles.previewGrid}>
            {files.map((file, index) => (
              <div key={index} className={styles.previewCard}>
                <img src={file.url} alt={file.name} className={styles.previewImage} />
                <button className={styles.removeButton} onClick={() => removeFile(index)}>×</button>
                {/* Можно добавить отображение названия категории при наведении */}
                <div className={styles.cardOverlay}>{file.category}</div>
              </div>
            ))}
          </div>
        )}

        
        
        <div className={styles.actions}>
          <button className={styles.greenBadge}>Все - {files.length}</button>
          <button className={styles.outlineButton}>+ Добавить папку</button>
        </div>

      </div>
    </div>
  );
};

export default PortfolioPanel;