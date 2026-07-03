// src/pages/Public/PropertyDetails/components/Reviews.jsx
import reviews from "../../../../data/reviews";

export default function Reviews() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold text-gray-900">Reviews</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-gray-200 p-5"
          >
            <h3 className="font-semibold text-gray-900">{review.name}</h3>

            <p className="mt-1 text-sm text-yellow-500">
              {"⭐".repeat(review.rating)}
            </p>

            <p className="mt-3 leading-6 text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
