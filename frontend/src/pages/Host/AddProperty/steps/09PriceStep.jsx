export default function PriceStep({ form, set }) {
  return (
    <div className="flex-1 flex flex-col items-center px-8 py-10 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
        Now, set your price
      </h1>

      <p className="text-gray-500 text-sm mb-8 self-start">
        You can change it anytime.
      </p>

      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="text-5xl font-bold text-gray-400">₹</span>

        <input
          type="number"
          value={form.price}
          onChange={(e) => set("price", e.target.value)}
          placeholder="2299"
          className="w-48 text-6xl font-bold text-gray-900 outline-none text-center border-b-2 border-gray-300 focus:border-gray-900 transition bg-transparent"
        />
      </div>

      <div className="w-full border border-gray-200 rounded-2xl divide-y divide-gray-100">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-semibold text-gray-900">Base price</p>
            <p className="text-sm text-gray-500">
              ₹
              {form.price
                ? Number(form.price).toLocaleString("en-IN")
                : "2,299"}{" "}
              per night
            </p>
          </div>

          <span className="text-gray-400">›</span>
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-semibold text-gray-900">Discounts</p>
            <p className="text-sm text-gray-500">10% weekly · 20% monthly</p>
          </div>

          <span className="text-gray-400">›</span>
        </div>

        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-semibold text-gray-900">Availability</p>
            <p className="text-sm text-gray-500">
              1–365 night stays · Same-day advance notice
            </p>
          </div>

          <span className="text-gray-400">›</span>
        </div>
      </div>

      {form.price && (
        <div className="mt-4 bg-gray-50 rounded-2xl px-5 py-4 w-full text-center">
          <p className="text-sm text-gray-500">Estimated monthly earnings</p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            ₹{(Number(form.price) * 20).toLocaleString("en-IN")}
          </p>

          <p className="text-xs text-gray-400 mt-1">Based on 20 nights/month</p>
        </div>
      )}
    </div>
  );
}
