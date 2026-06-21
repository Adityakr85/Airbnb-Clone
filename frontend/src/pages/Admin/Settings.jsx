import {
  Settings as SettingsIcon,
  User,
  Shield,
  CreditCard,
  Bell,
  Globe,
  Mail,
  Lock,
  Database,
  Percent,
  Upload,
  Save,
  ToggleLeft,
  Trash2,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-gray-500">
          Manage platform settings, admin access, payments, security, and system
          preferences.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Platform Status" value="Live" icon={Globe} />
        <StatCard title="Commission" value="10%" icon={Percent} />
        <StatCard title="Admins" value="4" icon={Shield} />
        <StatCard title="Backups" value="12" icon={Database} />
      </div>

      <Section title="General Settings" icon={SettingsIcon}>
        <Input label="Website Name" defaultValue="Airbnb Clone" />
        <Input label="Support Email" defaultValue="support@airclone.com" />
        <Input label="Support Phone" defaultValue="+91 98765 43210" />
        <Input label="Default Currency" defaultValue="INR" />
        <Input label="Default Language" defaultValue="English" />

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-600">
            Website Logo
          </label>
          <button className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-5 py-4 font-semibold text-gray-600 hover:bg-gray-50">
            <Upload size={18} />
            Upload Logo
          </button>
        </div>
      </Section>

      <Section title="Admin Profile" icon={User}>
        <Input label="Admin Name" defaultValue="Super Admin" />
        <Input label="Admin Email" defaultValue="admin@airclone.com" />
        <Input label="Role" defaultValue="Super Admin" />
        <Input label="Password" defaultValue="********" type="password" />
      </Section>

      <Section title="Booking Settings" icon={CreditCard}>
        <Input label="Platform Commission (%)" defaultValue="10" />
        <Input label="Minimum Booking Amount" defaultValue="500" />
        <Input label="Cancellation Fee (%)" defaultValue="15" />
        <Input label="Refund Window Days" defaultValue="7" />
        <Toggle label="Allow Instant Booking" enabled />
        <Toggle label="Require Admin Approval For New Listings" enabled />
      </Section>

      <Section title="Payment Settings" icon={CreditCard}>
        <Toggle label="Enable Online Payments" enabled />
        <Toggle label="Enable Cash Payment" />
        <Toggle label="Enable Host Payouts" enabled />
        <Input label="Payout Delay Days" defaultValue="3" />
        <Input label="Tax / GST (%)" defaultValue="18" />
      </Section>

      <Section title="Notification Settings" icon={Bell}>
        <Toggle label="Email Notifications" enabled />
        <Toggle label="SMS Notifications" />
        <Toggle label="Push Notifications" enabled />
        <Toggle label="Booking Alerts" enabled />
        <Toggle label="Review Alerts" enabled />
        <Toggle label="Payment Alerts" enabled />
      </Section>

      <Section title="Email Configuration" icon={Mail}>
        <Input label="SMTP Host" defaultValue="smtp.gmail.com" />
        <Input label="SMTP Port" defaultValue="587" />
        <Input label="SMTP Username" defaultValue="your-email@gmail.com" />
        <Input label="SMTP Password" defaultValue="********" type="password" />
        <Input label="From Email" defaultValue="noreply@airclone.com" />
      </Section>

      <Section title="Security Settings" icon={Lock}>
        <Toggle label="Two Factor Authentication" enabled />
        <Toggle label="Block Suspicious Login" enabled />
        <Toggle label="Force Email Verification" enabled />
        <Toggle label="Maintenance Mode" />
        <Input label="Session Timeout Minutes" defaultValue="60" />
        <Input label="Max Login Attempts" defaultValue="5" />
      </Section>

      <Section title="Database & Backup" icon={Database}>
        <Toggle label="Automatic Daily Backup" enabled />
        <Toggle label="Backup Before Migration" enabled />
        <Input label="Backup Retention Days" defaultValue="30" />

        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl bg-gray-100 px-5 py-3 font-bold hover:bg-gray-200">
            Create Backup
          </button>
          <button className="rounded-xl bg-gray-100 px-5 py-3 font-bold hover:bg-gray-200">
            Restore Backup
          </button>
        </div>
      </Section>

      <Section title="Danger Zone" icon={Trash2}>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <h3 className="font-bold text-red-600">Danger Actions</h3>
          <p className="mt-1 text-sm text-red-500">
            These actions can permanently affect your platform data.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600">
              Clear Cache
            </button>
            <button className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600">
              Delete Test Data
            </button>
            <button className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white hover:bg-red-800">
              Reset Platform
            </button>
          </div>
        </div>
      </Section>

      <div className="sticky bottom-6 flex justify-end">
        <button className="flex items-center gap-2 rounded-2xl bg-rose-500 px-8 py-4 font-bold text-white shadow-xl shadow-rose-200 transition hover:bg-rose-600">
          <Save size={20} />
          Save All Settings
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-[1.7rem] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={22} />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Input({ label, defaultValue, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-600">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
      />
    </div>
  );
}

function Toggle({ label, enabled = false }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
      <span className="font-semibold text-gray-700">{label}</span>
      <button
        className={`flex h-7 w-12 items-center rounded-full p-1 transition ${
          enabled ? "bg-rose-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white transition ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>
          <h2 className="mt-2 text-2xl font-bold">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
