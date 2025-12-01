// CategoryModal.jsx
// Save this file as CategoryModal.jsx (or .tsx) and the CSS as CategoryModal.module.css
// Props expected:
// - allCategories: Array<{ id, title, subcategories: [{id, title}] }>
// - selectedCategories: Array<subcategory>
// - setSelectedCategories: function
// - pickCategory: function(category)
// - pickSub: function(subcategoryId)
// - onClose: function

import React, { useEffect, useMemo, useState } from "react";
import styles from "./CategoryModal.module.css";

export default function CategoryModal({
  allCategories = [],
  selectedCategories = [],
  setSelectedCategories = () => {},
  pickCategory = () => {},
  pickSub = () => {},
  onClose = () => {},
}) {
  const [catQuery, setCatQuery] = useState("");
  const [expanded, setExpanded] = useState(new Set());

  // derived filtered list — categories that match query or have subcategories that match
  const filtered = useMemo(() => {
    const q = catQuery.trim().toLowerCase();
    if (!q) return allCategories;
    return allCategories
      .map((c) => {
        const categoryMatch = c.title.toLowerCase().includes(q);
        const matchingSubs = c.subcategories.filter((s) => s.title.toLowerCase().includes(q));
        if (categoryMatch) return c; // keep full category if category matches
        if (matchingSubs.length) return { ...c, subcategories: matchingSubs };
        return null;
      })
      .filter(Boolean);
  }, [allCategories, catQuery]);

  // auto-expand categories that contain matches when searching
  useEffect(() => {
    if (!catQuery.trim()) return; // don't change expansion on empty search
    const newSet = new Set(expanded);
    filtered.forEach((c) => newSet.add(c.id));
    setExpanded(newSet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catQuery]);

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isSelected = (subId) => selectedCategories.some((it) => it.id === subId);

  const handleSubClick = (category, sub) => {
    pickCategory(category);
    pickSub(sub.id);
    setSelectedCategories((prev) => {
      if (prev.some((it) => it.id === sub.id)) return prev.filter((it) => it.id !== sub.id);
      return [...prev, sub];
    });
  };

  const clearSearch = () => setCatQuery("");

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Выбор категорий">
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <div className={styles.searchWrap}>
            <input
              className={styles.input}
              placeholder="Поиск категории"
              value={catQuery}
              onChange={(e) => setCatQuery(e.target.value)}
              aria-label="Поиск категории"
            />
            {catQuery && (
              <button className={styles.clearBtn} onClick={clearSearch} aria-label="Очистить поиск">
                ×
              </button>
            )}
          </div>

          <button className={styles.btnGhost} onClick={onClose} aria-label="Закрыть">
            Закрыть
          </button>
        </div>

        <div className={styles.modalBody}>
          {filtered.length === 0 && <div className={styles.empty}>Ничего не найдено</div>}

          {filtered.map((c) => {
            const open = expanded.has(c.id);
            return (
              <div className={styles.catItem} key={c.id}>
                <button
                  type="button"
                  className={styles.catHeader}
                  onClick={() => toggleExpand(c.id)}
                  aria-expanded={open}
                  aria-controls={`sublist-${c.id}`}
                >
                  <span className={styles.ctitle}>{c.title}</span>
                  <span className={`${styles.caret} ${open ? styles.caretOpen : ""}`} aria-hidden>
                    ▾
                  </span>
                </button>

                <div
                  id={`sublist-${c.id}`}
                  className={`${styles.subList} ${open ? styles.open : ""}`}
                  role="region"
                  aria-hidden={!open}
                >
                  {c.subcategories.map((s) => (
                    <button
                      key={s.id}
                      className={`${styles.subBtn} ${isSelected(s.id) ? styles.subSel : ""}`}
                      onClick={() => handleSubClick(c, s)}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.modalFoot}>
          <button className={styles.saveBtn} onClick={onClose}>Применить</button>
        </div>
      </div>
    </div>
  );
}