import React, { useMemo, useState } from 'react';
import compareStyles from './CompareSection.module.css';
import { ProCard } from '@/types/Order';

export function CompareSection({ pros = [], setProId } : { pros: ProCard[]; setProId: (id: number) => void }) {
  const [selected, setSelected] = useState([]); // массив id для сравнения
  const [compareOpen, setCompareOpen] = useState(false);
  const [chosenId, setChosenId] = useState(null); // выбранный мастер (если есть)

  const parsePrice = (rate) => Number(String(rate).replace(/[^0-9.]/g, '')) || 0;

  function toggleSelect(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function clearSelection() {
    setSelected([]);
    setChosenId(null); // при очистке восстанавливаем всех
    setProId(-1); // сообщаем наверх, что мастер не выбран
  }

  function chooseMaster(id) {
    // пометим выбранного мастера и оставим его в selected
    setChosenId(id);
    setProId(id);  // сообщаем наверх выбранного мастера
    setSelected([id]);
    // скролл к верху для фокуса на выбранном
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // элементы, которые показываем на странице:
  // если есть chosenId — показываем только его, иначе все pros
  const visiblePros = useMemo(() => {
    if (!chosenId) return pros;
    return pros.filter(p => p.id === chosenId);
  }, [pros, chosenId]);

  const selectedItems = useMemo(() => pros.filter(p => selected.includes(p.proId)), [pros, selected]);

  // market average over all pros
  const marketAvgPrice = useMemo(() => {
    if (!pros.length) return 0;
    const sum = pros.reduce((s, p) => s + parsePrice(p.price), 0);
    return Math.round(sum / pros.length);
  }, [pros]);

  const selectedAvgPrice = useMemo(() => {
    if (!selectedItems.length) return 0;
    const sum = selectedItems.reduce((s, p) => s + parsePrice(p.price), 0);
    return Math.round(sum / selectedItems.length);
  }, [selectedItems]);

  console.log(pros)

  return (
    <section className={compareStyles.popular} aria-labelledby="compare-title">
      <div className={compareStyles.wrap}>
        <div className={compareStyles.headRow}>
          <div>
            <h2 id="compare-title" className={compareStyles.title}>
              {chosenId ? 'Выбранный мастер' : 'Сравнение предложений'}
            </h2>
            <p className={compareStyles.desc}>
              {chosenId
                ? 'Выбран один мастер. Нажмите "Сбросить выбор" или "Очистить", чтобы вернуть список.'
                : `Выберите любое количество исполнителей, в модальном окне покажем топ-3 из выбранных.`}
            </p>
          </div>

          <div className={compareStyles.controls}>
            <button
              className={compareStyles.ctrl}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Наверх"
            >
              ↑
            </button>
            {chosenId && (
              <button
                className={`${compareStyles.btn} ${compareStyles.ghost}`}
                onClick={() => clearSelection()}
                title="Сбросить выбор"
              >
                Сбросить выбор
              </button>
            )}
          </div>
        </div>

        {/* Если выбран мастер — показываем отдельную карточку (visiblePros уже это обеспечивает).
            Можно добавить отдельную выделенную панель над списком — ниже небольшой блок с деталями. */}
        {chosenId && (
          <div style={{ marginBottom: 14 }}>
            {/* оставляем компактный бейдж + кнопку снять */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontWeight: 800 }}>Текущий выбор:</div>
              <div style={{ color: 'var(--muted)' }}>
                {pros.find(p => p.id === chosenId)?.userName || '—'}
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <button className={compareStyles.btn} onClick={() => clearSelection()}>Сбросить выбор</button>
              </div>
            </div>
          </div>
        )}

        <div className={compareStyles.carousel} role="list">
          {visiblePros.map(p => {
            const isSelected = selected.includes(p.proId);
            const isChosen = p.proId === chosenId;
            return (
              <article
                key={p.id}
                className={`${compareStyles.proCard} ${isSelected ? compareStyles.selectedCard : ''}`}
                role="listitem"
                aria-labelledby={`pro-${p.id}-name`}
              >
                <div className={compareStyles.media}>
                  <div className={compareStyles.img} style={{ backgroundImage: `url(${p.imageRef})` }} aria-hidden />
                  <div className={compareStyles.overlay} aria-hidden />

                  {/* toggle selection для сравнения (скрываем, если уже выбран мастером и он единственный) */}
                  {!isChosen && (
                    <button
                      className={`${compareStyles.selectToggle} ${isSelected ? compareStyles.selected : ''}`}
                      onClick={(e) => { e.preventDefault(); toggleSelect(p.proId); }}
                      aria-pressed={isSelected}
                      aria-label={isSelected ? `Убрать ${p.userName} из сравнения` : `Добавить ${p.userName} к сравнению`}
                      title={isSelected ? 'Убрать из сравнения' : 'Добавить к сравнению'}
                    >
                      {isSelected ? '✓' : '+'}
                    </button>
                  )}
                </div>

                <div className={compareStyles.info}>
                  <div className={compareStyles.rowTop}>
                    <div id={`pro-${p.id}-name`} className={compareStyles.name}>{p.userName}</div>
                  </div>

                  {/* <div className={compareStyles.role}>{p.role}</div> */}

                  <div className={compareStyles.specs} aria-hidden>
                    {(p.subcategoriesDTO || []).slice(0, 2).map((s, i) => (
                      <button key={i} className={compareStyles.chip} tabIndex={-1}>{s.title}</button>
                    ))}
                    {p.subcategoriesDTO && p.subcategoriesDTO.length > 2 && (
                      <button className={`${compareStyles.chip} ${compareStyles.more}`} tabIndex={-1}>
                        +{p.subcategoriesDTO.length - 2}
                      </button>
                    )}
                  </div>

                  <div className={compareStyles.metaRow}>
                    <div className={compareStyles.rating}>⭐ {p.rating} <span className={compareStyles.reviews}>· {p.reviewsCount}</span></div>

                    <div className={compareStyles.rate}>{p.price}</div>

                    <div className={compareStyles.actions}>
                      <button
                        className={`${compareStyles.btn} ${compareStyles.ghost}`}
                        onClick={() => alert('Посмотреть профиль')}
                      >
                        Профиль
                      </button>

                      {/* Главное: кнопка "Выбрать" */}
                      <button
                        className={`${compareStyles.btn} ${compareStyles.primary}`}
                        onClick={() => chooseMaster(p.proId)}
                        aria-pressed={isChosen}
                        title={isChosen ? 'Этот мастер выбран' : 'Выбрать мастера'}
                      >
                        {isChosen ? 'Выбран' : 'Выбрать'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <CompareBar
          selectedCount={selected.length}
          onClear={clearSelection}
          onOpen={() => setCompareOpen(true)}
          selectedId={chosenId}
        />

        <CompareModal
  open={compareOpen}
  onClose={() => setCompareOpen(false)}
  selectedItems={selectedItems}
  marketAvgPrice={marketAvgPrice}
  selectedAvgPrice={selectedAvgPrice}
  parsePrice={parsePrice}
  onChoose={chooseMaster}   // <-- передаём функцию выбора
/>
      </div>
    </section>
  );
}

/* Bottom bar component */
function CompareBar({ selectedCount, onClear, onOpen, selectedId }) {
  // Когда выбрали мастера, у нас selectedCount будет 1, но по требованиям "Очистить" тоже должен возвращать всех — onClear сбросит chosen.
  // Поэтому оставляем поведение прежним.
  if (selectedCount === 0 || selectedId !== null) return null;
  return (
    <div className={compareStyles.compareBar} role="region" aria-live="polite">
      <div className={compareStyles.compareInfo}>Выбрано: <strong>{selectedCount}</strong></div>
      <div className={compareStyles.compareActions}>
        <button className={compareStyles.btn} onClick={onClear}>Очистить</button>
        <button className={compareStyles.publishBtn} onClick={onOpen}>Сравнить</button>
      </div>
    </div>
  );
}

/* Modal (без изменений логики) */
function CompareModal({ open, onClose, selectedItems = [], marketAvgPrice = 0, selectedAvgPrice = 0, parsePrice, onChoose }) {
  if (!open) return null;

  const scored = useMemo(() => {
    return selectedItems.map(p => {
      const price = parsePrice(p.price);
      const score = (Number(p.reviewsCount) || 0) * 10 + (Number(p.reviewsCount) || 0) * 0.1 - price;
      return { ...p, _price: price, _score: score };
    });
  }, [selectedItems, parsePrice]);

  const topThree: ProCard[] = useMemo(() => {
    return [...scored].sort((a, b) => b._score - a._score).slice(0, 3);
  }, [scored]);

  console.log('Top three for compare:', topThree);

  const bestPriceId = useMemo(() => {
    if (!topThree.length) return null;
    let min = Infinity, id = null;
    topThree.forEach(p => {
      if (p._price < min) { min = p._price; id = p.id; }
    });
    return id;
  }, [topThree]);

  const bestRatingId = useMemo(() => {
    if (!topThree.length) return null;
    let max = -Infinity, id = null;
    topThree.forEach(p => {
      const r = Number(p.rating) || 0;
      if (r > max) { max = r; id = p.id; }
    });
    return id;
  }, [topThree]);

  const priceCategory = (price, base) => {
    if (!base) return '—';
    if (price < base * 0.9) return 'Дешевле';
    if (price > base * 1.1) return 'Дороже';
    return 'Средняя';
  };

  return (
    <div className={compareStyles.compareModal} role="dialog" aria-modal="true" aria-label="Сравнение исполнителей">
      <div className={compareStyles.compareContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Сравнение — Топ 3 выбранных</h3>
          <div>
            <button className={compareStyles.btn} onClick={onClose}>Закрыть</button>
          </div>
        </div>

        {selectedItems.length === 0 ? (
          <p>Нет выбранных исполнителей.</p>
        ) : (
          <>
            <p style={{ marginTop: 8 }}>
              Показаны до трёх лучших исполнителей из выбранных. Подсвечены лучшие поля: минимальная цена и максимальный рейтинг.
            </p>

            <table className={compareStyles.compareTable}>
              <thead>
                <tr>
                  <th>Параметр</th>
                  {topThree.map(p => <th key={p.id}>{p.userName}</th>)}
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Фото</td>
                  {topThree.map(p => (
                    <td key={p.id}><img className={compareStyles.compImg} src={p.imageRef} alt={p.userName} /></td>
                  ))}
                </tr>

                <tr>
                  <td>Цена</td>
                  {topThree.map(p => (
                    <td
                      key={p.id}
                      className={p.id === bestPriceId ? compareStyles.bestCell : ''}
                    >
                      <div>{p.price}</div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Рейтинг</td>
                  {topThree.map(p => (
                    <td
                      key={p.id}
                      className={p.id === bestRatingId ? compareStyles.bestCell : ''}
                    >
                      ⭐ {p.rating} · {p.reviewsCount} отзывов
                    </td>
                  ))}
                </tr>

                <tr>
                  <td>Специализации</td>
                  {topThree.map(p => <td key={p.id}>{(p.subcategoriesDTO.map((i) => i.title) || []).join(', ')}</td>)}
                </tr>

                <tr>
                  <td>Гарантия</td>
                  {topThree.map(p => <td key={p.id}>{p.guarantee || '—'}</td>)}
                </tr>

                <tr>
                  <td>Доступно</td>
                  {topThree.map(p => <td key={p.id}>{p.nextAvailable || '—'}</td>)}
                </tr>

                {/* NEW: action row with per-master select buttons */}
                <tr>
                  <td></td>
                  {topThree.map(p => (
                    <td key={p.id} style={{ whiteSpace: 'nowrap' }}>
                      <button
                        className={`${compareStyles.btn} ${compareStyles.primary}`}
                        onClick={() => {
                          if (typeof onChoose === 'function') onChoose(p.id);
                          onClose();
                        }}
                        title={`Выбрать ${p.name}`}
                      >
                        Выбрать
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

