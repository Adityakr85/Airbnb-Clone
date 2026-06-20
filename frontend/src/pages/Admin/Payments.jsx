import {
  IndianRupee,
  CreditCard,
  Wallet,
  RefreshCcw,
  Search,
  Download,
} from "lucide-react";

const payments = [
  {
    id: "#PAY-1001",
    guest: "Rahul Sharma",
    host: "Amit Kumar",
    amount: "₹12,500",
    commission: "₹1,250",
    status: "Completed",
    date: "Jun 15, 2026",
  },
  {
    id: "#PAY-1002",
    guest: "Sneha Verma",
    host: "Priya Singh",
    amount: "₹8,200",
    commission: "₹820",
    status: "Pending",
    date: "Jun 16, 2026",
  },
  {
    id: "#PAY-1003",
    guest: "Amit Kumar",
    host: "Rahul Sharma",
    amount: "₹15,000",
    commission: "₹1,500",
    status: "Refunded",
    date: "Jun 17, 2026",
  },
];

export default function Payments() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="mt-1 text-gray-500">
            Manage revenue, payouts, commissions and refunds.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Revenue" value="₹8.4L" icon={IndianRupee} />

        <StatCard title="Platform Commission" value="₹84K" icon={CreditCard} />

        <StatCard title="Host Payouts" value="₹7.56L" icon={Wallet} />

        <StatCard title="Refunds" value="₹32K" icon={RefreshCcw} />
      </div>

      <div className="rounded-[1.7rem] bg-white p-5 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 outline-none focus:border-rose-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.7rem] bg-white shadow-sm">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">Transaction</th>
              <th className="px-6 py-4 text-left">Guest</th>
              <th className="px-6 py-4 text-left">Host</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Commission</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-5 font-semibold">{payment.id}</td>

                <td className="px-6 py-5">{payment.guest}</td>

                <td className="px-6 py-5">{payment.host}</td>

                <td className="px-6 py-5 font-bold">{payment.amount}</td>

                <td className="px-6 py-5 text-rose-500 font-bold">
                  {payment.commission}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      payment.status === "Completed"
                        ? "bg-emerald-50 text-emerald-600"
                        : payment.status === "Pending"
                          ? "bg-yellow-50 text-yellow-600"
                          : "bg-red-50 text-red-600"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-gray-500">{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-[1.7rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
