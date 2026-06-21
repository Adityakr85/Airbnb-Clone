import { useMemo, useState } from "react";
import {
  Search,
  Download,
  TicketPercent,
  Megaphone,
  Gift,
  Percent,
  Plus,
  MoreVertical,
  X,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
} from "lucide-react";

const campaignsData = [
  {
    id: "MKT-1001",
    title: "Summer Travel Sale",
    code: "SUMMER25",
    discount: "25%",
    type: "Coupon",
    audience: "All Users",
    status: "Active",
    starts: "Jun 20, 2026",
    ends: "Jul 20, 2026",
    usage: 248,
  },
  {
    id: "MKT-1002",
    title: "First Booking Offer",
    code: "FIRST500",
    discount: "₹500",
    type: "Coupon",
    audience: "New Users",
    status: "Active",
    starts: "Jun 01, 2026",
    ends: "Aug 01, 2026",
    usage: 132,
  },
  {
    id: "MKT-1003",
    title: "Host Referral Bonus",
    code: "HOSTBONUS",
    discount: "₹1000",
    type: "Referral",
    audience: "Hosts",
    status: "Paused",
    starts: "May 15, 2026",
    ends: "Jul 15, 2026",
    usage: 64,
  },
];

export default function Marketing() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const campaigns = useMemo(() => {
    return campaignsData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.audience.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Marketing</h1>
          <p className="mt-1 text-gray-500">
            Manage coupons, promotions, referral campaigns, and offers.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
            <Download size={18} />
            Export
          </button>

          <button className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600">
            <Plus size={18} />
            Create Campaign
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Active Campaigns" value="18" icon={Megaphone} />
        <StatCard title="Coupons Used" value="1,248" icon={TicketPercent} />
        <StatCard title="Avg Discount" value="18%" icon={Percent} />
        <StatCard title="Rewards Sent" value="₹84K" icon={Gift} />
      </div>

      <div className="rounded-[1.7rem] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns, codes, or audiences..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Expired</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {campaigns.map((item) => (
          <div
            key={item.id}
            className="rounded-[1.8rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                <TicketPercent size={25} />
              </div>

              <button
                onClick={() => setSelectedCampaign(item)}
                className="rounded-full p-2 transition hover:bg-gray-100"
              >
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <StatusBadge status={item.status} />
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600">
                {item.type}
              </span>
            </div>

            <h2 className="mt-4 text-xl font-black">{item.title}</h2>

            <div className="mt-4 rounded-2xl border border-dashed border-rose-200 bg-rose-50 p-4 text-center">
              <p className="text-xs font-black uppercase text-rose-500">
                Coupon Code
              </p>
              <p className="mt-1 text-2xl font-black tracking-wider text-rose-600">
                {item.code}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MiniInfo title="Discount" value={item.discount} />
              <MiniInfo title="Usage" value={item.usage} />
              <MiniInfo title="Audience" value={item.audience} />
              <MiniInfo title="Ends" value={item.ends} />
            </div>

            <button
              onClick={() => setSelectedCampaign(item)}
              className="mt-5 w-full rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800"
            >
              Manage Campaign
            </button>
          </div>
        ))}
      </div>

      {selectedCampaign && (
        <CampaignDrawer
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
}

function CampaignDrawer({ campaign, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Campaign Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-rose-500 to-orange-400 p-6 text-white">
          <p className="text-sm font-semibold text-white/80">Campaign Code</p>
          <h3 className="mt-1 text-4xl font-black">{campaign.code}</h3>
          <p className="mt-2 text-white/90">{campaign.title}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="Type" value={campaign.type} />
          <Info title="Status" value={campaign.status} />
          <Info title="Discount" value={campaign.discount} />
          <Info title="Audience" value={campaign.audience} />
          <Info title="Starts" value={campaign.starts} />
          <Info title="Ends" value={campaign.ends} />
          <Info title="Usage" value={campaign.usage} />
          <Info title="ID" value={campaign.id} />
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800">
            <Edit size={18} />
            Edit Campaign
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 font-bold text-emerald-600 hover:bg-emerald-100">
            <CheckCircle size={18} />
            Activate Campaign
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-50 px-5 py-3 font-bold text-yellow-700 hover:bg-yellow-100">
            <Eye size={18} />
            Pause Campaign
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Delete Campaign
          </button>
        </div>
      </aside>
    </div>
  );
}

function MiniInfo({ title, value }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-3">
      <p className="text-xs font-black uppercase text-gray-400">{title}</p>
      <p className="mt-1 text-sm font-black text-gray-950">{value}</p>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase text-gray-400">{title}</p>
      <p className="mt-1 font-bold text-gray-950">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    status === "Active"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Paused"
        ? "bg-yellow-50 text-yellow-600"
        : "bg-red-50 text-red-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {status}
    </span>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-black">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
