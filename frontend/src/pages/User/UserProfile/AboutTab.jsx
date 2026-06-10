import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import ProfileCard from "./ProfileCard";

export default function AboutTab({ user }) {
  const aboutData = JSON.parse(localStorage.getItem("aboutMeData")) || {};

  const aboutFields = [
    ["decade", "Decade I was born"],
    ["travel", "Where I’ve always wanted to go"],
    ["work", "My work"],
    ["pets", "Pets"],
    ["school", "Where I went to school"],
    ["skill", "My most useless skill"],
    ["song", "My favourite song in secondary school"],
    ["funFact", "My fun fact"],
    ["time", "I spend too much time"],
    ["obsessed", "I’m obsessed with"],
    ["bioTitle", "My biography title would be"],
    ["languages", "Languages I speak"],
    ["live", "Where I live"],
    ["intro", "About me"],
    ["interests", "My interests"],
  ];

  const hasFilledProfile = aboutFields.some(([key]) =>
    aboutData[key]?.toString().trim(),
  );

  return (
    <>
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-3xl font-semibold">About me</h2>

        <Link
          to="/pages/User/UserProfile/EditProfile"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200"
        >
          Edit
        </Link>
      </div>

      <div className="flex gap-10">
        <ProfileCard user={user} />

        <div className="w-96 pt-6">
          {!hasFilledProfile && (
            <>
              <h3 className="text-2xl font-semibold">Complete your profile</h3>

              <p className="mt-5 text-gray-600">
                Your Airbnb profile is an important part of every reservation.
                Create yours to help other hosts and guests get to know you.
              </p>

              <Link
                to="/pages/User/UserProfile/EditProfile"
                className="mt-7 inline-flex rounded-xl bg-[#e31c5f] px-7 py-4 font-semibold text-white hover:bg-[#ff385c]"
              >
                Get started
              </Link>
            </>
          )}

          {hasFilledProfile && (
            <div className="space-y-5">
              {aboutFields.map(([key, label]) =>
                aboutData[key]?.toString().trim() ? (
                  <div key={key}>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="mt-1 font-medium text-gray-950">
                      {aboutData[key]}
                    </p>
                  </div>
                ) : null,
              )}

              <Link
                to="/pages/User/UserProfile/EditProfile"
                className="inline-flex rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200"
              >
                Add more details
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 max-w-3xl border-t border-gray-300 pt-9">
        <button className="flex items-center gap-5 font-medium hover:underline">
          <MessageSquare size={24} />
          <span>Show reviews I’ve written</span>
        </button>
      </div>
    </>
  );
}
