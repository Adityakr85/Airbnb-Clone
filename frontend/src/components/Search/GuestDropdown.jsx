const guestTypes = [
  {
    key: "adults",
    title: "Adults",
    subtitle: "Ages 13 or above",
  },
  {
    key: "children",
    title: "Children",
    subtitle: "Ages 2-12",
  },
  {
    key: "infants",
    title: "Infants",
    subtitle: "Under 2",
  },
  {
    key: "pets",
    title: "Pets",
    subtitle: "Bringing a service animal?",
  },
];

export default function GuestDropdown({
  adults,
  setAdults,
  childrenCount,
  setChildrenCount,
  infants,
  setInfants,
  pets,
  setPets,
}) {
  const guestData = {
    adults,
    children: childrenCount,
    infants,
    pets,
  };

  const guestSetters = {
    adults: setAdults,
    children: setChildrenCount,
    infants: setInfants,
    pets: setPets,
  };

  const hasDependents = childrenCount > 0 || infants > 0 || pets > 0;

  const increment = (type) => {
    guestSetters[type](guestData[type] + 1);

    if (type !== "adults" && adults === 0) {
      setAdults(1);
    }
  };

  const decrement = (type) => {
    if (guestData[type] === 0) return;

    if (type === "adults" && adults === 1 && hasDependents) {
      return;
    }

    guestSetters[type](guestData[type] - 1);
  };

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-full z-50 mt-4 w-96 rounded-3xl border border-gray-200 bg-white px-8 py-4 shadow-xl cursor-default"
    >
      {guestTypes.map((guest) => {
        const count = guestData[guest.key];

        const disableMinus =
          count === 0 ||
          (guest.key === "adults" && adults === 1 && hasDependents);

        return (
          <div
            key={guest.key}
            className="flex items-center justify-between border-b border-gray-100 py-6 last:border-none"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{guest.title}</h3>

              <p className="text-sm text-gray-500">{guest.subtitle}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={disableMinus}
                onClick={() => decrement(guest.key)}
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xl transition ${
                  disableMinus
                    ? "cursor-not-allowed border-gray-200 text-gray-200"
                    : "cursor-pointer border-gray-400 text-gray-600 hover:border-black hover:text-black"
                }`}
              >
                −
              </button>

              <span className="w-5 text-center font-medium text-gray-900">
                {count}
              </span>

              <button
                type="button"
                onClick={() => increment(guest.key)}
                className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-xl text-gray-600 transition hover:border-black hover:text-black"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
