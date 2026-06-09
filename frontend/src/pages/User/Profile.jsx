import { useUser } from "@clerk/clerk-react";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div className="p-10">Loading...</div>;

  const aboutData = JSON.parse(localStorage.getItem("aboutMeData")) || {};

  const name = user?.firstName || user?.fullName || "User";
  const savedProfileImage = aboutData.profileImage;
  const profileImage = savedProfileImage || user?.imageUrl;

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
    <main className="min-h-[calc(100vh-80px)] bg-white">
      <div className="flex min-h-[calc(100vh-80px)]">
        <aside className="w-[420px] border-r border-gray-200 px-10 py-9">
          <h1 className="mb-8 text-[32px] font-semibold tracking-tight">
            Profile
          </h1>

          <div className="space-y-3">
            <button className="flex h-[64px] w-full items-center gap-5 rounded-2xl bg-[#f7f7f7] px-5 text-left text-base font-semibold">
              <img
                src={profileImage}
                alt={name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span>About me</span>
            </button>

            <button className="flex h-[64px] w-full items-center gap-5 rounded-2xl px-5 text-left text-base font-semibold hover:bg-[#f7f7f7]">
              <span className="text-3xl">🧳</span>
              <span>Past trips</span>
            </button>

            <button className="flex h-[64px] w-full items-center gap-5 rounded-2xl px-5 text-left text-base font-semibold hover:bg-[#f7f7f7]">
              <span className="text-3xl">👥</span>
              <span>Connections</span>
            </button>
          </div>
        </aside>

        <section className="flex-1 px-24 py-9">
          <div className="mb-7 flex items-center gap-4">
            <h2 className="text-[32px] font-semibold tracking-tight">
              About me
            </h2>

            <Link
              to="/pages/User/EditProfile"
              className="rounded-lg bg-[#f7f7f7] px-4 py-2 text-sm font-semibold hover:bg-gray-200"
            >
              Edit
            </Link>
          </div>

          <div className="flex gap-10">
            <div className="flex h-[230px] w-[345px] flex-col items-center justify-center rounded-[28px] border border-gray-100 bg-white shadow-xl">
              <img
                src={profileImage}
                alt={name}
                className="h-28 w-28 rounded-full object-cover"
              />

              <h3 className="mt-4 text-[34px] font-bold leading-none tracking-tight">
                {name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">Guest</p>
            </div>

            <div className="w-[360px] pt-6">
              {!hasFilledProfile && (
                <>
                  <h3 className="text-[26px] font-semibold leading-tight tracking-tight">
                    Complete your profile
                  </h3>

                  <p className="mt-5 text-base leading-6 text-gray-600">
                    Your Airbnb profile is an important part of every
                    reservation. Create yours to help other hosts and guests get
                    to know you.
                  </p>

                  <Link
                    to="/pages/User/EditProfile"
                    className="mt-7 inline-flex h-12 items-center rounded-xl bg-[#e31c5f] px-7 font-semibold text-white hover:bg-[#ff385c]"
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
                    to="/pages/User/EditProfile"
                    className="inline-flex rounded-lg bg-[#f7f7f7] px-4 py-2 text-sm font-semibold hover:bg-gray-200"
                  >
                    Add more details
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 max-w-[705px] border-t border-gray-300 pt-9">
            <button className="flex items-center gap-5 text-base font-medium hover:underline">
              <MessageSquare size={24} />
              <span>Show reviews I’ve written</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
