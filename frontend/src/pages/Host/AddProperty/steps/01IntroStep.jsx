export default function IntroStep() {
  return (
    <div className="flex items-center max-w-4xl mx-auto w-full px-8 py-16 gap-16 min-h-full">
      <div className="flex-1">
        <p className="text-gray-500 text-sm font-medium mb-2">Step 1</p>

        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
          Tell us about
          <br />
          your place
        </h1>

        <p className="text-gray-500 leading-relaxed max-w-sm">
          In this step, we'll ask you which category your property belongs to.
          Then let us know the location and how many guests can stay.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-72 h-64 rounded-2xl overflow-hidden bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
