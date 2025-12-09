"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import styles from "../../components/ui/auth/CategorySelector.module.css"; // Обратите внимание на имя файла
import type { Category, Subcategory } from "@/types/Category";
import { useRouter } from "next/navigation";
import { LoginContext } from "../../components/context/LoginContext";
import { addSubcategoriesToPro } from "@/helpers/addSubcategoriesToPro";

type Props = {
  categories: Category[]; // Передаются с серверного компонента или родителя
  onBack?: () => void; // Опционально: кнопка "Назад" в самом верху
};

export default function CategoryEditorClient({ categories, onBack }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [openGroup, setOpenGroup] = useState<number | null>(null);
  
  // Состояние загрузки для кнопки сохранения
  const [isSaving, setIsSaving] = useState(false);

  // Локальная копия категорий
  const [categoriesToUse] = useState<Category[]>(categories ?? []);

  const { userLong } = use(LoginContext);
  const router = useRouter();

  // Загружаем уже выбранные категории пользователя при старте
  useEffect(() => {
    if (userLong !== undefined && userLong?.proSubcategories?.length > 0) {
      setSelected(new Set(userLong.proSubcategories.map((sc: Subcategory) => sc.id)));
    }
  }, [userLong]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await addSubcategoriesToPro(Array.from(selected));

      if (res.success) {
        // Здесь можно добавить Toast уведомление об успехе
        alert("Категории успешно обновлены!");
        if (onBack) onBack(); // Если передана функция возврата
      } else {
        alert("Ошибка при сохранении.");
      }
    } catch (e) {
      console.error(e);
      alert("Ошибка сети.");
    } finally {
      setIsSaving(false);
    }
  };

  // Логика выбора/фильтрации (осталась прежней)
  function toggleSubcat(id: number) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function isGroupAllChecked(group: Category) {
    return group.subcategories.length > 0 && group.subcategories.every((it) => selected.has(it.id));
  }

  function toggleGroupAll(group: Category) {
    setSelected((s) => {
      const next = new Set(s);
      if (isGroupAllChecked(group)) {
        group.subcategories.forEach((it) => next.delete(it.id));
      } else {
        group.subcategories.forEach((it) => next.add(it.id));
      }
      return next;
    });
  }

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return categoriesToUse;
    const q = query.toLowerCase();
    return categoriesToUse
      .map((g) => ({
        ...g,
        subcategories: g.subcategories.filter((sc) => sc.title.toLowerCase().includes(q)),
      }))
      .filter((g) => g.subcategories.length > 0);
  }, [query, categoriesToUse]);

  function openCategory(groupId: number) {
    setOpenGroup(groupId);
  }

  function backToAll(e?: React.MouseEvent) {
    e?.preventDefault();
    setOpenGroup(null);
  }

  function findSubLabel(id: number) {
    for (const g of categoriesToUse) {
      const s = g.subcategories.find((sc) => sc.id === id);
      if (s) return s.title;
    }
    return String(id);
  }

  return (
    <div className={styles.container} style={{margin: '0 auto'}}>
      {/* Кнопка назад (опционально, если это вложенная страница) */}
      <button onClick={()=>history.back()} className={styles.topBackBtn}>
        ← Назад
      </button>

      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Редактирование категорий</h1>
            <p className={styles.subtitle}>
              Отметьте услуги, которые вы предоставляете. Это поможет заказчикам найти вас.
            </p>
          </div>
          
          <button
            className={styles.saveButton}
            type="button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>

        {/* Поиск и выбранные теги */}
        <div className={styles.searchRow} style={{marginTop: '20px'}}>
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" width="18" height="18" aria-hidden>
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" fill="none" />
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Поиск категории..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className={styles.pills}>
            {[...selected].map((id) => {
              const label = findSubLabel(id);
              return (
                <button
                  key={id}
                  className={styles.pill}
                  onClick={() => toggleSubcat(id)}
                  type="button"
                  aria-pressed={true}
                >
                  {label}
                  <span className={styles.pillX}>×</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.panel}>
          {/* Навигация внутри групп */}
          <div className={styles.groupHeader}>
            {openGroup !== null ? (
              <>
                <button
                  className={styles.backBtn}
                  onClick={backToAll}
                  aria-label="Back to all categories"
                  type="button"
                >
                  ‹
                </button>
                <div className={styles.groupTitle}>
                  {categoriesToUse.find((g) => g.id === openGroup)?.title ?? "Категория"}
                </div>
                <div className={styles.rowRight}>
                  <label className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={isGroupAllChecked(categoriesToUse.find((g) => g.id === openGroup)!)}
                      onChange={() => toggleGroupAll(categoriesToUse.find((g) => g.id === openGroup)!)}
                    />
                    <span>Выбрать всё</span>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className={styles.groupTitle}>Все категории</div>
                <div className={styles.rowRight} />
              </>
            )}
          </div>

          {/* Список групп */}
          {openGroup === null && (
            <div className={styles.groupsGrid}>
              {filteredGroups.map((group) => (
                <div key={group.id} className={styles.groupCard}>
                  <div className={styles.groupCardHeader}>
                    <div className={styles.groupCardTitle}>{group.title}</div>
                    <button className={styles.openBtn} onClick={() => openCategory(group.id)} type="button">
                      →
                    </button>
                  </div>

                  {query.length > 0 && (
                    <div className={styles.groupItemsPreview}>
                      {group.subcategories.slice(0, 3).map((it) => (
                        <div key={it.id} className={styles.previewItem}>
                          <input
                            type="checkbox"
                            checked={selected.has(it.id)}
                            onChange={() => toggleSubcat(it.id)}
                            id={`preview-${group.id}-${it.id}`}
                          />
                          <label htmlFor={`preview-${group.id}-${it.id}`} className={styles.itemLabel}>
                            {it.title}
                          </label>
                        </div>
                      ))}
                      {group.subcategories.length === 0 && <div className={styles.noMatch}>Ничего не найдено</div>}
                    </div>
                  )}
                </div>
              ))}
              {filteredGroups.length === 0 && <div className={styles.noResults}>По запросу ничего не найдено</div>}
            </div>
          )}

          {/* Список подкатегорий одной группы */}
          {openGroup !== null && (
            <div className={styles.singleGroupList}>
              {categoriesToUse.find((g) => g.id === openGroup)?.subcategories.map((it) => (
                <label key={it.id} className={styles.itemRow}>
                  <input
                    type="checkbox"
                    checked={selected.has(it.id)}
                    onChange={() => toggleSubcat(it.id)}
                  />
                  <div className={styles.itemText}>{it.title}</div>
                </label>
              )) ?? <div className={styles.noResults}>Нет подкатегорий</div>}
            </div>
          )}
        </div>
        
        {/* Дублирующая кнопка сохранения внизу для удобства */}
        <div className={styles.footerRow}>
             <button
            className={styles.saveButton}
            type="button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </div>
  );
}