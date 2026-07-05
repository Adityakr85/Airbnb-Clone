import { Link, useParams ,useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import experienceData from "../data/experienceData";

export default function ExperienceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const experience = experienceData.find((item) => item.id === Number(id));

  if (!experience) {
    return <div className="p-10 text-center">Experience not found</div>;
  }

  const relatedExperiences = experienceData
    .filter((item) => item.id !== experience.id)
    .slice(0, 4);

  const handleContactHost = () => {
    const hostId = experience.host_id || `host-${experience.id}` || "host-456";
    const hostName = encodeURIComponent(experience.host || "Experience Host");
    
    navigate(`/pages/User/Messages?partner_id=${hostId}&name=${hostName}`);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <img
        src={experience.image}
        alt={experience.title}
        className="h-[450px] w-full rounded-3xl object-cover"
      />

      <h1 className="mt-6 text-4xl font-bold">{experience.title}</h1>

      <p className="mt-2 text-gray-600">
        ★ {experience.rating} · {experience.location}
      </p>

      <div className="mt-6 border-t pt-6">
        <div className="flex items-centerjustify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={experience.hostImage}
              alt={experience.host}
              className="h-16 w-16 rounded-full object-cover"
            />

            <div>
              <h2 className="text-2xl font-semibold">
                Hosted by {experience.host}
              </h2>

              <p className="text-gray-500">Experienced local guide</p>
            </div>
          </div>

          <button
            onClick={handleContactHost}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-black bg-white px-6 py-3 font-semibold text-gray-900 shadow-sm transition duration-200 hover:bg-gray-100 active:scale-95"
          >
            <MessageSquare size={18} />
            Contact Host
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-4">
            <h3 className="font-semibold">Duration</h3>
            <p>{experience.duration}</p>
          </div>

          <div className="rounded-2xl border p-4">
            <h3 className="font-semibold">Rating</h3>
            <p>★ {experience.rating}</p>
          </div>

          <div className="rounded-2xl border p-4">
            <h3 className="font-semibold">Location</h3>
            <p>{experience.location}</p>
          </div>
        </div>

        <p className="mt-2 text-gray-600">Duration: {experience.duration}</p>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-2xl font-semibold">About this experience</h2>

        <p className="text-gray-700">{experience.description}</p>
      </div>
      <div className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold">Reviews</h2>

        <div className="space-y-4">
          <div className="rounded-2xl border p-4">
            <p className="font-semibold">Amit</p>
            <p className="text-gray-600">
              Amazing experience. Highly recommended!
            </p>
          </div>

          <div className="rounded-2xl border p-4">
            <p className="font-semibold">Sneha</p>
            <p className="text-gray-600">
              Great host and well organized activity.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl border p-5">
        <div>
          <p className="text-2xl font-bold">₹{experience.price}</p>

          <p className="text-gray-500">per person</p>
        </div>

        <button className="rounded-xl bg-rose-500 px-8 py-3 font-semibold text-white hover:bg-rose-600">
          Reserve
        </button>
      </div>
      <div className="mt-12">
        <h2 className="mb-5 text-2xl font-semibold">You may also like</h2>

        <div className="flex gap-5 overflow-x-auto">
          {relatedExperiences.map((item) => (
            <Link
              key={item.id}
              to={`/experience/${item.id}`}
              className="min-w-[240px] cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-40 w-full rounded-2xl object-cover"
              />

              <h3 className="mt-2 font-semibold">{item.title}</h3>

              <p className="text-sm text-gray-500">
                ₹{item.price} · ★ {item.rating}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
