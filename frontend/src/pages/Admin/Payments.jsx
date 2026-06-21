import { useMemo, useState } from "react";
import {
  Search,
  Download,
  IndianRupee,
  CreditCard,
  Wallet,
  RotateCcw,
  Percent,
  MoreVertical,
  X,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 58000 },
  { month: "Mar", revenue: 64000 },
  { month: "Apr", revenue: 72000 },
  { month: "May", revenue: 91000 },
  { month: "Jun", revenue: 125000 },
];

const transactionsData = [
  {
    id: "PAY-1001",
    guest: "Rahul Sharma",
    host: "Amit Kumar",
    property: "Luxury Villa in Goa",
    amount: "₹45,000",
    commission: "₹4,500",
    payout: "₹40,500",
    status: "Completed",
    date: "Jun 15, 2026",
  },
  {
    id: "PAY-1002",
    guest: "Sneha Verma",
    host: "Priya Singh",
    property: "Modern Apartment in Mumbai",
    amount: "₹24,600",
    commission: "₹2,460",
    payout: "₹22,140",
    status: "Pending",
    date: "Jun 16, 2026",
  },
  {
    id: "PAY-1003",
    guest: "Amit Kumar",
    host: "Rahul Sharma",
    property: "Mountain Stay in Manali",
    amount: "₹38,000",
    commission: "₹3,800",
    payout: "₹34,200",
    status: "Refunded",
    date: "Jun 18, 2026",
  },
];

export default function Payments() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const transactions = useMemo(() => {
    return transactionsData.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.guest.toLowerCase().includes(search.toLowerCase()) ||
        item.host.toLowerCase().includes(search.toLowerCase()) ||
        item.property.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Payments</h1>
          <p className="mt-1 text-gray-500">
            Manage revenue, transactions, payouts, refunds, and platform
            commission.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="rounded-[2rem] bg-gradient-to-r from-gray-950 via-gray-900 to-rose-600 p-8 text-white shadow-xl">
        <p className="text-sm font-bold uppercase text-white/70">
          Total Revenue
        </p>
        <h2 className="mt-2 text-5xl font-black">₹8.4L</h2>
        <p className="mt-3 text-white/80">
          +21.7% growth compared to last month
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-5">
        <StatCard title="Revenue" value="₹8.4L" icon={IndianRupee} />
        <StatCard title="Transactions" value="1,245" icon={CreditCard} />
        <StatCard title="Host Payouts" value="₹7.56L" icon={Wallet} />
        <StatCard title="Refunds" value="₹32K" icon={RotateCcw} />
        <StatCard title="Commission" value="₹84K" icon={Percent} />
      </div>

      <div className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Revenue Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Monthly revenue performance
        </p>

        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#e11d48"
                fill="#ffe4e6"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
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
              placeholder="Search transaction, guest, host, or property..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Refunded</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.7rem] border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-bold">Transaction</th>
                <th className="px-6 py-4 font-bold">Guest</th>
                <th className="px-6 py-4 font-bold">Host</th>
                <th className="px-6 py-4 font-bold">Property</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Commission</th>
                <th className="px-6 py-4 font-bold">Payout</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {transactions.map((item) => (
                <tr key={item.id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-5 font-black">{item.id}</td>
                  <td className="px-6 py-5 font-semibold">{item.guest}</td>
                  <td className="px-6 py-5 text-gray-600">{item.host}</td>
                  <td className="px-6 py-5 text-gray-600">{item.property}</td>
                  <td className="px-6 py-5 font-black">{item.amount}</td>
                  <td className="px-6 py-5 font-bold text-rose-600">
                    {item.commission}
                  </td>
                  <td className="px-6 py-5 font-bold text-emerald-600">
                    {item.payout}
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => setSelectedTransaction(item)}
                      className="rounded-full p-2 transition hover:bg-gray-100"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTransaction && (
        <TransactionDrawer
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

function TransactionDrawer({ transaction, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Transaction Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-gray-950 to-rose-600 p-6 text-white">
          <p className="text-sm font-semibold text-white/70">Transaction ID</p>
          <h3 className="mt-1 text-3xl font-black">{transaction.id}</h3>
          <p className="mt-2 text-white/80">{transaction.property}</p>
        </div>

        <div className="mt-6">
          <StatusBadge status={transaction.status} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="Guest" value={transaction.guest} />
          <Info title="Host" value={transaction.host} />
          <Info title="Amount" value={transaction.amount} />
          <Info title="Commission" value={transaction.commission} />
          <Info title="Payout" value={transaction.payout} />
          <Info title="Date" value={transaction.date} />
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-bold text-white hover:bg-emerald-600">
            <CheckCircle size={18} />
            Mark Completed
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-50 px-5 py-3 font-bold text-yellow-700 hover:bg-yellow-100">
            <Clock size={18} />
            Mark Pending
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-bold text-red-600 hover:bg-red-100">
            <XCircle size={18} />
            Process Refund
          </button>
        </div>
      </aside>
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
    status === "Completed"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Pending"
        ? "bg-yellow-50 text-yellow-600"
        : "bg-blue-50 text-blue-600";

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
          <h2 className="mt-2 text-2xl font-black">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
