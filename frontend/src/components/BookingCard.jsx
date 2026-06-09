function BookingCard({ price }) {
  return (
    <div className="border rounded-xl p-6 shadow-lg h-fit sticky top-6">
      <h2 className="text-2xl font-bold">
        ₹{price}
        <span className="text-base font-normal text-gray-600">
          {" "}
          / night
        </span>
      </h2>

      <div className="mt-4 border rounded-lg">
        <div className="grid grid-cols-2">
          <div className="border-r p-3">
            <p className="text-xs font-semibold">
              CHECK-IN
            </p>
            <p>12/06/2026</p>
          </div>

          <div className="p-3">
            <p className="text-xs font-semibold">
              CHECK-OUT
            </p>
            <p>15/06/2026</p>
          </div>
        </div>

        <div className="border-t p-3">
          <p className="text-xs font-semibold">
            GUESTS
          </p>
          <p>2 guests</p>
        </div>
      </div>

      <button className="w-full mt-4 bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600">
        Reserve
      </button>

      <p className="text-center text-sm text-gray-500 mt-3">
        You won't be charged yet
      </p>
    </div>
  );
}

export default BookingCard;