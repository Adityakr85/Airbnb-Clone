// src/pages/Public/PropertyDetails/components/BookingCard.jsx
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../../../../api/trips";

export default function BookingCard({
  property,
  defaultCheckIn,
  defaultCheckOut,
}) {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  const price = Number(property.price || 0);

  const [checkIn, setCheckIn] = useState(
    defaultCheckIn ? defaultCheckIn.toISOString().split("T")[0] : "",
  );

  const [checkOut, setCheckOut] = useState(
    defaultCheckOut ? defaultCheckOut.toISOString().split("T")[0] : "",
  );

  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const nights = getNights(checkIn, checkOut);
  const total = price * nights;

  const handleReserve = async () => {
    if (!isSignedIn) {
      alert("Please sign in to make a reservation.");
      return;
    }

    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    try {
      setLoading(true);

      await createReservation({
        clerk_id: user.id,
        property_id: property.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total,
        message: `Booking for ${guests} guests`,
      });

      alert("Reservation request submitted successfully!");
      navigate("/pages/User/Trips");
    } catch (error) {
      console.error(error.response?.data);

      alert(
        error.response?.data?.message || JSON.stringify(error.response?.data),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-900">
        ₹{price.toLocaleString("en-IN")}
        <span className="text-base font-normal text-gray-500"> / night</span>
      </h2>

      <div className="mt-5 overflow-hidden rounded-2xl border border-gray-300">
        <div className="grid grid-cols-2">
          <DateInput label="CHECK-IN" value={checkIn} onChange={setCheckIn} />
          <DateInput
            label="CHECK-OUT"
            value={checkOut}
            onChange={setCheckOut}
            border
          />
        </div>

        <div className="border-t border-gray-300 p-4">
          <label className="text-[10px] font-bold uppercase text-gray-700">
            Guests
          </label>

          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="mt-1 w-full bg-transparent text-sm outline-none"
          >
            {Array.from({ length: Math.max(property.guests || 1, 1) }).map(
              (_, index) => {
                const value = index + 1;

                return (
                  <option key={value} value={value}>
                    {value} guest{value > 1 ? "s" : ""}
                  </option>
                );
              },
            )}
          </select>
        </div>
      </div>

      {nights > 0 && (
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>
              ₹{price.toLocaleString("en-IN")} x {nights} nights
            </span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between border-t pt-3 text-lg font-bold">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleReserve}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-[#FF385C] py-3 font-semibold text-white transition hover:bg-[#E31C5F] disabled:opacity-50"
      >
        {loading ? "Processing..." : "Reserve"}
      </button>

      <p className="mt-3 text-center text-sm text-gray-500">
        You won't be charged yet
      </p>
    </div>
  );
}

function DateInput({ label, value, onChange, border }) {
  return (
    <div className={`p-4 ${border ? "border-l border-gray-300" : ""}`}>
      <label className="text-[10px] font-bold uppercase text-gray-700">
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full text-sm outline-none"
      />
    </div>
  );
}

function getNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;

  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  return nights > 0 ? nights : 0;
}
