export default function CategoryStep({
  form,
  set,
  categories,
  categoriesLoading,
}) {
  return (
    <div className="flex-1 flex flex-col items-center px-8 py-10 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Which category best describes your place?
      </h1>

      {categoriesLoading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 w-full">
          {categories.map((category) => {
            const categoryName =
              category.name || category.label || category.title;
            const categoryIcon = category.icon || "🏠";

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => set("category_id", category.id)}
                className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition hover:border-gray-400 ${
                  Number(form.category_id) === Number(category.id)
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200"
                }`}
              >
                <span className="text-2xl">{categoryIcon}</span>

                <span className="text-sm font-medium text-gray-800 text-left leading-tight">
                  {categoryName}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
