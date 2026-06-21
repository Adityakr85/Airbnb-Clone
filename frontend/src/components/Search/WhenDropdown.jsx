import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

const normalizeDate = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const STAY_OPTIONS = [
  { id: "weekend", label: "Weekend" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

const FLEX_OPTIONS = ["exact", "1", "2", "3", "7"];

export default function WhenDropdown({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  advanceToNext,
  activeTab,
  setActiveTab,
  stayLength,
  setStayLength,
  flexibleMonths,
  setFlexibleMonths,
  exactDatesFlex,
  setExactDatesFlex,
}) {
  const location = useLocation();
  const isQuickSelect = location.pathname === "/experiences" || location.pathname === "/services";
  const [hoverDate, setHoverDate] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const carouselRef = useRef(null);

  const { today, tomorrow, nextFriday, nextSunday } = useMemo(() => {
    const t = normalizeDate(new Date());
    const tmrw = new Date(t); tmrw.setDate(t.getDate() + 1);
    const fri = new Date(t); fri.setDate(t.getDate() + ((7 - t.getDay() + 5) % 7 || 7));
    const sun = new Date(fri); sun.setDate(fri.getDate() + 2);
    return { today: t, tomorrow: tmrw, nextFriday: fri, nextSunday: sun };
  }, []);

  const formatShortDate = (d) => d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  const handleQuickSelect = (type) => {
    if (type === "today") { setStartDate(today); setEndDate(null); }
    else if (type === "tomorrow") { setStartDate(tomorrow); setEndDate(null); }
    else if (type === "weekend") { setStartDate(nextFriday); setEndDate(nextSunday); }
  };
  const handleDateClick = (date) => {
    const clickedDate = normalizeDate(date);
    if (isQuickSelect) {
      setStartDate(clickedDate);
      setEndDate(null);
      setExactDatesFlex("exact");
      return
    }

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
      setExactDatesFlex("exact");
      return;
    }

    if (clickedDate < startDate) {
      setEndDate(startDate);
      setStartDate(clickedDate);
    } else {
      setEndDate(clickedDate);
    }
  };

  const isSelected = (date) => {
    const current = normalizeDate(date).getTime();

    return (
      (startDate && current === startDate.getTime()) ||
      (endDate && current === endDate.getTime())
    );
  };

  const isInRange = (date) => {
    if (!startDate) return false;

    const current = normalizeDate(date).getTime();
    const start = startDate.getTime();

    if (endDate) {
      return current > start && current < endDate.getTime();
    }

    if (hoverDate) {
      const hover = hoverDate.getTime();
      if (hover > start) {
        return current > start && current < hover;
      }
      if (hover < start) {
        return current < start && current > hover;
      }
    }

    return false;
  };

  const isPast = (date) => normalizeDate(date) < today;

  const scrollCarousel = (direction) => {
    carouselRef.current?.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  const toggleFlexibleMonth = (id) => {
    if (flexibleMonths.includes(id)) {
      setFlexibleMonths(flexibleMonths.filter((month) => month !== id));
    } else {
      setFlexibleMonths([...flexibleMonths, id]);
    }
  };

  const renderMonth = (offset) => {
    const targetMonth = new Date(
      today.getFullYear(),
      today.getMonth() + monthOffset + offset,
      1,
    );

    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();
    const monthName = targetMonth.toLocaleString("default", {
      month: "long",
    });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    const flexDays = exactDatesFlex === "exact" ? 0 : parseInt(exactDatesFlex);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${year}-${month}-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = normalizeDate(new Date(year, month, day));
      const currentTimestamp = currentDate.getTime();

      const disabled = isPast(currentDate);
      const selected = isSelected(currentDate);
      const inRange = isInRange(currentDate);
      
      let isFlexHighlight = false;
      if (flexDays > 0 && startDate && !disabled && !selected && !inRange) {
        const startTs = startDate.getTime();
        const endTs = endDate ? endDate.getTime() : startTs;
        const flexStart = startTs - flexDays * 24 * 60 * 60 * 1000;
        const flexEnd = endTs + flexDays * 24 * 60 * 60 * 1000;

        if (currentTimestamp >= flexStart && currentTimestamp <= flexEnd) {
          isFlexHighlight = true;
        }
      }

      let buttonClass = "bg-transparent text-gray-900 hover:border hover:border-black";
      let wrapperClass = "rounded-full";

      if (disabled) {
        buttonClass = "cursor-not-allowed text-gray-300 line-through";
      } else if (selected) {
        buttonClass = "bg-gray-900 font-semibold text-white";

        if (startDate && currentTimestamp === startDate.getTime()) {
          if (!endDate && hoverDate && hoverDate.getTime() < startDate.getTime()) {
            wrapperClass = "rounded-r-full bg-gray-100";
          } else {
            wrapperClass = "rounded-l-full bg-gray-100";
          }
        }

        if (endDate && currentTimestamp === endDate.getTime()) {
          wrapperClass = "rounded-r-full bg-gray-100";
        }
      } else if (inRange) {
        buttonClass = "bg-gray-100 text-gray-900 hover:border hover:border-black hover:bg-white";
        wrapperClass = "bg-gray-100";
      } else if (isFlexHighlight) {
        buttonClass = "bg-gray-50 border border-gray-300 border-dashed text-gray-700 hover:border-black hover:border-solid hover:bg-white";
      }

      days.push(
        <div
          key={`${year}-${month}-${day}`}
          className={`flex items-center justify-center p-px ${wrapperClass}`}
        >
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleDateClick(currentDate)}
            onMouseEnter={() => !disabled && setHoverDate(currentDate)}
            onMouseLeave={() => setHoverDate(null)}
            className={`cursor-pointer flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all ${buttonClass}`}
          >
            {day}
          </button>
        </div>,
      );
    }

    return (
      <div key={`${year}-${month}`} className="px-4">
        <div className="mb-4 text-center font-semibold">
          {monthName} {year}
        </div>

        <div className="grid grid-cols-7 text-center text-sm font-medium">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="mb-1 text-xs text-gray-400">
              {day}
            </div>
          ))}

          {days}
        </div>
      </div>
    );
  };

  const flexibleMonthCards = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() + index, 1);

      const id = `${date.getMonth()}-${date.getFullYear()}`;
      const selected = flexibleMonths.includes(id);

      return (
        <button
          type="button"
          key={id}
          onClick={() => toggleFlexibleMonth(id)}
          className={`cursor-pointer flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-2xl border transition-all ${
            selected
              ? "scale-95 border-2 border-gray-900 bg-gray-50"
              : "border-gray-200 bg-white hover:border-gray-400"
          }`}
        >
          <span className="mb-1 text-2xl">🗓️</span>

          <span className="text-sm font-semibold text-gray-900">
            {date.toLocaleString("default", { month: "short" })}
          </span>

          <span className="text-xs text-gray-500">{date.getFullYear()}</span>
        </button>
      );
    });
  }, [today, flexibleMonths]);

  if (isQuickSelect) {
    return (
      <div onClick={(e) => e.stopPropagation()} className="cursor-default absolute left-1/2 top-full z-50 mt-4 flex w-[700px] -translate-x-1/2 rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="flex w-1/3 flex-col gap-4 pr-8">
          <button type="button" onClick={() => handleQuickSelect("today")} className="cursor-pointer flex flex-col rounded-2xl border border-gray-200 p-4 text-left transition hover:border-black shadow-sm">
            <span className="font-semibold text-gray-900">Today</span>
            <span className="text-sm text-gray-500">{formatShortDate(today)}</span>
          </button>
          <button type="button" onClick={() => handleQuickSelect("tomorrow")} className="cursor-pointer flex flex-col rounded-2xl border border-gray-200 p-4 text-left transition hover:border-black shadow-sm">
            <span className="font-semibold text-gray-900">Tomorrow</span>
            <span className="text-sm text-gray-500">{formatShortDate(tomorrow)}</span>
          </button>
          <button type="button" onClick={() => handleQuickSelect("weekend")} className="cursor-pointer flex flex-col rounded-2xl border border-gray-200 p-4 text-left transition hover:border-black shadow-sm">
            <span className="font-semibold text-gray-900">Next weekend</span>
            <span className="text-sm text-gray-500">{nextFriday.getDate()}–{formatShortDate(nextSunday)}</span>
          </button>
        </div>
        <div className="relative flex-1 border-l border-gray-100 pl-4">
          <button type="button" onClick={() => setMonthOffset((prev) => prev - 1)} disabled={monthOffset <= 0} className={`cursor-pointer absolute left-6 top-0 z-10 rounded-full p-2 transition ${monthOffset <= 0 ? "cursor-not-allowed text-gray-300" : "text-gray-600 hover:bg-gray-100 hover:text-black"}`}>
            <ChevronLeft size={22} />
          </button>
          <button type="button" onClick={() => setMonthOffset((prev) => prev + 1)} className="cursor-pointer absolute right-6 top-0 z-10 rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black">
            <ChevronRight size={22} />
          </button>
          {renderMonth(0)}
        </div>
      </div>
    );
  }

  return (
    <div onClick={(e) => e.stopPropagation()}
      className="cursor-default absolute left-1/2 top-full z-50 mt-4 w-[800px] -translate-x-1/2 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl" 
    >
      <div className="mb-4 flex justify-center">
        <div className="flex rounded-full bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("dates")}
            className={`cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTab === "dates"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dates
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("flexible")}
            className={`cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTab === "flexible"
                ? "bg-white text-gray-900 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Flexible
          </button>
        </div>
      </div>

      {activeTab === "dates" && (
        <div>
          <div className="relative mb-4 border-b border-gray-100 pb-4">
            <button
              type="button"
              onClick={() => setMonthOffset((prev) => prev - 1)}
              disabled={monthOffset <= 0}
              className={`cursor-pointer absolute left-0 top-0 rounded-full p-2 transition ${
                monthOffset <= 0
                  ? "cursor-not-allowed text-gray-300"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={() => setMonthOffset((prev) => prev + 1)}
              className="cursor-pointer absolute right-0 top-0 rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black"
            >
              <ChevronRight size={22} />
            </button>

            <div className="grid grid-cols-2 px-6">
              {renderMonth(0)}
              {renderMonth(1)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {FLEX_OPTIONS.map((option) => {
              const isDisabled = false;
              
              return (
                <button
                  type="button"
                  key={option}
                  disabled={isDisabled}
                  onClick={() => {
                    setExactDatesFlex(option);
                    
                    if (startDate && !endDate) {
                      setEndDate(startDate);
                    }
                  }}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isDisabled
                      ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 opacity-70"
                      : exactDatesFlex === option
                      ? "border-2 border-gray-900 bg-gray-50 text-gray-900"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                  }`}
                >
                  {option === "exact"
                    ? "Exact dates"
                    : `± ${option} day${option === "1" ? "" : "s"}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "flexible" && (
        <div className="flex flex-col items-center pt-2">
          <h3 className="mb-4 font-semibold text-gray-900">
            How long would you like to stay?
          </h3>

          <div className="mb-6 flex gap-3">
            {STAY_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => setStayLength(option.id)}
                className={`cursor-pointer rounded-full border px-6 py-2 text-sm font-medium transition ${
                  stayLength === option.id
                    ? "border-2 border-gray-900 bg-gray-50"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <h3 className="mb-4 font-semibold text-gray-900">
            When do you want to go?
          </h3>

          <div className="relative w-full px-10">
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              className="cursor-pointer absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-md transition hover:scale-105 hover:text-black"
            >
              <ChevronLeft size={20} />
            </button>

            <div
              ref={carouselRef}
              className="scrollbar-hide flex gap-4 overflow-x-auto pb-4 scroll-smooth"
            >
              {flexibleMonthCards}
            </div>

            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              className="cursor-pointer absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-md transition hover:scale-105 hover:text-black"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
