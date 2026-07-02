import { CheckCircle } from "lucide-react";

export default function SuccessStep({ onViewListings, onAddAnother }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-8">
      <CheckCircle size={64} className="text-green-500" />

      <h1 className="text-3xl font-bold text-gray-900">
        Your listing is live!
      </h1>

      <p className="text-gray-500 text-center max-w-sm">
        Guests can now find and book your property after admin approval.
      </p>

      <div className="flex gap-3 mt-4">
        <button
          onClick={onViewListings}
          className="px-6 py-3 bg-[#FF385C] text-white rounded-lg font-semibold hover:bg-[#E31C5F] transition"
        >
          View my listings
        </button>

        <button
          onClick={onAddAnother}
          className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Add another
        </button>
      </div>
    </div>
  );
}
