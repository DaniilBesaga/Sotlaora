import React, { useState, useRef, ChangeEvent, DragEvent, useEffect, use } from 'react';
import styles from './PortfolioPanel.module.css';
import { Category } from '@/types/Category';

interface FileFormData {
  category: string;
  subcategory: string;
  description: string;
}

const PortfolioPanel: React.FC = () => {

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await fetch("http://localhost:5221/api/user/portfolios", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("Fetched portfolios:", data);
      } catch (error) {
        console.error("Failed to fetch portfolios", error);
      }
    };

    fetchPortfolios();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await fetch("http://localhost:5221/api/categories/with-subcategories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setSubcategories(data);
        console.log("Fetched subcategories:", data);
      } catch (error) {
        console.error("Failed to fetch subcategories", error);
      }
    };

    fetchSubcategories();
  }, []);

  // --- States ---
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoLink, setVideoLink] = useState<string>('');

  const [subcategories, setSubcategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState<FileFormData>({
    category: 'Услуги для животных',
    subcategory: 'Уход за собаками',
    description: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Helpers ---

  // Cleanup object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }

    // Clean up previous preview if exists
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);

    // Reset form data for new file (optional, depends on UX preference)
    setFormData({
      category: 'Услуги для животных',
      subcategory: 'Уход за собаками',
      description: ''
    });

    // Scroll to form
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const removeFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Event Handlers ---

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const dataToSend = new FormData();

    const fileExtension = selectedFile.name.split('.').pop();
    
    const newFileName = `portfolio_${Date.now()}.${fileExtension}`;

    // Create a NEW File object with the same content but the new name
    const renamedFile = new File([selectedFile], newFileName, { type: selectedFile.type });

    // Append the RENAMED file, not the selectedFile
    dataToSend.append("files", renamedFile);

    console.log("Ready to upload:", Object.fromEntries(dataToSend));

    try {
      const res = await fetch("http://localhost:5221/api/image/upload", {
        method: "POST",
        body: dataToSend,      
      });

      const dataImage = await res.json();
      
      if(dataImage.insertedIds.length > 0){
      
        const res = await fetch("http://localhost:5221/api/user/create-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Description: formData.description,
            YoutubeLink: videoLink,
            SubcategoryId: subcategories
              .find(cat => 
                cat.subcategories.some(subcat => subcat.title === formData.subcategory)
              )
              ?.subcategories.find(subcat => subcat.title === formData.subcategory)?.id || 0,
            ImageRef: '',
            ImageFileId: dataImage.insertedIds[0]
          }
        ),});

        const data = await res.json();
        if(data.status === 200){
          alert('Portfolio created successfully');
        }
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleSubcategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({...formData, subcategory: e.target.value});
    setFormData({...formData, category: subcategories.find(cat => 
      cat.subcategories.some(subcat => subcat.title === e.target.value)
    )?.title || ''});
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        {/* 1. DROPZONE (Hidden if file is selected, or stays visible to replace? 
            UI Pattern: Often dropzone is hidden if single file is enforced, 
            but here we keep it to allow "replacing" the file easily) */}
        {!selectedFile ? (
            <div
            className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            >
            <input
                ref={fileInputRef}
                type="file"
                className={styles.hiddenInput}
                accept="image/*"
                onChange={handleInputChange}
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
        ) : (
             // Placeholder to indicate a file is selected before the form
            <div className={styles.helperText} style={{textAlign: 'center', marginBottom: '20px'}}>
                <p>Выбран файл: <strong>{selectedFile.name}</strong></p>
                <button className={styles.outlineButton} onClick={removeFile}>Выбрать другой файл</button>
            </div>
        )}

        <p className={styles.helperText}>
          Фото выполненных работ — отличный шанс показать заказчику всё, что вы умеете.
        </p>

        {/* 2. VIDEO SECTION (Kept as requested) */}
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

        {/* 3. EDIT FORM (Visible only when file is selected) */}
        {selectedFile && previewUrl && (
          <div className={`${styles.editFormContainer} ${styles.fadeIn}`}>
            <h3 className={styles.formTitle}>Добавление работы</h3>
            <div className={styles.formLayout}>
              
              {/* Left: Preview */}
              <div className={styles.leftColumn}>
                <div className={styles.imagePreviewBox}>
                  <img src={previewUrl} alt="Preview" className={styles.uploadedImage} />
                </div>
                <button className={styles.deleteLink} onClick={removeFile}>
                  Удалить
                </button>
              </div>

              {/* Right: Inputs */}
              <div className={styles.rightColumn}>
                <div className={styles.formRow}>
                  <label className={styles.label}>Категория</label>
                  <div className={styles.selectWrapper}>
                    <select 
                      className={styles.select}
                      value={'Выбранная категория'}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      disabled
                    >
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
                      {subcategories.length > 0 && subcategories.map((cat) => (
                        cat.subcategories.map((subcat) => (
                          <option key={subcat.id} value={subcat.title}>{subcat.title}</option>
                        ))
                      ))}
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
              <button className={styles.orangeButton} onClick={handleUpload}>
                Загрузить работу
              </button>
              <button className={styles.cancelButton} onClick={removeFile}>
                Отмена
              </button>
            </div>
            
            <hr className={styles.divider} />
          </div>
        )}

      </div>
    </div>
  );
};

export default PortfolioPanel;