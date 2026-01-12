'use client';

import React, { useState, useRef, use } from 'react';
import { 
  ShieldCheck, Upload, FileText, CheckCircle2, 
  X, Image as ImageIcon, AlertCircle, Loader2 
} from 'lucide-react';
import styles from './VerificationPage.module.css';
import { LoginContext } from '../components/context/LoginContext';


export default function VerificationPage() {
  const { authorizedFetch } = use(LoginContext);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert("Пожалуйста, загрузите изображение (JPG, PNG).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("Файл слишком большой. Максимальный размер 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadStatus('idle');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');

    // Simulate API Call
    // const formData = new FormData();
    // formData.append('verificationPhoto', selectedFile);
    
    try {
      // await authorizedFetch('/api/user/verify', { method: 'POST', body: formData });
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus('success');
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
    }
  };

  if (uploadStatus === 'success') {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIconWrapper}>
              <ShieldCheck size={48} color="#ffffff" />
            </div>
            <h1 className={styles.successTitle}>Документы отправлены!</h1>
            <p className={styles.successText}>
              Мы получили ваше фото. Проверка обычно занимает от 2 до 24 часов. 
              Вы получите уведомление, как только ваш статус подтвердится.
            </p>
            <button className={styles.btnPrimary} onClick={() => window.location.href = '/dashboard'}>
              Вернуться в кабинет
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.iconBox}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className={styles.title}>Верификация личности</h1>
            <p className={styles.subtitle}>
              Подтвердите свой профиль, чтобы получать больше заказов и повысить доверие клиентов.
            </p>
          </div>
        </header>

        <div className={styles.grid}>
          
          {/* Left Column: Instructions */}
          <div className={styles.infoColumn}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Как сделать фото?</h3>
              <p className={styles.cardDesc}>
                Пожалуйста, загрузите селфи, на котором вы держите паспорт или удостоверение личности рядом с лицом.
              </p>

              {/* Visual Instruction Mockup */}
              <div className={styles.visualGuide}>
                <div className={styles.guideMockup}>
                  <div className={styles.mockFace}></div>
                  <div className={styles.mockIdCard}>
                    <div className={styles.mockIdPhoto}></div>
                    <div className={styles.mockIdLines}></div>
                  </div>
                </div>
              </div>

              <ul className={styles.checklist}>
                <li>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>Лицо должно быть полностью видно и хорошо освещено.</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>Данные на документе должны быть читаемы.</span>
                </li>
                <li>
                  <CheckCircle2 size={18} className={styles.checkIcon} />
                  <span>Пальцы не должны перекрывать фото или текст на документе.</span>
                </li>
              </ul>

              <div className={styles.securityNote}>
                <div className={styles.lockIcon}><AlertCircle size={16} /></div>
                <p>Ваши данные надежно зашифрованы и используются только для проверки личности. Они никогда не будут опубликованы.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Upload Area */}
          <div className={styles.actionColumn}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Загрузка фото</h3>
              
              {!selectedFile ? (
                <div 
                  className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/*" 
                    onChange={handleFileSelect} 
                  />
                  <div className={styles.uploadIconCircle}>
                    <Upload size={24} />
                  </div>
                  <p className={styles.uploadTitle}>Нажмите или перетащите фото сюда</p>
                  <p className={styles.uploadSub}>JPG или PNG, макс. 5MB</p>
                </div>
              ) : (
                <div className={styles.previewArea}>
                  <div className={styles.previewImageWrapper}>
                    <img src={previewUrl!} alt="Preview" className={styles.previewImg} />
                    <button onClick={handleRemoveFile} className={styles.removeBtn} title="Удалить">
                      <X size={16} />
                    </button>
                  </div>
                  <div className={styles.fileInfo}>
                    <FileText size={16} className={styles.fileIcon} />
                    <span className={styles.fileName}>{selectedFile.name}</span>
                    <span className={styles.fileSize}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              )}

              <div className={styles.footerActions}>
                <button 
                  className={styles.btnPrimary} 
                  disabled={!selectedFile || uploadStatus === 'uploading'}
                  onClick={handleSubmit}
                >
                  {uploadStatus === 'uploading' ? (
                    <>
                      <Loader2 size={18} className={styles.spin} /> Проверка...
                    </>
                  ) : (
                    "Отправить на проверку"
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}