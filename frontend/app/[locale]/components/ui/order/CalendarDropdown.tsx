"use client";
import React, { useState } from "react";
import styles from "./CalendarDropdown.module.css";

export default function CalendarDropdown({ initialStart = null, onApply, onClose }) {
  const today = new Date();
  const [tab, setTab] = useState("date"); // 'date' | 'period'
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const [start, setStart] = useState(initialStart ? normalize(initialStart) : null);

  const [selectedDate, setSelectedDate] = useState(30);
  const [time, setTime] = useState("any");

  // helper to move month
  function changeMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m); setViewYear(y);
  }

  // pick a day
  function pickDay(d) {
    // d is Date (normalized)
    if (tab === "date") {
      setStart(d); 
      return;
    }

  }

  function applySelection() {
    if (!start) {
      return;
    }

    // Parse time range
    let timeStart = "";
    let timeEnd = "";

    if (time !== "any") {
      const [s, e] = time.split("-");
      timeStart = s + ":00";
      timeEnd = e + ":00";
    }

    // Pass date + time to parent
    onApply &&
      onApply({
        date: start,
        timeStart,
        timeEnd,
        timePref: time,
      });

    onClose && onClose();
  }

  function clearSelection() {
    setStart(null);
  }

  // build calendar grid for viewMonth/viewYear
  const weeks = buildCalendar(viewYear, viewMonth);

  const monthLabel = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(new Date(viewYear, viewMonth, 1));

  // helper: whether date is in selected range
  function inRange(d) {
    if (!start) return false;
    return d.getTime() === start.getTime();
  }

  function isPast(d) {
    const t = normalize(today).getTime();
    return d.getTime() < t;
  }

  return (
    <div className={styles.wrapper} role="dialog" aria-modal="true">
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === "date" ? styles.activeTab : ""}`} onClick={() => setTab("date")}>Дата</button>
        </div>

        <div className={styles.monthRow}>
          <button className={styles.nav} onClick={() => changeMonth(-1)} aria-label="Предыдущий месяц">‹</button>
          <div className={styles.monthLabel}>{monthLabel}</div>
          <button className={styles.nav} onClick={() => changeMonth(1)} aria-label="Следующий месяц">›</button>
        </div>
      </div>

      <div className={styles.calendar}>
        <div className={styles.weekNames}>
          {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((d) => (
            <div key={d} className={styles.weekName}>{d}</div>
          ))}
        </div>

        <div className={styles.daysGrid}>
          {weeks.map((week, wi) => (
            <div key={wi} className={styles.weekRow}>
              {week.map((cell, ci) => {
                if (!cell) return <div key={ci} className={styles.dayCellEmpty} />;
                const date = cell;
                const disabled = isPast(date);
                const selected = inRange(date);
                const isStart = start && date.getTime() === start.getTime();

                return (
                  <button
                    key={ci}
                    type="button"
                    className={`${styles.dayCell} ${disabled ? styles.dayDisabled : ""} ${selected ? styles.daySelected : ""} ${isStart ? styles.dayStart : ""} `}
                    onClick={() => !disabled && pickDay(date)}
                    disabled={disabled}
                    aria-pressed={selected}
                    aria-label={formatFull(date)}
                  >
                    <span className={styles.dayNumber}>{date.getDate()}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.timeOptions}>
        <label className={styles.radio}>
          <input
            type="radio"
            name="time"
            checked={time === "any"}
            onChange={() => setTime("any")}
          />
          <span>В любое время</span>
        </label>

        <label className={styles.radio}>
          <input
            type="radio"
            name="time"
            checked={time === "8-12"}
            onChange={() => setTime("8-12")}
          />
          <span>З 8:00 до 12:00</span>
        </label>

        <label className={styles.radio}>
          <input
            type="radio"
            name="time"
            checked={time === "12-16"}
            onChange={() => setTime("12-16")}
          />
          <span>З 12:00 до 16:00</span>
        </label>

        <label className={styles.radio}>
          <input
            type="radio"
            name="time"
            checked={time === "16-22"}
            onChange={() => setTime("16-22")}
          />
          <span>З 16:00 до 22:00</span>
        </label>
      </div>

      <div className={styles.controls}>
        <div className={styles.currentSelection}>
          {start ? <span>{formatShort(start)}</span> : <span>{formatShort(start)}</span>}
        </div>

        <div className={styles.actionButtons}>
          <button type="button" className={styles.clearBtn} onClick={clearSelection}>Очистить</button>
          <button type="button" className={styles.applyBtn} onClick={applySelection}>Применить</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------ helpers ------------------ */

function normalize(d) {
  const nd = new Date(d);
  nd.setHours(0,0,0,0);
  return nd;
}

function buildCalendar(year, month) {
  // returns array of 6 weeks x 7 days (cells are Date or null)
  // week starts Monday
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const daysInMonth = last.getDate();

  // weekday: Monday=0 .. Sunday=6
  const firstWeekDay = (first.getDay() + 6) % 7;
  const weeks = [];
  let day = 1 - firstWeekDay;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let i = 0; i < 7; i++, day++) {
      if (day < 1 || day > daysInMonth) {
        week.push(null);
      } else {
        week.push(normalize(new Date(year, month, day)));
      }
    }
    weeks.push(week);
  }
  return weeks;
}

function formatShort(d) {
  // e.g. '26 ноя'
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(d);
}
function formatFull(d) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(d);
}
