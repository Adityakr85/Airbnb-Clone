export default function ProfileCard({ user, backendProfile }) {
  const name = user?.firstName || user?.fullName || "User";

  // Priority: Clerk imageUrl → backend photo_url
  const profileImage = user?.imageUrl || backendProfile?.photo_url;

  return (
    <div className="flex h-56 w-80 flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white shadow-xl">
      <img
        src={profileImage}
        alt={name}
        className="h-28 w-28 rounded-full object-cover"
      />

      <h3 className="mt-4 text-3xl font-bold">{name}</h3>

      <p className="text-sm text-gray-500">Guest</p>
    </div>
  );
}
