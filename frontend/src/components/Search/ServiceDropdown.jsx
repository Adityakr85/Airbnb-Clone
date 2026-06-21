import React from "react";
import { 
  Camera, ChefHat, Sparkles, Utensils, 
  Activity, Brush, Scissors, Flower2, Truck 
} from "lucide-react";

export default function ServiceDropdown({ serviceType, setServiceType, advanceToNext }) {
  const services = [
    { name: "Photography", icon: Camera },
    { name: "Chefs", icon: ChefHat },
    { name: "Massage", icon: Sparkles },
    { name: "Prepared meals", icon: Utensils },
    { name: "Training", icon: Activity },
    { name: "Make-up", icon: Brush },
    { name: "Hair", icon: Scissors },
    { name: "Spa treatments", icon: Flower2 },
    { name: "Catering", icon: Truck },
  ];

  return (
    <div
      className="absolute right-0 top-full mt-4 w-[480px] cursor-default rounded-[32px] bg-white p-8 shadow-[0_6px_20px_rgba(0,0,0,0.2)] z-50"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="flex flex-wrap gap-3">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = serviceType === service.name;
          
          return (
            <button
              key={service.name}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setServiceType(service.name);
              }}
              className={`cursor-pointer flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-all ${
                isSelected 
                  ? "border-black bg-gray-100 text-black shadow-sm ring-1 ring-black cursor-default" 
                  : "border-[#DDDDDD] bg-white text-[#222222] hover:border-black"
              }`}
            >
              <Icon size={18} strokeWidth={2} className={isSelected ? "text-black" : "text-[#717171]"} />
              {service.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}