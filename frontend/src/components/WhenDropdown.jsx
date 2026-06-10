import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WhenDropdown = ({startDate, setStartDate,endDate, setEndDate,activeTab, setActiveTab,stayLength, setStayLength,flexibleMonths, setFlexibleMonths, exactDatesFlex, setExactDatesFlex }) => {
  
  // --- DATES TAB STATES ---
  const [hoverDate, setHoverDate] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0); 

  const carouselRef = useRef(null);

  // --- DATE MATH HELPERS ---
  const normalizeDate = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = normalizeDate(new Date());

  const handleDateClick = (date) => {
    const clickedDate = normalizeDate(date);
    
    if (!startDate) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setStartDate(clickedDate); 
      } else {
        setEndDate(clickedDate); 
      }
    } else if (startDate && endDate) {
      setStartDate(clickedDate);
      setEndDate(null);
    }
  };

  const isSelected = (date) => {
    if (!date) return false;
    const d = normalizeDate(date).getTime();
    return (
      (startDate && d === startDate.getTime()) ||
      (endDate && d === endDate.getTime())
    );
  };

  const isInRange = (date) => {
    if (!date || !startDate) return false;
    const d = normalizeDate(date).getTime();
    const start = startDate.getTime();

    if (startDate && endDate) {
      return d > start && d < endDate.getTime();
    }
    if (startDate && hoverDate) {
      return d > start && d < hoverDate.getTime();
    }
    return false;
  };

  const isPast = (date) => normalizeDate(date) < today;

  // --- CAROUSEL SCROLL LOGIC ---
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 250; 
      carouselRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  // --- RENDER A SINGLE MONTH FOR DATES TAB ---
  const renderMonth = (offset) => {
    const targetMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset + offset, 1);
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();
    
    const monthName = targetMonth.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); 

    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${year}-${month}-${i}`} className="p-1"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = normalizeDate(new Date(year, month, i));
      const disabled = isPast(currentDate);
      const selected = isSelected(currentDate);
      const inRange = isInRange(currentDate);
      
      let bgClass = "bg-transparent hover:border-black hover:border";
      let textClass = "text-gray-900";
      let wrapperClass = "rounded-full";

      if (disabled) {
        bgClass = "text-gray-300 cursor-not-allowed line-through";
        textClass = "text-gray-300";
      } else if (selected) {
        bgClass = "bg-gray-900 text-white font-semibold";
        textClass = "text-white";
        if (startDate && !endDate && currentDate.getTime() === startDate.getTime() && hoverDate > startDate) wrapperClass = "rounded-l-full bg-gray-100";
        if (startDate && endDate && currentDate.getTime() === startDate.getTime()) wrapperClass = "rounded-l-full bg-gray-100";
        if (startDate && endDate && currentDate.getTime() === endDate.getTime()) wrapperClass = "rounded-r-full bg-gray-100";
      } else if (inRange) {
        bgClass = "bg-gray-100 hover:bg-white hover:border-black hover:border";
        wrapperClass = "bg-gray-100";
      }

      days.push(
        <div key={`${year}-${month}-${i}`} className={`flex items-center justify-center p-[1px] ${wrapperClass}`}>
          {/* Reduced size from w-10 h-10 to w-9 h-9 */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleDateClick(currentDate)}
            onMouseEnter={() => !disabled && setHoverDate(currentDate)}
            onMouseLeave={() => setHoverDate(null)}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all text-sm ${bgClass} ${textClass}`}
          >
            {i}
          </button>
        </div>
      );
    }

    return (
      <div key={`${year}-${month}`} className="px-2 md:px-4">
        <div className="text-center font-semibold mb-4">{monthName} {year}</div>
        <div className="grid grid-cols-7 gap-y-0 text-center text-sm font-medium">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-gray-400 text-xs mb-1">{day}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  // --- RENDER FLEXIBLE TAB MONTH CAROUSEL ---
  const renderFlexibleMonths = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const id = `${d.getMonth()}-${d.getFullYear()}`;
      const isSelected = flexibleMonths.includes(id);

      const toggleMonth = () => {
        if (isSelected) {
          setFlexibleMonths(flexibleMonths.filter(m => m !== id));
        } else {
          setFlexibleMonths([...flexibleMonths, id]);
        }
      };

      return (
        // Reduced from w-[130px] h-[130px] to w-[110px] h-[110px]
        <button
          type="button"
          key={id}
          onClick={toggleMonth}
          className={`flex-shrink-0 w-[110px] h-[110px] flex flex-col items-center justify-center border rounded-2xl transition-all ${
            isSelected 
              ? 'border-2 border-gray-900 bg-gray-50 scale-[0.98]' 
              : 'border-gray-200 hover:border-gray-400 bg-white'
          }`}
        >
          <span className="text-2xl mb-1">🗓️</span>
          <span className="text-sm font-semibold text-gray-900">{d.toLocaleString('default', { month: 'short' })}</span>
          <span className="text-xs text-gray-500">{d.getFullYear()}</span>
        </button>
      );
    });
  };

  return (
    // Reduced outer padding from p-8 to p-6
    <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[800px] bg-white rounded-3xl shadow-xl border border-gray-200 p-6 z-50 cursor-default">
      
      {/* Top Layer: View Toggle */}
      {/* Reduced margin from mb-8 to mb-4 */}
      <div className="flex justify-center mb-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-full">
          <button 
            type="button"
            onClick={() => setActiveTab('dates')}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'dates' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Dates
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('flexible')}
            className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'flexible' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Flexible
          </button>
        </div>
      </div>

      {activeTab === 'dates' && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          
          {/* Middle Layer: 2-Month Calendar with Arrows */}
          {/* Reduced margin from mb-6 pb-6 to mb-4 pb-4 */}
          <div className="relative mb-4 pb-4 border-b border-gray-100">
            <button 
              type="button"
              onClick={() => setMonthOffset(prev => prev - 1)}
              disabled={monthOffset <= 0} 
              className={`absolute left-0 top-0 p-2 rounded-full transition-all ${monthOffset <= 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
            >
              <ChevronLeft size={22} />
            </button>
            <button 
              type="button"
              onClick={() => setMonthOffset(prev => prev + 1)}
              className="absolute right-0 top-0 p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-black transition-all"
            >
              <ChevronRight size={22} />
            </button>

            <div className="grid grid-cols-2 px-6">
              {renderMonth(0)}
              {renderMonth(1)}
            </div>
          </div>

          {/* Bottom Layer: Flexibility Pills */}
          <div className="flex items-center space-x-3">
            {['exact', '1', '2', '7'].map((flexType) => (
              <button 
                type="button"
                key={flexType}
                onClick={() => setExactDatesFlex(flexType)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  exactDatesFlex === flexType 
                    ? 'border-2 border-gray-900 bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-900 bg-white text-gray-700'
                }`}
              >
                {flexType === 'exact' ? 'Exact dates' : `± ${flexType} day${flexType === '1' ? '' : 's'}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'flexible' && (
        <div className="flex flex-col items-center pt-2 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Reduced heading sizes and margins */}
          <h3 className="text-base font-semibold text-gray-900 mb-4">How long would you like to stay?</h3>
          
          <div className="flex space-x-3 mb-6">
            {[
              { id: 'weekend', label: 'Weekend' },
              { id: 'week', label: 'Week' },
              { id: 'month', label: 'Month' }
            ].map(type => (
              <button
                type="button"
                key={type.id}
                onClick={() => setStayLength(type.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all border ${
                  stayLength === type.id 
                    ? 'border-2 border-gray-900 bg-gray-50' 
                    : 'border-gray-300 hover:border-gray-900 bg-white text-gray-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <h3 className="text-base font-semibold text-gray-900 mb-4">When do you want to go?</h3>
          
          <div className="w-full relative px-10">
            <button 
              type="button"
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-gray-200 rounded-full shadow-md text-gray-600 hover:scale-105 hover:text-black transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div 
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto pb-4 snap-x smooth-scroll scrollbar-hide" 
            >
              {renderFlexibleMonths()}
            </div>
            
            <button 
              type="button"
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-gray-200 rounded-full shadow-md text-gray-600 hover:scale-105 hover:text-black transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default WhenDropdown;