import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useHost } from "./HostContext";
import toast from "react-hot-toast";

const TOTAL_STEPS = 9;

const propertyTypes = [
  { label: "House", icon: "🏠" },
  { label: "Flat/apartment", icon: "🏢" },
  { label: "Barn", icon: "🏚️" },
  { label: "Bed & breakfast", icon: "☕" },
  { label: "Boat", icon: "⛵" },
  { label: "Cabin", icon: "🏡" },
  { label: "Campervan/motorhome", icon: "🚐" },
  { label: "Casa particular", icon: "🏘️" },
  { label: "Castle", icon: "🏰" },
  { label: "Cave", icon: "🪨" },
  { label: "Container", icon: "📦" },
  { label: "Cycladic home", icon: "🏛️" },
  { label: "Farm", icon: "🌾" },
  { label: "Guesthouse", icon: "🛎️" },
  { label: "Hotel", icon: "🏨" },
  { label: "Tent", icon: "⛺" },
  { label: "Treehouse", icon: "🌳" },
  { label: "Villa", icon: "🏖️" },
];

const amenitiesList = [
  { label: "Wifi", icon: "📶" },
  { label: "TV", icon: "📺" },
  { label: "Kitchen", icon: "🍳" },
  { label: "Washing machine", icon: "🧺" },
  { label: "Free parking", icon: "🚗" },
  { label: "Paid parking", icon: "🅿️" },
  { label: "Air conditioning", icon: "❄️" },
  { label: "Dedicated workspace", icon: "💻" },
  { label: "Pool", icon: "🏊" },
  { label: "Hot tub", icon: "🛁" },
  { label: "Patio", icon: "🌿" },
  { label: "BBQ grill", icon: "🍖" },
  { label: "Outdoor dining", icon: "🍽️" },
  { label: "Fire pit", icon: "🔥" },
  { label: "Gym", icon: "💪" },
  { label: "Breakfast", icon: "🥐" },
  { label: "Indoor fireplace", icon: "🪵" },
  { label: "Smoking allowed", icon: "🚬" },
  { label: "Pets allowed", icon: "🐾" },
  { label: "Piano", icon: "🎹" },
];

export default function AddProperty() {
  const navigate = useNavigate();
  const { addProperty } = useHost();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    type: "",
    guests: 4,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: [],
    image: "",
  });

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const toggleAmenity = (a) =>
    set(
      "amenities",
      form.amenities.includes(a)
        ? form.amenities.filter((x) => x !== a)
        : [...form.amenities, a],
    );

  const addSampleImage = () => {
    const samples = [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227",
    ];
    if (imagePreviews.length < 5) {
      const next = samples[imagePreviews.length % samples.length];
      setImagePreviews((p) => [...p, next]);
      if (!form.image) set("image", next);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => {
    if (step === 1) navigate("/become-a-host");
    else setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    addProperty({
      ...form,
      price: Number(form.price) || 2299,
      image:
        form.image ||
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    });
    setSubmitted(true);
    toast.success("Your listing is live!");
  };

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-8">
        <CheckCircle size={64} className="text-green-500" />
        <h1 className="text-3xl font-bold text-gray-900">
          Your listing is live!
        </h1>
        <p className="text-gray-500 text-center max-w-sm">
          Guests can now find and book your property.
        </p>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate("/host/properties")}
            className="px-6 py-3 bg-[#FF385C] text-white rounded-lg font-semibold hover:bg-[#E31C5F] transition"
          >
            View my listings
          </button>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setForm({
                title: "",
                description: "",
                location: "",
                price: "",
                type: "",
                guests: 4,
                bedrooms: 1,
                beds: 1,
                bathrooms: 1,
                amenities: [],
                image: "",
              });
              setImagePreviews([]);
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Add another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] bg-white flex flex-col overflow-hidden">
      <div className="h-1 bg-gray-200 flex-shrink-0">
        <div
          className="h-1 bg-gray-900 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {step === 1 && (
          <div className="flex items-center max-w-4xl mx-auto w-full px-8 py-16 gap-16 min-h-full">
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium mb-2">Step 1</p>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                Tell us about
                <br />
                your place
              </h1>
              <p className="text-gray-500 leading-relaxed max-w-sm">
                In this step, we'll ask you which type of property you have and
                if guests will book the entire place or just a room. Then let us
                know the location and how many guests can stay.
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
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col items-center px-8 py-10 max-w-3xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Which of these best describes your place?
            </h1>
            <div className="grid grid-cols-3 gap-3 w-full">
              {propertyTypes.map((t) => (
                <button
                  key={t.label}
                  onClick={() => set("type", t.label)}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition hover:border-gray-400 ${form.type === t.label ? "border-gray-900 bg-gray-50" : "border-gray-200"}`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <span className="text-sm font-medium text-gray-800 text-left leading-tight">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 max-w-2xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
              Where's your place located?
            </h1>
            <p className="text-gray-500 text-sm mb-6 self-start">
              Your address is only shared with guests after they've made a
              reservation.
            </p>
            <div className="w-full h-44 bg-[#e8ede8] rounded-2xl mb-5 relative overflow-hidden border border-gray-200">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(#aaa 1px, transparent 1px), linear-gradient(90deg, #aaa 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full border-2 border-white shadow" />
              {form.location && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white rounded-full px-3 py-1.5 text-sm font-medium shadow flex items-center gap-1">
                  <span>📍</span>
                  {form.location}
                </div>
              )}
            </div>
            <div className="w-full border border-gray-300 rounded-2xl overflow-hidden divide-y divide-gray-200">
              <div className="px-4 py-3 flex items-center justify-between bg-white">
                <div>
                  <p className="text-xs text-gray-400">Country/region</p>
                  <p className="text-sm font-medium text-gray-800">
                    India - IN
                  </p>
                </div>
                <span className="text-gray-400">∨</span>
              </div>
              <input
                placeholder="Flat, house, etc. (if applicable)"
                className="w-full px-4 py-3 text-sm outline-none placeholder-gray-400"
              />
              <input
                placeholder="Street address"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className="w-full px-4 py-3 text-sm outline-none placeholder-gray-400"
              />
              <input
                placeholder="Nearby landmark (if applicable)"
                className="w-full px-4 py-3 text-sm outline-none placeholder-gray-400"
              />
              <input
                placeholder="District/locality (if applicable)"
                className="w-full px-4 py-3 text-sm outline-none placeholder-gray-400"
              />
              <input
                placeholder="City/town"
                className="w-full px-4 py-3 text-sm outline-none placeholder-gray-400"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-10 max-w-xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
              Share some basics about your place
            </h1>
            <p className="text-gray-500 text-sm mb-8 self-start">
              You'll add more details later, like bed types.
            </p>
            {[
              { label: "Guests", field: "guests" },
              { label: "Bedrooms", field: "bedrooms" },
              { label: "Beds", field: "beds" },
              { label: "Bathrooms", field: "bathrooms" },
            ].map(({ label, field }) => (
              <div
                key={field}
                className="flex items-center justify-between w-full py-5 border-b border-gray-100"
              >
                <p className="font-semibold text-gray-900">{label}</p>
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => set(field, Math.max(0, form[field] - 1))}
                    className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 text-xl hover:border-gray-500 transition"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-medium">
                    {form[field]}
                  </span>
                  <button
                    onClick={() => set(field, form[field] + 1)}
                    className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 text-xl hover:border-gray-500 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 5 && (
          <div className="flex items-center max-w-4xl mx-auto w-full px-8 py-16 gap-16 min-h-full">
            <div className="flex-1">
              <p className="text-gray-500 text-sm font-medium mb-2">Step 2</p>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                Make it
                <br />
                stand out
              </h1>
              <p className="text-gray-500 leading-relaxed max-w-sm">
                In this step, you'll add some of the amenities your place
                offers, plus 5 or more photos. Then, you'll create a title and
                description.
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-72 h-64 rounded-2xl overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&q=80"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="flex-1 flex flex-col items-center px-8 py-10 max-w-3xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
              Tell guests what your place has to offer
            </h1>
            <p className="text-gray-500 text-sm mb-8 self-start">
              You can add more amenities after you publish your listing.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full">
              {amenitiesList.map((a) => {
                const sel = form.amenities.includes(a.label);
                return (
                  <button
                    key={a.label}
                    onClick={() => toggleAmenity(a.label)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition text-left hover:border-gray-400 ${sel ? "border-gray-900 bg-gray-50" : "border-gray-200"}`}
                  >
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-sm font-medium text-gray-800">
                      {a.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="flex-1 flex flex-col items-center px-8 py-10 max-w-3xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
              Add some photos of your place
            </h1>
            <p className="text-gray-500 text-sm mb-8 self-start">
              You'll need 5 photos to get started. You can always add more or
              make changes later.
            </p>
            {imagePreviews.length === 0 ? (
              <button
                onClick={addSampleImage}
                className="w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-gray-500 transition"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
                  📷
                </div>
                <p className="font-semibold text-gray-800">Add photos</p>
                <p className="text-sm text-gray-500">Drag your photos here</p>
                <span className="mt-2 text-sm font-semibold underline text-gray-700">
                  Upload from your device
                </span>
              </button>
            ) : (
              <div className="w-full">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {imagePreviews.map((src, i) => (
                    <div
                      key={i}
                      className={`relative rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 h-64" : "h-40"}`}
                    >
                      <img
                        src={`${src}?w=600&q=75`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <span className="absolute top-3 left-3 bg-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                          Cover photo
                        </span>
                      )}
                      <button
                        onClick={() => {
                          const u = imagePreviews.filter((_, idx) => idx !== i);
                          setImagePreviews(u);
                          set("image", u[0] || "");
                        }}
                        className="absolute top-3 right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow text-gray-700 hover:bg-gray-100 text-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {imagePreviews.length < 5 && (
                  <button
                    onClick={addSampleImage}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-sm font-semibold text-gray-600 hover:border-gray-500 transition"
                  >
                    + Add more photos ({imagePreviews.length}/5 minimum)
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {step === 8 && (
          <div className="flex-1 flex flex-col items-center px-8 py-10 max-w-2xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
              Now, let's give your place a title
            </h1>
            <p className="text-gray-500 text-sm mb-6 self-start">
              Short titles work best. Have fun with it – you can always change
              it later.
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
        )}

        {step === 9 && (
          <div className="flex-1 flex flex-col items-center px-8 py-10 max-w-2xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 self-start">
              Now, set your price
            </h1>
            <p className="text-gray-500 text-sm mb-8 self-start">
              You can change it anytime.
            </p>
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="text-5xl font-bold text-gray-400">₹</span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="2299"
                className="w-48 text-6xl font-bold text-gray-900 outline-none text-center border-b-2 border-gray-300 focus:border-gray-900 transition bg-transparent"
              />
            </div>
            <div className="w-full border border-gray-200 rounded-2xl divide-y divide-gray-100">
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-semibold text-gray-900">Base price</p>
                  <p className="text-sm text-gray-500">
                    ₹
                    {form.price
                      ? Number(form.price).toLocaleString("en-IN")
                      : "2,299"}{" "}
                    per night
                  </p>
                </div>
                <span className="text-gray-400">›</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-semibold text-gray-900">Discounts</p>
                  <p className="text-sm text-gray-500">
                    10% weekly · 20% monthly
                  </p>
                </div>
                <span className="text-gray-400">›</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-semibold text-gray-900">Availability</p>
                  <p className="text-sm text-gray-500">
                    1–365 night stays · Same-day advance notice
                  </p>
                </div>
                <span className="text-gray-400">›</span>
              </div>
            </div>
            {form.price && (
              <div className="mt-4 bg-gray-50 rounded-2xl px-5 py-4 w-full text-center">
                <p className="text-sm text-gray-500">
                  Estimated monthly earnings
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ₹{(Number(form.price) * 20).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Based on 20 nights/month
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0 bg-white">
        <button
          onClick={back}
          className="text-sm font-semibold text-gray-700 underline hover:text-gray-900 transition"
        >
          Back
        </button>
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${i + 1 === step ? "w-4 h-2 bg-gray-900" : "w-2 h-2 bg-gray-300"}`}
            />
          ))}
        </div>
        {step < TOTAL_STEPS ? (
          <button
            onClick={next}
            disabled={step === 2 && !form.type}
            className="bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white px-8 py-3 rounded-lg font-semibold text-sm transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-[#FF385C] hover:bg-[#E31C5F] text-white px-8 py-3 rounded-lg font-semibold text-sm transition"
          >
            Publish listing
          </button>
        )}
      </div>
    </div>
  );
}
