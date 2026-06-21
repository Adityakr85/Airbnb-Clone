import reviews from "../data/reviews";

function Reviews() {
  return (
    <div className="mt-8 border-t pt-6">
      <h2 className="text-2xl font-semibold mb-4">
        ⭐ Reviews ({reviews.length})
      </h2>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-lg p-4"
          >
            <h3 className="font-semibold">
              {review.name}
            </h3>

            <p className="text-yellow-500">
              {"⭐".repeat(review.rating)}
            </p>

            <p className="mt-2 text-gray-700">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;