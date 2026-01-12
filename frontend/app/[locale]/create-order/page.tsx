'use client'
import React, { useState, useMemo, useEffect, use } from "react";
import styles from "./CreateOrder.module.css";
import { CompareSection } from "../components/ui/order/CompareSection";
import ChoosePerformerSection from "../components/ui/order/ChooseProSection";
import CalendarDropdown from "../components/ui/order/CalendarDropdown";
import { Location, Order, OrderDTO, OrderStatus, ProCard } from "@/types/Order";
import { Category } from "@/types/Category";
import CategoryModal from "../components/ui/order/CategoryModal";
import { body, u } from "motion/react-client";
import { LoginContext } from "../components/context/LoginContext";

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

const emptyOrder: OrderDTO = {
  title: "",
  description: "",
  postedAt: new Date(),
  price: 0,
  location: Location.AtClients,
  additionalComment: "",
  subcategories: [],
  clientId: -1,
};

export default function OrderFormModern() {

  const {authorizedFetch} = use(LoginContext)

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

  const [order, setOrder] = useState<OrderDTO>(emptyOrder);

  const [proId, setProId] = useState<number | null>(null);
  const [additionalComment, setAdditionalComment] = useState<string>("");
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [allCategories, setAllCategories] = useState([]);

  const [prosCards, setProsCards] = useState<ProCard[]>([]);

  const filtered = categories.filter(c => c.title.toLowerCase().includes(catQuery.toLowerCase()));

  function submit(e) {
    e.preventDefault();
    console.log({ title, desc, price, locationMode, range, files, selectedSub });
    alert("Заявка готова (в консоли) — замените alert на реальную отправку");
  }

  function pickCategory(c) { console.log('pick', c); }
  const pickSub = (s) => { 
    setSelectedSub(s); 
  }

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

  useEffect(() => {
    if(selectedCategories.length === 0){
      return;
    }

    const subcategoriesId = selectedCategories.map(cat => cat.id);
    
    const timeoutId = setTimeout(() => {
      const getPros = async () => {
        const res = await fetch("http://localhost:5221/api/pro/get-all-pros-by-subcategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(subcategoriesId)
        });
        const data = await res.json();
        if(localStorage.getItem("proId")){
          setProsCards(data.filter((pro: ProCard) => pro.id.toString() !== localStorage.getItem("proId")) );
        }
        else{
          setProsCards(data);
        }
        console.log('Fetched pros for selected categories:', data);
        // setProsData(data);
      }
      getPros();
    }, 1000); // Wait 500ms after last change before making the call
    
    return () => clearTimeout(timeoutId);
  }, [selectedCategories])

  const writeFilesAsync = async (files: File[])=>{
    //get orders count

    let renamedFiles : string[] = [];

    if(files.length !== 0){
      const formData = new FormData();

      files.forEach((file, index) => {
        const ext = file.name.split('.').pop();
        const newName = `order_${Date.now()}_${index}.${ext}`;
        const renamedFile = new File([file], newName, { type: file.type });
        renamedFiles.push(newName);

        formData.append("files", renamedFile); 
      });

      const res = await fetch("http://localhost:5221/api/image/upload", {
        method: "POST",
        body: formData,      
      });

      const dataImage = await res.json();

      if(dataImage.insertedIds.length > 0){

        setOrder(prev=> ({ ...prev, postedAt: new Date() }) );

        const res = await authorizedFetch("http://localhost:5221/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Title: order.title,
            Description: order.description,
            PostedAt: new Date(order.postedAt).toISOString(),
            Price: order.price,
            Location: order.location, // "AtPros" | "AtClients" | "Online"
            AdditionalComment: order.additionalComment,
            DeadlineDate: order.deadlineDate ? new Date(order.deadlineDate).toISOString() : null,
            DesiredTimeStart: order.desiredTimeStart,
            DesiredTimeEnd: order.desiredTimeEnd,
            Subcategories: order.subcategories,
            ClientId: order.clientId,
            ImageFileIds: dataImage.insertedIds,
            ProId: order.proId,
            Status: order.proId ? OrderStatus.Assigned : OrderStatus.Active
          }
        ),});

        const data = await res.json();
        if(data.status === 200){
          alert('Order created successfully');
        }
      }

      //api call to backend to upload files to folders
    }
  }

  const getAllCategories = async () => {
    const res = await fetch("http://localhost:5221/api/category/with-subcategories", {method: "GET"});
    const data = await res.json();
    setAllCategories(data);
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
      price: price,
      deadlineDate: new Date(date.year, date.month - 1, date.day).toISOString(),
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
    else{
      setOrder(prev=> ({
        ...prev,
        proId: null,
      }) );
    }
  }, [proId])

  useEffect(() => {
    if(additionalComment.length > 0){
      setOrder(prev=> ({ ...prev, additionalComment: additionalComment }) );
    }
  }, [additionalComment])

  useEffect(() => {
    if(isClicked){
      writeFilesAsync(files);
    }
  }, [isClicked])

  const [selectedProId, setSelectedProId] = useState<string | null>(null);

  // 2. Check LocalStorage on Mount
  useEffect(() => {
    // Ensure we are on client-side
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem("proId");
      if (storedId) setSelectedProId(storedId);
    }
  }, []);

  // 3. Handle Cancel
  const handleCancelPro = () => {
    localStorage.removeItem("proId");
    window.location.reload(); // Reloads page as requested
  };

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
          {selectedProId && (
          <div className={`${styles.card} ${styles.proSelectionCard}`}>
            <div className={styles.proSelectionInfo}>
              <div className={styles.proAvatarStub}>
                {/* Placeholder icon or fetch avatar if needed */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div className={styles.proLabel}>Вы выбрали специалиста</div>
                <div className={styles.proId}>ID: #{selectedProId}</div>
              </div>
            </div>
            
            <button onClick={handleCancelPro} className={styles.cancelProBtn} title="Отменить выбор">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              <span>Сбросить</span>
            </button>
          </div>
        )}
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
  
  <div className={styles.formCard} aria-label="Форма создания заказа">
    
    {/* TITLE */}
    <input 
      className={styles.titleInput} 
      placeholder="Краткий заголовок (например: Протекает кран)" 
      value={title} 
      onChange={(e) => setTitle(e.target.value)} 
      autoFocus={formOpen}
    />

    {/* DESCRIPTION */}
    <div>
      <textarea 
        className={styles.desc} 
        placeholder="Опишите задачу подробнее..." 
        value={desc} 
        onChange={(e) => setDesc(e.target.value)} 
      />
      {formErrors.text && (<div className={styles.errorText}>{errorMessage}</div>)}
    </div>

    {/* CONTROLS GRID */}
    <div className={styles.controlsRow}>
      
      {/* 1. LOCATION */}
      <div className={styles.controlPanel}>
        <button type="button" className={styles.rowHeader} aria-expanded={locOpen} onClick={() => { setLocOpen(p => !p); setBudgetOpen(false); setCalOpen(false); }}>
          <span style={{display:'flex', alignItems:'center'}}>
            📍 Локация
            {locationMode.length > 0 && <span className={styles.formBadge}>{locationMode}</span>}
          </span>
          <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        {formErrors.location && (<div className={styles.errorText}>{errorMessage}</div>)}

        <div className={`${styles.rowBody} ${locOpen ? styles.open : ""}`}>
          <div className={styles.inline}>
            {["У меня", "У исполнителя", "Онлайн"].map(mode => (
              <button 
                key={mode}
                type="button" 
                className={`${styles.smallChip} ${locationMode === mode ? styles.smallChipActive : ""}`} 
                onClick={() => {setLocationMode(mode); setLocOpen(false)}}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className={styles.noteText}>Сервис доступен только в г. Тимишоара</div>
        </div>
      </div>

      {/* 2. BUDGET */}
      <div className={styles.controlPanel}>
        <button type="button" className={styles.rowHeader} aria-expanded={budgetOpen} onClick={() => { setBudgetOpen(p => !p); setLocOpen(false); setCalOpen(false); }}>
          <span style={{display:'flex', alignItems:'center'}}>
            💳 Бюджет
            {price !== 0 && <span className={styles.formBadge}>{`${price} RON`}</span>}
          </span>
          <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        {formErrors.budget && (<div className={styles.errorText}>{errorMessage}</div>)}

        <div className={`${styles.rowBody} ${budgetOpen ? styles.open : ""}`}>
          <label className={styles.smallLabel}>Максимальная цена (RON)</label>
          <input type="number" className={styles.inputInline} value={price} onChange={e => setPrice(Number(e.target.value || 0))} min={0} placeholder="0" />
          <div className={styles.quickRow}>
            {[50, 100, 200, 500].map(v => (
              <button key={v} type="button" className={styles.quickBtn} onClick={() => {setPrice(v); setBudgetOpen(false)}}>
                до {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DATES */}
      <div className={styles.controlPanel}>
        <button type="button" className={styles.rowHeader} onClick={() => setCalOpen(p => !p)} aria-expanded={calOpen}>
          <span style={{display:'flex', alignItems:'center'}}>
            📅 Сроки
            {date.year !== 0 && (
              <span className={styles.formBadge}>
                {`${date.day}.${date.month}`} • {timePref.timeStart}-{timePref.timeEnd}
              </span>
            )}
          </span>
          <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        {formErrors.date && (<div className={styles.errorText}>{errorMessage}</div>)}

        {/* Assuming CalendarDropdown handles its own positioning, or you wrap it in rowBody */}
        {calOpen && (
           <div className={` ${styles.open} ${styles.calendarBody}`}>
             <CalendarDropdown initialStart={range.start} onApply={handleApplyDate} onClose={() => setCalOpen(false)} />
           </div>
        )}
      </div>

      {/* 4. FILES */}
      <div className={styles.controlPanel}>
        <label className={styles.rowHeader} htmlFor="filePicker" role="button">
          <span style={{display:'flex', alignItems:'center'}}>
            📎 Файлы
            {files.length > 0 && <span className={styles.formBadge}>{files.length}</span>}
          </span>
          <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        </label>
        <input id="filePicker" type="file" multiple onChange={handleFiles} className={styles.hiddenFile} />
        {formErrors.files && (<div className={styles.errorText}>{errorMessage}</div>)}
      </div>
    </div>

    {/* CATEGORIES & FOOTER */}
    <div>
      <div className={styles.selectedCategories}>
        {selectedCategories.length > 0 ? (
          selectedCategories.map((cat) => (
            <div key={cat.id} onClick={() => selectedCategories.filter((i) => i.id !== cat.id)} className={styles.badge}>
              {cat.title}
            </div>
          ))
        ) : (
          <span className={styles.noteText}>Категория не выбрана</span>
        )}
      </div>
      {formErrors.subcategory && (<div className={styles.errorText}>{errorMessage}</div>)}

      <div className={styles.formFooter}>
        <button type="button" className={styles.btnGhost} onClick={() => {setCategoriesModalOpen(true); getAllCategories()}}>
          {selectedCategories.length > 0 ? "Изменить категорию" : "Выбрать категорию"}
        </button>
        <button type="submit" onClick={handleStep1Continue} className={styles.publishBtn}>
          Продолжить
        </button>
      </div>
    </div>

  </div>
</div>

        {/* Next step below as its own collapsible card */}
        <div className={styles.panelToggle} style={{ marginTop: 18 }}>
          <button
            className={styles.toggleBtn}
            aria-expanded={nextOpen}
            aria-controls="next-step-panel"
            disabled={!steps.step1}
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
          <CompareSection pros={prosCards} setProId={setProId}/>
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
          setIsClicked={setIsClicked}
        />
        </div>
          

        {/* Modal (unchanged) */}
        {categoriesModalOpen && (
          <CategoryModal
            allCategories={allCategories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            // optional: when user picks a category/sub you might want to close modal or keep open
            pickCategory={(c) => {
              pickCategory(c);
              // keep modal open so user can select subcategories, or uncomment to auto-close:
              // setCategoriesModalOpen(false);
            }}
            pickSub={(subId) => {
              pickSub(subId);
            }}
            onClose={() => setCategoriesModalOpen(false)}
          />
        )}
      </div>
    </main>
  );
}
