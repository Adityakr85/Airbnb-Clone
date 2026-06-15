import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import experienceData from "../data/experienceData";
import categories from "../data/categories";
import { Link } from "react-router-dom";

export default function Experience() {
  const groupedExperiences = experienceData.reduce((acc, experience) => {
    const location = experience.location.split(",")[0].trim();

    if (!acc[location]) {
      acc[location] = [];
    }

    acc[location].push(experience);

    return acc;
  }, {});

  const groupedEntries = Object.entries(groupedExperiences);
  const scrollRefs = useRef({});

  return (
    <main className="bg-white min-h-screen px-6 md:px-8 py-6">
      <h1 className="mb-6 text-3xl font-semibold text-gray-950">Experiences</h1>
      <div className="mb-8 flex gap-8 overflow-x-auto border-b pb-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex min-w-fit cursor-pointer flex-col items-center text-gray-500 transition hover:text-black"
          >
            <span className="text-2xl">{category.icon}</span>
            <span className="mt-1 text-xs font-medium">{category.name}</span>
          </div>
        ))}
      </div>

      {groupedEntries.map(([location, props]) => (
        <section key={location} className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-gray-950">
                Experiences in {location}
              </h2>

              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200">
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  scrollRefs.current[location]?.scrollBy({
                    left: -400,
                    behavior: "smooth",
                  })
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() =>
                  scrollRefs.current[location]?.scrollBy({
                    left: 400,
                    behavior: "smooth",
                  })
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={(el) => (scrollRefs.current[location] = el)}
            className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide"
          >
            {props.map((experience) => (
              <Link key={experience.id} to={`/experience/${experience.id}`}>
                <article className="group min-w-[205px] max-w-[205px] cursor-pointer">
                  <div className="relative h-[195px] overflow-hidden rounded-2xl bg-gray-100">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">
                      Experience
                    </span>

                    <button className="absolute right-3 top-3 text-white drop-shadow-md transition hover:scale-110">
                      <Heart size={25} />
                    </button>
                  </div>

                  <div className="mt-2">
                    <h3 className="truncate text-sm font-semibold text-gray-950">
                      {experience.title}
                    </h3>

                    <p className="mt-0.5 truncate text-sm text-gray-600">
                      ₹{experience.price} per person · ★ {experience.rating}
                    </p>

                    <p className="text-xs text-gray-500">
                      {experience.duration}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
