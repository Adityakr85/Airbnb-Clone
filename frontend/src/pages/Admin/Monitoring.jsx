import {
  Server,
  Database,
  HardDrive,
  Wifi,
  Cpu,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCcw,
} from "lucide-react";

const services = [
  {
    name: "Laravel API",
    status: "Operational",
    uptime: "99.98%",
    response: "124ms",
  },
  {
    name: "MySQL Database",
    status: "Operational",
    uptime: "99.95%",
    response: "82ms",
  },
  {
    name: "File Storage",
    status: "Operational",
    uptime: "99.91%",
    response: "150ms",
  },
  {
    name: "Payment Gateway",
    status: "Degraded",
    uptime: "98.40%",
    response: "410ms",
  },
];

const incidents = [
  {
    id: 1,
    title: "Payment gateway slow response",
    type: "Warning",
    time: "10 minutes ago",
  },
  {
    id: 2,
    title: "Database backup completed",
    type: "Success",
    time: "1 hour ago",
  },
  {
    id: 3,
    title: "API health check passed",
    type: "Success",
    time: "2 hours ago",
  },
];

export default function Monitoring() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            System Monitoring
          </h1>
          <p className="mt-1 text-gray-500">
            Track server health, database status, API uptime, and platform
            performance.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <RefreshCcw size={18} />
          Refresh Status
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="API Status" value="Online" icon={Server} />
        <StatCard title="Database" value="Connected" icon={Database} />
        <StatCard title="Storage" value="64%" icon={HardDrive} />
        <StatCard title="Network" value="Stable" icon={Wifi} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-xl font-black">Service Health</h2>

          <div className="mt-6 space-y-4">
            {services.map((service) => (
              <div
                key={service.name}
                className="rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="font-black text-gray-950">{service.name}</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Uptime: {service.uptime} · Response: {service.response}
                    </p>
                  </div>

                  <StatusBadge status={service.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Server Load</h2>

          <div className="mt-8 space-y-6">
            <Progress label="CPU Usage" value="42%" width="42%" icon={Cpu} />
            <Progress
              label="Memory Usage"
              value="68%"
              width="68%"
              icon={Activity}
            />
            <Progress
              label="Disk Usage"
              value="64%"
              width="64%"
              icon={HardDrive}
            />
            <Progress
              label="Network Load"
              value="36%"
              width="36%"
              icon={Wifi}
            />
          </div>
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Recent Incidents</h2>

        <div className="mt-6 space-y-4">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="flex items-center justify-between rounded-2xl bg-gray-50 p-5"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    incident.type === "Success"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-yellow-50 text-yellow-600"
                  }`}
                >
                  {incident.type === "Success" ? (
                    <CheckCircle size={21} />
                  ) : (
                    <AlertTriangle size={21} />
                  )}
                </div>

                <div>
                  <p className="font-black text-gray-950">{incident.title}</p>

                  <p className="text-sm text-gray-500">{incident.time}</p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-black ${
                  incident.type === "Success"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-yellow-50 text-yellow-600"
                }`}
              >
                {incident.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <MiniCard title="Last Backup" value="Today, 3:00 AM" icon={Clock} />
        <MiniCard title="Error Rate" value="0.08%" icon={AlertTriangle} />
        <MiniCard title="Requests Today" value="42,810" icon={Activity} />
      </div>
    </div>
  );
}

function Progress({ label, value, width, icon: Icon }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={17} className="text-rose-500" />
          <span className="font-bold text-gray-700">{label}</span>
        </div>

        <span className="font-black">{value}</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-rose-500" style={{ width }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "Operational"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-yellow-50 text-yellow-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {status}
    </span>
  );
}

function MiniCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={22} />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <h3 className="mt-1 text-lg font-black">{value}</h3>
        </div>
      </div>
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
