export default function TitleDescriptionStep({ form, set }) {
  return (
    <div className="flex-1 flex flex-col items-center px-8 py-10 max-w-2xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
        Now, let's give your place a title
      </h1>

      <p className="text-gray-500 text-sm mb-6 self-start">
        Short titles work best. Have fun with it – you can always change it
        later.
      </p>

      <div className="w-full relative mb-8">
        <textarea
          rows={3}
          maxLength={32}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Cozy beach house with stunning views"
          className="w-full border-2 border-gray-300 rounded-2xl p-5 text-lg resize-none outline-none focus:border-gray-900 transition"
        />

        <span className="absolute bottom-4 right-4 text-sm text-gray-400">
          {form.title.length}/32
        </span>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2 self-start">
        Create your description
      </h2>

      <p className="text-gray-500 text-sm mb-4 self-start">
        Share what makes your place special.
      </p>

      <div className="w-full relative">
        <textarea
          rows={5}
          maxLength={500}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="You'll always feel at home with this lovely retreat..."
          className="w-full border-2 border-gray-300 rounded-2xl p-5 resize-none outline-none focus:border-gray-900 transition"
        />

        <span className="absolute bottom-4 right-4 text-sm text-gray-400">
          {form.description.length}/500
        </span>
      </div>
    </div>
  );
}
