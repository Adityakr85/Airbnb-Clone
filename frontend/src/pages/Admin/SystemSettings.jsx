import {
  Settings,
  Shield,
  Mail,
  CreditCard,
  Bell,
  Database,
  Server,
  Globe,
  Upload,
  Save,
  Key,
  Lock,
  Percent,
  Trash2,
} from "lucide-react";

export default function SystemSettings() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            System Settings
          </h1>
          <p className="mt-1 text-gray-500">
            Manage platform configuration, security, email, payments, backups,
            and system controls.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-6 py-3 font-black text-white transition hover:bg-rose-600">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Platform" value="Live" icon={Globe} />
        <StatCard title="Security" value="Strong" icon={Shield} />
        <StatCard title="Backups" value="12" icon={Database} />
        <StatCard title="Server" value="Online" icon={Server} />
      </div>

      <Section title="General Platform Settings" icon={Settings}>
        <Input label="Website Name" defaultValue="Airbnb Clone" />
        <Input label="Support Email" defaultValue="support@airclone.com" />
        <Input label="Support Phone" defaultValue="+91 98765 43210" />
        <Input label="Default Currency" defaultValue="INR" />
        <Input label="Default Language" defaultValue="English" />
        <Input label="Timezone" defaultValue="Asia/Kolkata" />

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-600">
            Website Logo
          </label>
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 px-5 py-4 font-bold text-gray-600 transition hover:bg-gray-50">
            <Upload size={18} />
            Upload Logo
          </button>
        </div>

        <Toggle label="Maintenance Mode" />
      </Section>

      <Section title="Security Settings" icon={Shield}>
        <Toggle label="Two Factor Authentication" enabled />
        <Toggle label="Force Email Verification" enabled />
        <Toggle label="Block Suspicious Login" enabled />
        <Toggle label="Admin Login Alerts" enabled />
        <Input label="Session Timeout Minutes" defaultValue="60" />
        <Input label="Max Login Attempts" defaultValue="5" />
        <Input label="Password Expiry Days" defaultValue="90" />
        <Input label="Allowed Admin IPs" defaultValue="All" />
      </Section>

      <Section title="Payment Settings" icon={CreditCard}>
        <Toggle label="Enable Online Payments" enabled />
        <Toggle label="Enable Host Payouts" enabled />
        <Toggle label="Enable Refunds" enabled />
        <Toggle label="Cash Payment" />
        <Input label="Platform Commission (%)" defaultValue="10" />
        <Input label="Tax / GST (%)" defaultValue="18" />
        <Input label="Payout Delay Days" defaultValue="3" />
        <Input label="Minimum Payout Amount" defaultValue="1000" />
      </Section>

      <Section title="Email Configuration" icon={Mail}>
        <Input label="SMTP Host" defaultValue="smtp.gmail.com" />
        <Input label="SMTP Port" defaultValue="587" />
        <Input label="SMTP Username" defaultValue="your-email@gmail.com" />
        <Input label="SMTP Password" defaultValue="********" type="password" />
        <Input label="From Email" defaultValue="noreply@airclone.com" />
        <Input label="From Name" defaultValue="Airbnb Clone" />
        <Toggle label="Enable Email Notifications" enabled />
        <Toggle label="Send Welcome Emails" enabled />
      </Section>

      <Section title="Notification Settings" icon={Bell}>
        <Toggle label="Booking Alerts" enabled />
        <Toggle label="Payment Alerts" enabled />
        <Toggle label="Review Alerts" enabled />
        <Toggle label="Approval Alerts" enabled />
        <Toggle label="SMS Notifications" />
        <Toggle label="Push Notifications" enabled />
        <Toggle label="Admin Daily Summary" enabled />
        <Toggle label="Weekly Reports" />
      </Section>

      <Section title="API & Keys" icon={Key}>
        <Input
          label="Google Maps API Key"
          defaultValue="********"
          type="password"
        />
        <Input
          label="Razorpay Key ID"
          defaultValue="********"
          type="password"
        />
        <Input
          label="Razorpay Secret"
          defaultValue="********"
          type="password"
        />
        <Input
          label="Clerk Publishable Key"
          defaultValue="********"
          type="password"
        />
        <Input
          label="Clerk Secret Key"
          defaultValue="********"
          type="password"
        />
        <Toggle label="Enable API Access" enabled />
      </Section>

      <Section title="Database & Backup" icon={Database}>
        <Toggle label="Automatic Daily Backup" enabled />
        <Toggle label="Backup Before Migration" enabled />
        <Toggle label="Store Backup on Cloud" />
        <Input label="Backup Retention Days" defaultValue="30" />
        <Input label="Database Name" defaultValue="airbnb_clone" />

        <div className="flex flex-wrap gap-3">
          <button className="rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800">
            Create Backup
          </button>
          <button className="rounded-2xl bg-gray-100 px-5 py-3 font-bold text-gray-800 hover:bg-gray-200">
            Restore Backup
          </button>
        </div>
      </Section>

      <Section title="Danger Zone" icon={Trash2}>
        <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 p-5">
          <h3 className="font-black text-red-600">Danger Actions</h3>
          <p className="mt-1 text-sm text-red-500">
            These actions can permanently affect platform data.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="rounded-2xl bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600">
              Clear Cache
            </button>

            <button className="rounded-2xl bg-red-500 px-5 py-3 font-bold text-white hover:bg-red-600">
              Delete Test Data
            </button>

            <button className="rounded-2xl bg-red-700 px-5 py-3 font-bold text-white hover:bg-red-800">
              Reset Platform
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={22} />
        </div>

        <h2 className="text-xl font-black">{title}</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </div>
  );
}

function Input({ label, defaultValue, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-600">
        {label}
      </label>

      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
      />
    </div>
  );
}

function Toggle({ label, enabled = false }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center gap-3">
        <Lock size={17} className="text-gray-400" />
        <span className="font-bold text-gray-700">{label}</span>
      </div>

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
    <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <h2 className="mt-2 text-2xl font-black">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
