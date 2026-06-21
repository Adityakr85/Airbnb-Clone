import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
import {
  Camera,
  Trash2,
  Lightbulb,
  Briefcase,
  GraduationCap,
  Globe2,
  PawPrint,
  Wand2,
  Music,
  Clock,
  BookOpen,
  Heart,
  Languages,
  Plus,
} from "lucide-react";

export default function EditProfile() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const clerkId = user?.id;

  const [previewImage, setPreviewImage] = useState(user?.imageUrl || "");
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    decade: "",
    travel: "",
    work: "",
    pets: "",
    school: "",
    skill: "",
    song: "",
    funFact: "",
    time: "",
    obsessed: "",
    bioTitle: "",
    languages: "",
    live: "",
    intro: "",
    interests: "",
  });

  // Load profile from backend on mount
  useEffect(() => {
    async function loadProfile() {
      if (!clerkId || !isLoaded) return;

      try {
        // Try to load from backend first
        const res = await axios.get(`${API_BASE}/api/user/profile`, {
          params: { clerk_id: clerkId },
        });
        const backendData = res.data?.data;

        if (backendData) {
          setForm({
            decade: backendData.decade || "",
            travel: backendData.travel || "",
            work: backendData.work || "",
            pets: backendData.pets || "",
            school: backendData.school || "",
            skill: backendData.skill || "",
            song: backendData.song || "",
            funFact: backendData.fun_fact || "",
            time: backendData.time || "",
            obsessed: backendData.obsessed || "",
            bioTitle: backendData.bio_title || "",
            languages: backendData.languages || "",
            live: backendData.live || "",
            intro: backendData.intro || "",
            interests: backendData.interests || "",
          });
        } else {
          // Fallback to localStorage
          const savedData = JSON.parse(localStorage.getItem("aboutMeData")) || {};
          setForm({
            decade: savedData.decade || "",
            travel: savedData.travel || "",
            work: savedData.work || "",
            pets: savedData.pets || "",
            school: savedData.school || "",
            skill: savedData.skill || "",
            song: savedData.song || "",
            funFact: savedData.fun_fact || "",
            time: savedData.time || "",
            obsessed: savedData.obsessed || "",
            bioTitle: savedData.bio_title || "",
            languages: savedData.languages || "",
            live: savedData.live || "",
            intro: savedData.intro || "",
            interests: savedData.interests || "",
          });
        }
      } catch (error) {
        // Fallback to localStorage on error
        const savedData = JSON.parse(localStorage.getItem("aboutMeData")) || {};
        setForm({
          decade: savedData.decade || "",
          travel: savedData.travel || "",
          work: savedData.work || "",
          pets: savedData.pets || "",
          school: savedData.school || "",
          skill: savedData.skill || "",
          song: savedData.song || "",
          funFact: savedData.fun_fact || "",
          time: savedData.time || "",
          obsessed: savedData.obsessed || "",
          bioTitle: savedData.bio_title || "",
          languages: savedData.languages || "",
          live: savedData.live || "",
          intro: savedData.intro || "",
          interests: savedData.interests || "",
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [clerkId, isLoaded]);

  if (!isLoaded || loading) return <div className="p-10">Loading...</div>;

  const name = user?.firstName || user?.fullName || "User";
  const initial = name.charAt(0).toUpperCase();

  const fields = [
    ["decade", "Decade I was born", Lightbulb],
    ["travel", "Where I’ve always wanted to go", Globe2],
    ["work", "My work", Briefcase],
    ["pets", "Pets", PawPrint],
    ["school", "Where I went to school", GraduationCap],
    ["skill", "My most useless skill", Wand2],
    ["song", "My favourite song in secondary school", Music],
    ["funFact", "My fun fact", Lightbulb],
    ["time", "I spend too much time", Clock],
    ["obsessed", "I’m obsessed with", Heart],
    ["bioTitle", "My biography title would be", BookOpen],
    ["languages", "Languages I speak", Languages],
    ["live", "Where I live", Globe2],
  ];

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setRemoveImage(false);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewImage("");
    setRemoveImage(true);
  };

  const handleDone = async () => {
    try {
      setSaving(true);

      // Upload photo to Clerk
      if (imageFile) {
        await user.setProfileImage({ file: imageFile });
      } else if (removeImage) {
        await user.setProfileImage({ file: null });
      }

      // Save to backend (MySQL)
      try {
        await axios.put(`${API_BASE}/api/user/profile`, {
          clerk_id: clerkId,
          decade: form.decade,
          travel: form.travel,
          work: form.work,
          pets: form.pets,
          school: form.school,
          skill: form.skill,
          song: form.song,
          fun_fact: form.funFact,
          time: form.time,
          obsessed: form.obsessed,
          bio_title: form.bioTitle,
          languages: form.languages,
          live: form.live,
          intro: form.intro,
          interests: form.interests,
        });
      } catch (backendError) {
        console.warn("Backend save failed:", backendError);
      }

      // Also save to localStorage as backup
      localStorage.setItem("aboutMeData", JSON.stringify(form));

      navigate("/pages/User/UserProfile/Profile");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      <div className="flex">
        <aside className="sticky top-20 flex h-screen w-96 shrink-0 justify-center pt-16">
          <div className="relative h-fit">
            {previewImage ? (
              <img
                src={previewImage}
                alt={name}
                className="h-56 w-56 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-56 w-56 items-center justify-center rounded-full bg-blue-100 text-8xl font-semibold text-blue-700">
                {initial}
              </div>
            )}

            <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold shadow-xl hover:bg-gray-50">
                <Camera size={18} />
                Add
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleRemoveImage}
                className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 font-semibold shadow-xl hover:bg-gray-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </aside>

        <section className="flex-1 p-16">
          <h1 className="text-3xl font-semibold">My profile</h1>

          <p className="mt-6 max-w-xl text-gray-600">
            Hosts and guests can see your profile and it may appear across
            Airbnb to help us build trust in our community.{" "}
            <span className="font-semibold underline">Learn more</span>
          </p>

          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-x-16">
            {fields.map(([key, label, Icon]) => (
              <div
                key={key}
                className="flex items-center gap-4 border-b border-gray-300 py-5"
              >
                <Icon size={22} />

                <input
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={label}
                  className="w-full outline-none placeholder:text-gray-600"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-3xl border-t border-gray-300 pt-10">
            <h2 className="text-2xl font-semibold">About me</h2>

            <div className="mt-8 rounded-xl border border-dashed border-gray-400 p-5">
              <textarea
                value={form.intro}
                onChange={(e) => handleChange("intro", e.target.value)}
                placeholder="Write something fun and punchy."
                className="h-24 w-full resize-none outline-none"
              />

              <p className="font-semibold underline">Add intro</p>
            </div>
          </div>

          <div className="mt-10 max-w-3xl border-t border-gray-300 pt-10">
            <h2 className="text-2xl font-semibold">Where I’ve been</h2>

            <p className="mt-2 text-gray-600">
              Pick the stamps you want other people to see on your profile.
            </p>

            <div className="mt-8 flex gap-5">
              {["🌐", "☀️", "✈️", "🏔️"].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex h-28 w-40 items-center justify-center rounded-2xl border-2 border-gray-300 text-5xl text-gray-400">
                    {item}
                  </div>

                  <p className="mt-4 text-gray-500">Next destination</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 max-w-3xl border-t border-gray-300 pt-10">
            <h2 className="text-2xl font-semibold">My interests</h2>

            <p className="mt-2 text-gray-600">
              Find common ground with other guests and hosts by adding interests
              to your profile.
            </p>

            <div className="mt-6 flex gap-3">
              {[1, 2, 3].map((item) => (
                <button
                  key={item}
                  className="flex h-10 w-24 items-center justify-center rounded-full border border-dashed border-gray-400"
                >
                  <Plus />
                </button>
              ))}
            </div>

            <input
              value={form.interests}
              onChange={(e) => handleChange("interests", e.target.value)}
              placeholder="Add interests"
              className="mt-6 rounded-xl bg-gray-100 px-6 py-4 font-semibold outline-none"
            />
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-end border-t border-gray-300 bg-white px-10 py-4">
        <button
          onClick={handleDone}
          disabled={saving}
          className="rounded-xl bg-[#222] px-8 py-4 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Done"}
        </button>
      </div>
    </main>
  );
}
