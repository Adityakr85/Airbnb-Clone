import toast from "react-hot-toast";

export default function PhotosStep({
  form,
  set,
  imageFiles,
  setImageFiles,
  imagePreviews,
  setImagePreviews,
}) {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const remainingSlots = 5 - imagePreviews.length;

    if (remainingSlots <= 0) {
      toast.error("You can upload maximum 5 photos");
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);
    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...selectedFiles]);

    setImagePreviews((prev) => {
      const updated = [...prev, ...previewUrls];

      if (!form.image && updated.length > 0) {
        set("image", updated[0]);
      }

      return updated;
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = imageFiles.filter((_, i) => i !== index);

    setImagePreviews(updatedPreviews);
    setImageFiles(updatedFiles);
    set("image", updatedPreviews[0] || "");
  };

  return (
    <div className="flex-1 flex flex-col items-center px-8 py-10 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
        Add some photos of your place
      </h1>

      <p className="text-gray-500 text-sm mb-8 self-start">
        Upload up to 5 photos. The first photo will be used as the cover photo.
      </p>

      {imagePreviews.length === 0 ? (
        <label className="w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-gray-500 transition cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
            📷
          </div>

          <p className="font-semibold text-gray-800">Add photos</p>

          <p className="text-sm text-gray-500">
            Choose images from your device
          </p>

          <span className="mt-2 text-sm font-semibold underline text-gray-700">
            Upload from your device
          </span>
        </label>
      ) : (
        <div className="w-full">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {imagePreviews.map((src, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden ${
                  i === 0 ? "col-span-2 h-64" : "h-40"
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />

                {i === 0 && (
                  <span className="absolute top-3 left-3 bg-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    Cover photo
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-gray-700 hover:bg-gray-100 text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {imagePreviews.length < 5 && (
            <label className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-sm font-semibold text-gray-600 hover:border-gray-500 transition cursor-pointer flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              + Add more photos ({imagePreviews.length}/5)
            </label>
          )}
        </div>
      )}
    </div>
  );
}
