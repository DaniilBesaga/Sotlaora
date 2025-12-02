"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./CategorySelector.module.css";
import type { Category, Subcategory } from "@/types/Category";

type Props = {
  categories: Category[]; // passed from server component
  onNext?: (selectedIds: number[]) => void;
};

export default function CategorySelector({ categories, onNext }: Props) {
  const [query, setQuery] = useState("");
  // hold ids for selected subcategories (numbers)
  const [selected, setSelected] = useState<Set<number>>(new Set());
  // either null (show all groups) or group id to view its subcategories
  const [openGroup, setOpenGroup] = useState<number | null>(null);

  // keep a local copy in case you want to mutate/filter client-side later
  const [categoriesToUse, setCategoriesToUse] = useState<Category[]>(categories ?? []);

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // update local categories if prop changes (SSR -> client hydration)
    setCategoriesToUse(categories ?? []);
  }, [categories]);

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

  // helper to show label for a selected subcategory id
  function findSubLabel(id: number) {
    for (const g of categoriesToUse) {
      const s = g.subcategories.find((sc) => sc.id === id);
      if (s) return s.title;
    }
    return String(id);
  }

  return ( isOpen &&
    <div className={styles.pageWrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>Оберіть категорії робіт</h1>
        <p className={styles.subtitle}>
          Виберіть основну категорію, в якій плануєте працювати. Додати чи відредагувати
          категорії ви зможете пізніше.
        </p>

        <div className={styles.searchRow}>
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
              placeholder="Введіть назву категорії"
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
                  aria-pressed={selected.has(id)}
                >
                  {label}
                  <span className={styles.pillX}>×</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.panel}>
          {/* breadcrumb / back */}
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
                  {categoriesToUse.find((g) => g.id === openGroup)?.title ?? "Категорія"}
                </div>
                <div className={styles.rowRight}>
                  <label className={styles.checkboxRow}>
                    <input
                      type="checkbox"
                      checked={isGroupAllChecked(categoriesToUse.find((g) => g.id === openGroup)!)}
                      onChange={() => toggleGroupAll(categoriesToUse.find((g) => g.id === openGroup)!)}
                    />
                    <span>Всі пропозиції в категорії</span>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className={styles.groupTitle}>Категорії</div>
                <div className={styles.rowRight} />
              </>
            )}
          </div>

          {/* all groups view */}
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
                      {group.subcategories.length === 0 && <div className={styles.noMatch}>Нічого не знайдено</div>}
                    </div>
                  ) 
                  }
                </div>
              ))}

              {filteredGroups.length === 0 && <div className={styles.noResults}>За запитом нічого не знайдено</div>}
            </div>
          )}

          {/* single group view */}
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
              )) ?? <div className={styles.noResults}>Немає підкатегорій</div>}
            </div>
          )}
        </div>

        <div className={styles.footerRow}>
          <button
            className={styles.nextButton}
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Пропустити
          </button>
        </div>
      </div>
    </div>
  );
}
