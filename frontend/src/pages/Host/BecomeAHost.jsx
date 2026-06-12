import { useNavigate } from "react-router-dom";

const steps = [
  {
    number: "1",
    title: "Tell us about your place",
    desc: "Share some basic info, such as where it is and how many guests can stay.",
    img: "https://a0.muscache.com/4ea/air/v2/pictures/e7b0b4a5-c69f-4f0e-80f4-b4b4a2a6cf94.jpg",
  },
  {
    number: "2",
    title: "Make it stand out",
    desc: "Add 5 or more photos plus a title and description – we'll help you out.",
    img: "https://a0.muscache.com/4ea/air/v2/pictures/48f3a95d-bdf5-4690-9bc5-bd38f0e23a13.jpg",
  },
  {
    number: "3",
    title: "Finish up and publish",
    desc: "Choose a starting price, verify a few details, then publish your listing.",
    img: "https://a0.muscache.com/4ea/air/v2/pictures/8e88ead3-7e01-4c87-b0a0-75e0c52e4e79.jpg",
  },
];

export default function BecomeAHost() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-[#FF385C] font-bold text-2xl tracking-tight">airbnb</span>
        <div className="flex gap-3">
          <button onClick={() => navigate("/")} className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition border border-gray-200">
            Questions?
          </button>
          <button onClick={() => navigate("/")} className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition border border-gray-200">
            Exit
          </button>
        </div>
      </nav>

      
      <div className="flex flex-1 items-center justify-center px-8 py-16">
        <div className="flex w-full max-w-4xl items-center gap-20">
         
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
              It's easy to get<br />started on Airbnb
            </h1>
            <p className="text-sm text-gray-500">
              Not listing a home?{" "}
              <span className="underline cursor-pointer">Host an experience or service</span>
            </p>
          </div>

          
          <div className="flex-1 space-y-6">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center gap-6">
                <div className="flex-1 border-b border-gray-100 pb-6">
                  <div className="flex items-start gap-4">
                    <span className="text-lg font-semibold text-gray-400 mt-0.5">{s.number}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-base">{s.title}</p>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
                <img
                  src={s.img}
                  alt=""
                  className="w-16 h-16 object-contain flex-shrink-0"
                  onError={(e) => {
                    const fallbacks = ["🛏️","🏠","🚪"];
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <span className="w-16 h-16 text-3xl hidden items-center justify-center flex-shrink-0">
                  {["🛏️","🏠","🚪"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="border-t border-gray-200 px-8 py-4 flex justify-end">
        <button
          onClick={() => navigate("/host/add-property")}
          className="bg-[#FF385C] hover:bg-[#E31C5F] text-white px-8 py-3 rounded-lg font-semibold text-sm transition"
        >
          Get started
        </button>
      </div>
    </div>
  );
}
