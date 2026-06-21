import { useEffect, useRef, useState } from "react";
import { LogOut, Shield } from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const profileRef = useRef(null);
  const { signOut } = useClerk();
  const { user } = useUser();

  const role = user?.publicMetadata?.role || "Guest";

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={profileRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full bg-gray-100 px-3 py-2 transition hover:bg-gray-200"
      >
        <img
          src={user?.imageUrl}
          alt={user?.fullName || "Admin"}
          className="h-9 w-9 rounded-full object-cover"
        />

        <div className="hidden text-left sm:block">
          <p className="text-sm font-bold">{user?.fullName || "Admin"}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-72 rounded-[1.5rem] border border-gray-100 bg-white p-4 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <img
              src={user?.imageUrl}
              alt={user?.fullName || "Admin"}
              className="h-14 w-14 rounded-full object-cover"
            />

            <div className="min-w-0">
              <h3 className="truncate font-black text-gray-950">
                {user?.fullName || "Admin"}
              </h3>

              <p className="truncate text-sm text-gray-500">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-rose-50 p-3">
            <Shield size={18} className="text-rose-500" />

            <div>
              <p className="text-xs font-bold uppercase text-gray-500">Role</p>
              <p className="font-bold text-gray-950">{role}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl p-3 text-left font-semibold text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
