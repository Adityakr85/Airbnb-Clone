import React from 'react';

const GuestDropdown = ({ adults, setAdults, childrenCount, setChildrenCount, infants, setInfants, pets, setPets }) => {
  
  const handleIncrement = (type) => {
    if (type === 'adults') setAdults(adults + 1);
    if (type === 'children') {
      setChildrenCount(childrenCount + 1);
      if (adults === 0) setAdults(1); 
    }
    if (type === 'infants') {
      setInfants(infants + 1);
      if (adults === 0) setAdults(1); 
    }
    if (type === 'pets') {
      setPets(pets + 1);
      if (adults === 0) setAdults(1); 
    }
  };

  const handleDecrement = (type) => {
    if (type === 'adults' && adults > 0) {
      if (adults === 1 && (childrenCount > 0 || infants > 0 || pets > 0)) return; // Prevent removing last adult
      setAdults(adults - 1);
    }
    if (type === 'children' && childrenCount > 0) setChildrenCount(childrenCount - 1);
    if (type === 'infants' && infants > 0) setInfants(infants - 1);
    if (type === 'pets' && pets > 0) setPets(pets - 1);
  };

const CounterRow = ({ title, subtitle, count, type }) => {
    const isMinusDisabled = count === 0 || (type === 'adults' && adults === 1 && (childrenCount > 0 || infants > 0 || pets > 0));

    return (
      <div className="flex items-center justify-between py-6 border-b border-gray-100 last:border-none">
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={() => handleDecrement(type)}
            disabled={isMinusDisabled}
            className={`w-8 h-8 rounded-full border flex items-center justify-center text-xl pb-1 leading-none transition-colors ${
              isMinusDisabled ? 'border-gray-200 text-gray-200 cursor-not-allowed' : 'border-gray-400 text-gray-600 hover:border-black hover:text-black'
            }`}
          >
            -
          </button>
          <span className="w-4 text-center font-medium text-gray-800">{count}</span>
          <button 
            type="button"
            onClick={() => handleIncrement(type)}
            className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-xl pb-1 leading-none text-gray-600 hover:border-black hover:text-black transition-colors"
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute top-full mt-4 right-0 w-[400px] bg-white rounded-3xl shadow-xl border border-gray-200 px-8 py-4 z-50 cursor-default">
      <CounterRow title="Adults" subtitle="Ages 13 or above" count={adults} type="adults" />
      <CounterRow title="Children" subtitle="Ages 2-12" count={childrenCount} type="children" />
      <CounterRow title="Infants" subtitle="Under 2" count={infants} type="infants" />
      <CounterRow title="Pets" subtitle="Bringing a service animal?" count={pets} type="pets" />
    </div>
  );
};

export default GuestDropdown;