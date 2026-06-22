import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { createReservation } from "../api/trips";

function BookingCard({ property }) {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const price = property.price || 0;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
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
        guests: guests,
        total: total,
        message: `Booking for ${guests} guests`,
      });
      alert("Reservation request submitted successfully!");
      navigate("/pages/User/Trips");
    } catch (error) {
      console.error(error);
      alert("Failed to submit reservation request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 shadow-lg h-fit sticky top-6 bg-white">
      <h2 className="text-2xl font-bold">
        ₹{Number(price).toLocaleString("en-IN")}
        <span className="text-base font-normal text-gray-600"> / night</span>
      </h2>

      <div className="mt-4 border rounded-lg overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="border-r p-3">
            <label className="block text-[10px] font-bold text-gray-700 uppercase">
              CHECK-IN
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full outline-none text-sm mt-1"
            />
          </div>

          <div className="p-3">
            <label className="block text-[10px] font-bold text-gray-700 uppercase">
              CHECK-OUT
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full outline-none text-sm mt-1"
            />
          </div>
        </div>

        <div className="border-t p-3">
          <label className="block text-[10px] font-bold text-gray-700 uppercase">
            GUESTS
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full outline-none text-sm mt-1 bg-transparent"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
              <option key={g} value={g}>
                {g} guest{g > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      {nights > 0 && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <div className="flex justify-between text-gray-600">
            <span>₹{price.toLocaleString("en-IN")} x {nights} nights</span>
            <span>₹{(price * nights).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 text-lg">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleReserve}
        disabled={loading}
        className="w-full mt-4 bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 font-semibold disabled:opacity-50"
      >
        {loading ? "Processing..." : "Reserve"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-3">
        You won't be charged yet
      </p>
    </div>
  );
}

export default BookingCard;