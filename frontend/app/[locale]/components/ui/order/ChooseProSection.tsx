'use client'
import React, { useState, useEffect, use } from 'react';
import styles from './ChooseProSection.module.css';
import { LoginContext } from '../../context/LoginContext';

export default function ChoosePerformerSection({
  candidates = [], // массив объектов исполнителей [{id,name,role, img, rate, rating, specialties, ...}]
  initialSelectedId = null,
  onConfirm = (payload) => { console.log('confirm', payload); },
  onOpenChat = (performer) => { console.log('open chat for', performer); },
  proId,
  setAdditonalComment,
  setIsClicked
}) {
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [finalPrice, setFinalPrice] = useState('');
  const [deadline, setDeadline] = useState('');
  const [note, setNote] = useState('');

  const {user, userLong, authenticated} = use(LoginContext); // TODO: get from context

  function handleConfirm() {
    const performer = candidates.find(c => c.id === proId);
    onConfirm({
      performerId: selectedId,
      performer,
      finalPrice: finalPrice,
      deadline,
      note,
      timestamp: new Date().toISOString()
    });
    if(userLong?.id === -1 && user.id === -1) return;
    setIsClicked(true);
  }

  function handleOpenChat() {
    if (!selectedId) return alert('Выберите исполнителя для чата');
    const performer = candidates.find(c => c.id === selectedId);
    onOpenChat(performer);
  }

  return (
    <section className={styles.chooseSection} aria-labelledby="choose-title">
      <div className={styles.wrap}>
        <div className={styles.headerRow}>
          <div>
            <h2 id="choose-title" className={styles.title}>Шаг 3 — Перейдите к диалогу с исполнителем</h2>
            <p className={styles.subtitle}>Договоритесь о финальной стоимости и сроках. После — переходите в чат для обсуждения деталей.</p>
          </div>
        </div>

        {/* <div className={styles.candidatesRow}>
          {candidates && candidates.length > 0 ? (
            candidates.map(p => (
              <div key={p.id} className={`${styles.card} ${selectedId === p.id ? styles.cardSelected : ''}`}>
                <label className={styles.radioWrap}>
                  <input
                    type="radio"
                    name="selectedPerformer"
                    value={p.id}
                    checked={selectedId === p.id}
                    onChange={() => setSelectedId(p.id)}
                    className={styles.radio}
                  />
                  <div className={styles.cardMedia} style={{ backgroundImage: `url(${p.img || '/placeholder.png'})` }} role="img" aria-label={p.name} />
                  <div className={styles.cardInfo}>
                    <div className={styles.name}>{p.name}</div>
                    <div className={styles.role}>{p.role}</div>
                    <div className={styles.meta}>
                      <div className={styles.rate}>{p.rate}</div>
                      <div className={styles.rating}>⭐ {p.rating} <span className={styles.reviews}>· {p.reviews}</span></div>
                    </div>
                    <div className={styles.specs}>
                      {(p.specialties || []).slice(0,3).map((s,i) => <span key={i} className={styles.chip}>{s}</span>)}
                      {(p.specialties && p.specialties.length > 3) && <span className={styles.chipMore}>+{p.specialties.length - 3}</span>}
                    </div>
                  </div>
                </label>
              </div>
            ))
          ) : (
            <div className={styles.empty}></div>
          )}
        </div> */}

        <div className={styles.formRow}>
          <div className={styles.inputs}>
            <label className={styles.field}>
              <div className={styles.fieldLabel}>Короткое сообщение / уточнение</div>
              <textarea
                className={styles.textarea}
                value={note}
                onChange={(e) => {setAdditonalComment(e.target.value);setNote(e.target.value)}}
                placeholder="Например: прийти вечером, взять с собой гибкую трубку..."
                rows={3}
                style={{color: 'black'}}
              />
            </label>
          </div>

          
        </div>
        <div className={styles.actions}>
            <button className={styles.primaryBtn} onClick={handleConfirm} style={{opacity: !proId ? '.5' : '1'}} disabled={!proId}>Отправить предложение</button>
            <button className={styles.primaryBtn} onClick={handleConfirm} style={{opacity: proId === null ? '1' : '.5'}} disabled={proId === null ? false : true}>Разместить предложение</button>
          </div>

        <div className={styles.helper}>
          <small>После отправки предложения исполнитель получит уведомление. В чате вы сможете согласовать детали и обменяться файлами.</small>
        </div>
      </div>
    </section>
  );
}
