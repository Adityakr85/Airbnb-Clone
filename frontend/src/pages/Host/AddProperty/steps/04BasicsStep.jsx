export default function BasicsStep({ form, set }) {
  const fields = [
    { label: "Guests", field: "guests" },
    { label: "Bedrooms", field: "bedrooms" },
    { label: "Bathrooms", field: "bathrooms" },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 max-w-xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
        Share some basics about your place
      </h1>

      <p className="text-gray-500 text-sm mb-8 self-start">
        Add the guest capacity and room details.
      </p>

      {fields.map(({ label, field }) => (
        <div
          key={field}
          className="flex items-center justify-between w-full py-5 border-b border-gray-100"
        >
          <p className="font-semibold text-gray-900">{label}</p>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => set(field, Math.max(0, Number(form[field]) - 1))}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 text-xl hover:border-gray-500 transition"
            >
              −
            </button>

            <span className="w-5 text-center font-medium">{form[field]}</span>

            <button
              type="button"
              onClick={() => set(field, Number(form[field]) + 1)}
              className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 text-xl hover:border-gray-500 transition"
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
