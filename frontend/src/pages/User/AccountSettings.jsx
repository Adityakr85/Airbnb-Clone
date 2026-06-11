import { UserProfile } from "@clerk/clerk-react";

export default function AccountSettings() {
  return (
    <main className="min-h-screen bg-white px-8 py-10">
      <h1 className="text-3xl font-semibold mb-8">Account settings</h1>

      <UserProfile routing="hash" />
    </main>
  );
}
