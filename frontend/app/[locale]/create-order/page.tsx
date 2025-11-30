'use client'
import React, { useState, useMemo, useEffect } from "react";
import styles from "./CreateOrder.module.css";
import { CompareSection } from "../components/ui/order/CompareSection";
import ChoosePerformerSection from "../components/ui/order/ChooseProSection";
import CalendarDropdown from "../components/ui/order/CalendarDropdown";
import { Location, Order, OrderStatus } from "@/types/Order";

const prosData = [
  {
    id: 1,
    name: "Иван Мастер",
    role: "Сантехник",
    img: "/images/pros/1.jpg",
    specialties: ["Краны", "Трубы", "Монтаж"],
    rating: 4.9,
    reviews: 112,
    rate: "от 80 RON/ч",
    guarantee: "3 месяца",
    nextAvailable: "Сегодня"
  },
  {
    id: 2,
    name: "Андрей Электрик",
    role: "Электрик",
    img: "/images/pros/2.jpg",
    specialties: ["Розетки", "Щитки"],
    rating: 4.7,
    reviews: 89,
    rate: "от 100 RON/ч",
    guarantee: "6 месяцев",
    nextAvailable: "Завтра"
  },
  {
    id: 3,
    name: "Михаил Универсал",
    role: "Мастер на час",
    img: "/images/pros/1.jpg",
    specialties: ["Сборка мебели", "Мелкий ремонт"],
    rating: 4.8,
    reviews: 150,
    rate: "от 70 RON/ч",
    guarantee: "—",
    nextAvailable: "Через 2 дня"
  },
  {
    id: 4,
    name: "Михаил Васек",
    role: "Мастер на час",
    img: "/images/pros/1.jpg",
    specialties: ["Сборка мебели", "Мелкий ремонт"],
    rating: 4.5,
    reviews: 10,
    rate: "от 1220 RON/ч",
    guarantee: "—",
    nextAvailable: "Через 2 дня"
  }
];

type FormErrors = {
  location: boolean;
  budget: boolean;
  date: boolean;
  subcategory: boolean;
  files: boolean;
  text: boolean;
}

type Item = { id: number; title: string };

const emptyOrder: Order = {
  title: "",
  description: "",
  postedAt: new Date(),
  price: 0,
  location: Location.AtClients,
  address: "",
  distance: 0,
  additionalComment: "",
  responsesCount: 0,
  status: OrderStatus.Active,
  subcategories: [],
  files: [],
  clientId: 0,
  proId: 0,
};

export default function OrderFormModern() {
  const [selected, setSelected] = useState<[]>([]); // массив id
  const [compareOpen, setCompareOpen] = useState(false);
  const MAX = 4;

  function toggleSelect(id) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX) return prev; // replace with toast if нужен
      return [...prev, id];
    });
  }

const selectedItems = useMemo(() => prosData.filter(p => selected.includes(p.id)), [prosData, selected]);

  function clearSelection() { setSelected([]); }
  // highlight helpers
  const bestPriceId = useMemo(() => {
    if (!selectedItems.length) return null;
    let min = Infinity, id = null;
    selectedItems.forEach(p => {
      const numeric = Number(String(p.rate).replace(/[^0-9.]/g, '')) || Infinity;
      if (numeric < min) { min = numeric; id = p.id; }
    });
    return id;
  }, [selectedItems]);

  const bestRatingId = useMemo(() => {
    if (!selectedItems.length) return null;
    let max = -Infinity, id = null;
    selectedItems.forEach(p => {
      const r = Number(p.rating) || 0;
      if (r > max) { max = r; id = p.id; }
    });
    return id;
  }, [selectedItems]);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [locOpen, setLocOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [locationMode, setLocationMode] = useState("");
  const [catQuery, setCatQuery] = useState("");
  const [selectedSub, setSelectedSub] = useState(null);
  const [range, setRange] = useState({ start: null, end: null });
  const [files, setFiles] = useState<File[]>([]);

  // New: accordion state for top panel (form) and next step panel
  const [formOpen, setFormOpen] = useState(true);
  const [nextOpen, setNextOpen] = useState(false);
  const [chooseOpen, setChooseOpen] = useState(false);

  const [formErrors, setFormErrors] = useState<FormErrors>({
    location: false, files: false, budget: false, date: false, subcategory: false, text: false});

  const [errorMessage, setErrorMessage] = useState("");

  const categories = useMemo(() => [
    { id: 1, title: "Сантехника", subs: [{id: 1, title: "Краны"}, {id: 2, title: "Батареи"}] },
    { id: 2, title: "Электрика", subs: [{id: 3, title: "Проводка"}, {id: 4, title: "Розетки"}] },
  ], []);

  const [selectedCategories, setSelectedCategories] = useState<Item[]>([]);

  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);

  const [date, setDate] = useState({ day: 0, month: 0, year: 0 });
  const [timePref, setTimePref] = useState({timeStart: "", timeEnd: ""});

  const [steps, setSteps] = useState({ step1: false, step2: false, step3: false });

  const [order, setOrder] = useState<Order>(emptyOrder);

  const [proId, setProId] = useState<number>(-1);
  const [additionalComment, setAdditionalComment] = useState<string>("");

  const filtered = categories.filter(c => c.title.toLowerCase().includes(catQuery.toLowerCase()));

  function submit(e) {
    e.preventDefault();
    console.log({ title, desc, price, locationMode, range, files, selectedSub });
    alert("Заявка готова (в консоли) — замените alert на реальную отправку");
  }

  function pickCategory(c) { console.log('pick', c); }
  function pickSub(s) { setSelectedSub(s); }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files || []);

    const totalSize = list.reduce((acc, f)=>acc + f.size, 0)

    const maxSize = 10 * 1024 * 1024;

    if (totalSize > maxSize) {
      setFormErrors(prev=> ({...prev, files: true}));
      setErrorMessage(`Превышен максимальный размер файлов (${(maxSize / (1024*1024)).toFixed(0)} МБ)`);
    }
    else setFormErrors(prev=> ({...prev, files: false}));
    setFiles(list);
  }

  function handleApplyDate(data) {
    const d = data.date;

    setDate({
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear()
    });

    setTimePref({
      timeStart: data.timeStart,
      timeEnd: data.timeEnd
    });
  }

  const writeFilesAsync = async (files: File[])=>{
    //get orders count

    let renamedFiles = [];
    if(files.length !== 0){
      renamedFiles = files.map((file, index) => {
        const ext = file.name.split('.').pop();
        const newName = `order_${Date.now()}_${index}.${ext}`;
        return new File([file], newName, { type: file.type });
      })

      //api call to backend to upload files to folders
    }

    //api call to backend to save order with file names
  }

  const handleStep1Continue = () => {
    setFormErrors({
      text: false,
      location: false,
      subcategory: false,
      budget: false,
      date: false,
      files: false
    });

    if(title.trim() === "" || desc.trim() === ""){
      setFormErrors(prev=> ({...prev, text: true}));
      setErrorMessage("Пожалуйста, заполните заголовок и описание");
      return;
    }
    if(locationMode.length === 0){
      setFormErrors(prev=> ({...prev, location: true}));
      setErrorMessage("Пожалуйста, выберите локацию");
      return;
    }
    if(selectedCategories.length === 0){
      setFormErrors(prev=> ({...prev, subcategory: true}));
      setErrorMessage("Пожалуйста, выберите категорию");
      return;
    }
    if(price === 0){
      setFormErrors(prev=> ({...prev, budget: true}));
      setErrorMessage("Пожалуйста, укажите бюджет");
      return;
    }
    if(date.year === 0){
      setFormErrors(prev=> ({...prev, date: true}));
      setErrorMessage("Пожалуйста, укажите сроки");
      return;
    }
    
    setSteps(prev => ({...prev, step1: true}))
    setFormOpen(false);
    setNextOpen(true);
    const location = 
      locationMode === "У меня"
        ? Location.AtClients
        : locationMode === "У исполнителя"
          ? Location.AtPros
          : Location.Online;
    setOrder(prev=> ({
      ...prev,
      title,
      description: desc, 
      location,
      price,
      deadlineDate: `${date.day}.${date.month}.${date.year}`,
      desiredTimeStart: timePref.timeStart,
      desiredTimeEnd: timePref.timeEnd,
      subcategories: selectedCategories.map(cat => cat.id),
    }));
  }

  useEffect(() => {
    if(selectedCategories.length > 0){
      setFormErrors(prev=> ({...prev, subcategory: false}));
    }
  }, [selectedCategories])

  useEffect(() => {
    console.log('Current order state:', order);
  }, [order])

  useEffect(() => {
    if(proId !== -1){
      setSteps(prev => ({...prev, step2: true}))
      setOrder(prev=> ({
        ...prev,
        proId: proId,
      }) );
    }
  }, [proId])

  useEffect(() => {
    if(additionalComment.length > 0){
      setOrder(prev=> ({ ...prev, additionalComment: additionalComment }) );
    }
  }, [additionalComment])

  return (
    <main className={styles.wrapper}>
      <div className={styles.bg} aria-hidden />
      <div className={styles.overlay} aria-hidden />

      <div className={styles.cardWrap}>
        <header className={`${styles.card} ${styles.headerCard}`}>
          <div className={styles.brandRow}>
            <h1 className={styles.brand}>Soț la Ora • Мастера рядом</h1>
            <div className={styles.roleBadge + " " + styles.badgeCustomer}>Клиент</div>
          </div>

          <p className={styles.lead}>Подбирайте исполнителей без лишних хлопот — опишите задачу, сравните предложения и выберите лучшего.</p>

          <div className={styles.stepsRow}>
            <div className={styles.stepCard}><div className={styles.stepNum}>1</div><div className={styles.stepText}><strong>Опишите задачу</strong><small>Исполнители откликнутся.</small></div></div>
            <div className={styles.stepCard}><div className={styles.stepNum}>2</div><div className={styles.stepText}><strong>Сравните</strong><small>Рейтинг, отзывы, цена.</small></div></div>
            <div className={styles.stepCard}><div className={styles.stepNum}>3</div><div className={styles.stepText}><strong>Выберите</strong><small>Договоритесь о цене и сроках.</small></div></div>
          </div>
        </header>

        {/* New: compact toggle bar that controls formCard visibility */}
        <div className={styles.panelToggle}>
          <button
            className={styles.toggleBtn}
            aria-expanded={formOpen}
            aria-controls="order-form-panel"
            onClick={() => setFormOpen(p => !p)}
          >
            <div className={styles.toggleTitle}>Создать заявку</div>
            <div className={`${styles.toggleIcon} ${formOpen ? styles.open : ""}`} aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </button>
        </div>

        {/* Form card becomes an accordion panel */}
        <div id="order-form-panel" className={`${styles.accordionPanel} ${formOpen ? styles.expanded : styles.collapsed}`}>
          <div className={`${styles.card} ${styles.formCard}`} aria-label="Форма создания заказа">
            <input className={styles.titleInput} placeholder="Краткий заголовок — например: Протекает кран" value={title} onChange={(e) => setTitle(e.target.value)} />

            <textarea className={styles.desc} placeholder="Описание задачи..." value={desc} onChange={(e) => setDesc(e.target.value)} />
            {formErrors.text && (<div className={styles.errorText}>{errorMessage}</div>)}
            <div className={styles.controlsRow}>
              <div className={styles.controlPanel}>
                <button type="button" className={styles.rowHeader} aria-expanded={locOpen} onClick={() => { setLocOpen(p => !p); setBudgetOpen(false); setCalOpen(false); }}>
                  <span>Локация{locationMode.length > 0 && <span className={styles.formBadge}>{locationMode}</span>}</span>
                  <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                {formErrors.location && (<div className={styles.errorText}>{errorMessage}</div>)}

                <div className={`${styles.rowBody} ${locOpen ? styles.open : ""}`} aria-hidden={!locOpen}>
                  <div className={styles.inline}>
                    <button type="button" className={`${styles.smallChip} ${locationMode === "У меня" ? styles.smallChipActive : ""}`} onClick={() => {setLocationMode("У меня"); setLocOpen(false)}} aria-pressed={locationMode === 'У меня'}>У меня</button>
                    <button type="button" className={`${styles.smallChip} ${locationMode === "У исполнителя" ? styles.smallChipActive : ""}`} onClick={() => {setLocationMode("У исполнителя"); setLocOpen(false)}} aria-pressed={locationMode === 'У исполнителя'}>У исполнителя</button>
                    <button type="button" className={`${styles.smallChip} ${locationMode === "Онлайн" ? styles.smallChipActive : ""}`} onClick={() => {setLocationMode("Онлайн"); setLocOpen(false)}} aria-pressed={locationMode === 'Онлайн'}>Онлайн</button>
                  </div>

                  <div className={styles.noteText}><strong>Тимишоара</strong> — сервис доступен только в городе.</div>
                </div>
              </div>

              <div className={styles.controlPanel}>
                <button type="button" className={styles.rowHeader} aria-expanded={budgetOpen} onClick={() => { setBudgetOpen(p => !p); setLocOpen(false); setCalOpen(false); }}>
                  <span>Бюджет{price !== 0 && <span className={styles.formBadge}>{`до ${price}`}</span>}</span>
                  <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 1v22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </button>
                {formErrors.budget && (<div className={styles.errorText}>{errorMessage}</div>)}

                <div className={`${styles.rowBody} ${budgetOpen ? styles.open : ""}`} aria-hidden={!budgetOpen}>
                  <label className={styles.smallLabel}>До, RON</label>
                  <input type="number" className={styles.inputInline} value={price} onChange={e => setPrice(Number(e.target.value || 0))} min={0} />

                  <div className={styles.quickRow}>
                    {[50,100,200,500].map(v => (
                      <button key={v} type="button" className={styles.quickBtn} onClick={() => {setPrice(v);setBudgetOpen(false)}}>до {v}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.controlPanel}>
                <button type="button" className={styles.rowHeader} onClick={() => setCalOpen(p => !p)} aria-expanded={calOpen}>
                  <span>Сроки{date.year !== 0 && 
                    <span className={styles.formBadge} style={{fontSize: '.7rem'}}>{`${date.day}.${date.month}`} ({timePref.timeStart}-{timePref.timeEnd})</span>}
                  </span>
                  <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 10l5-5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                </button>
                {formErrors.date && (<div className={styles.errorText}>{errorMessage}</div>)}

                {calOpen && (
                  <CalendarDropdown initialStart={range.start} onApply={handleApplyDate} onClose={() => setCalOpen(false)} />
                )}
              </div>

              <div className={styles.controlPanel}>
                <label className={styles.rowHeader} htmlFor="filePicker" role="button">
                  <span>Фото и файлы{files.length > 0 && <span className={styles.formBadge}>{files.length} file(s)</span>}</span>
                  <svg className={styles.icon} width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10l5-5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </label>
                <input id="filePicker" type="file" multiple onChange={handleFiles} className={styles.hiddenFile} />
                {formErrors.files && (<div className={styles.errorText}>{errorMessage}</div>)}
              </div>
            </div>

            <div className={styles.selectedCategories}>
              {selectedCategories.length > 0 && (<div>
                  {selectedCategories.map((cat) => (
                    <div key={cat.id} onClick={()=>selectedCategories.filter((i)=>i.id !== cat.id)} className={styles.badge}>{cat.title}</div>))
                  }
              </div>
                )
              }
            </div>
            {formErrors.subcategory && (<div className={styles.errorText}>{errorMessage}</div>)}

            <div className={styles.formFooter}>
              <button type="submit" onClick={handleStep1Continue} className={styles.publishBtn}>Продолжить</button>
              <button type="button" className={styles.btnGhost} onClick={() => setCategoriesModalOpen(true)}>Категория</button>
            </div>
          </div>
        </div>

        {/* Next step below as its own collapsible card */}
        <div className={styles.panelToggle} style={{ marginTop: 18 }}>
          <button
            className={styles.toggleBtn}
            aria-expanded={nextOpen}
            aria-controls="next-step-panel"
            // disabled={!steps.step1}
            onClick={() => setNextOpen(p => !p)}
          >
            <div className={styles.toggleTitle}>Дальше: Сравнение предложений</div>
            <div className={`${styles.toggleIcon} ${nextOpen ? styles.open : ""}`} aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </button>
        </div>

        <div id="next-step-panel" className={`${styles.accordionPanel} ${nextOpen ? styles.expanded : styles.collapsed}`}>
          <div className={`${styles.card} ${styles.nextCard}`}>
            <h3 className={styles.nextTitle}>Сравнение предложений</h3>
            <p className={styles.nextText}>Здесь будет список откликов, фильтры и сортировка. Показать примеры карточек исполнителей и быстрые фильтры.</p>
            <div className={styles.nextActions}>
              <button className={styles.btnGhost} onClick={() => alert('Открыть список')}>Открыть список</button>
              <button className={styles.publishBtn} onClick={() => alert('Перейти')}>Перейти</button>
            </div>
          </div>
          <CompareSection pros={prosData} setProId={setProId}/>
        </div>

        <div className={styles.panelToggle} style={{ marginTop: 18 }}>
          <button
            className={styles.toggleBtn}
            aria-expanded={nextOpen}
            aria-controls="next-step-panel"
            
            onClick={() => setChooseOpen(p => !p)}
          >
            <div className={styles.toggleTitle}>Дальше: Выберите мастера</div>
            <div className={`${styles.toggleIcon} ${nextOpen ? styles.open : ""}`} aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </button>
        </div>

        <div id="next-step-panel" className={`${styles.accordionPanel} ${chooseOpen ? styles.expanded : styles.collapsed}`}>
          
          <ChoosePerformerSection
          onConfirm={(payload) => {
            console.log('confirmed', payload);
          }}
          onOpenChat={(performer) => {
            console.log('open chat for', performer);
          }}
          setAdditonalComment={setAdditionalComment}
          proId={proId}
        />
        </div>
          

        {/* Modal (unchanged) */}
        {categoriesModalOpen && (
          <div className={styles.modalOverlay} role="dialog" aria-modal="true">
            <div className={styles.modal}>
              <div className={styles.modalHead}>
                <input className={styles.input} placeholder="Поиск категории" value={catQuery} onChange={(e) => setCatQuery(e.target.value)} />
                <button className={styles.btnGhost} onClick={() => setCategoriesModalOpen(false)}>Закрыть</button>
              </div>

              <div className={styles.modalBody}>
                {filtered.map((c) => (
                  <div className={styles.catItem} key={c.id}>
                    <div className={styles.ctitle} onClick={() => pickCategory(c)}>{c.title}</div>
                    <div className={styles.subList}>
                      {c.subs.map((s) => (
                        <button key={s.id} className={`${styles.subBtn} ${selectedCategories.some(item=>item.id === s.id) ? styles.subSel : ""}`} onClick={() => { pickCategory(c); pickSub(s.id); setSelectedCategories(prev => prev.some(item=>item.id === s.id) ? prev : [...prev, s])}}>
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.modalFoot}>
                <button className={styles.publishBtn} onClick={() => setCategoriesModalOpen(false)}>Выбрать</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
