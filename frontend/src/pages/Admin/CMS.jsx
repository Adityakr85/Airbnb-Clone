import { useMemo, useState } from "react";
import {
  Search,
  Download,
  FileText,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  X,
  Globe,
  Clock,
  CheckCircle,
} from "lucide-react";

const pagesData = [
  {
    id: "CMS-1001",
    title: "About Us",
    slug: "/about",
    status: "Published",
    lastUpdated: "Jun 15, 2026",
    author: "Admin",
    views: 12480,
    description: "Company story, platform mission, and business overview.",
  },
  {
    id: "CMS-1002",
    title: "Privacy Policy",
    slug: "/privacy-policy",
    status: "Published",
    lastUpdated: "Jun 12, 2026",
    author: "Admin",
    views: 8420,
    description: "User privacy, data storage, and account protection policy.",
  },
  {
    id: "CMS-1003",
    title: "FAQ",
    slug: "/faq",
    status: "Draft",
    lastUpdated: "Jun 18, 2026",
    author: "Support Team",
    views: 3120,
    description: "Frequently asked questions for guests and hosts.",
  },
];

export default function CMS() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedPage, setSelectedPage] = useState(null);

  const pages = useMemo(() => {
    return pagesData.filter((page) => {
      const matchesSearch =
        page.title.toLowerCase().includes(search.toLowerCase()) ||
        page.slug.toLowerCase().includes(search.toLowerCase()) ||
        page.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || page.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">CMS Pages</h1>
          <p className="mt-1 text-gray-500">
            Manage static website pages, policies, FAQs, and public content.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white transition hover:bg-gray-800">
            <Download size={18} />
            Export
          </button>

          <button className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600">
            <Plus size={18} />
            New Page
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Total Pages" value="18" icon={FileText} />
        <StatCard title="Published" value="14" icon={CheckCircle} />
        <StatCard title="Drafts" value="4" icon={Clock} />
        <StatCard title="Total Views" value="84K" icon={Globe} />
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
              placeholder="Search pages..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option>All</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5">
        {pages.map((page) => (
          <div
            key={page.id}
            className="rounded-[1.7rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-black text-gray-950">
                    {page.title}
                  </h2>

                  <StatusBadge status={page.status} />

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600">
                    {page.slug}
                  </span>
                </div>

                <p className="mt-3 max-w-3xl text-gray-600">
                  {page.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-gray-500">
                  <span>Author: {page.author}</span>
                  <span>Updated: {page.lastUpdated}</span>
                  <span>Views: {page.views}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPage(page)}
                className="rounded-full p-2 transition hover:bg-gray-100"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPage && (
        <PageDrawer page={selectedPage} onClose={() => setSelectedPage(null)} />
      )}
    </div>
  );
}

function PageDrawer({ page, onClose }) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Page Details</h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-gradient-to-br from-gray-950 to-rose-600 p-6 text-white">
          <p className="text-sm font-semibold text-white/70">CMS Page</p>
          <h3 className="mt-1 text-3xl font-black">{page.title}</h3>
          <p className="mt-2 text-white/80">{page.slug}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Info title="ID" value={page.id} />
          <Info title="Status" value={page.status} />
          <Info title="Slug" value={page.slug} />
          <Info title="Author" value={page.author} />
          <Info title="Views" value={page.views} />
          <Info title="Updated" value={page.lastUpdated} />
        </div>

        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-bold uppercase text-gray-400">
            Description
          </p>
          <p className="mt-2 text-sm font-medium text-gray-700">
            {page.description}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 font-bold text-white hover:bg-gray-800">
            <Eye size={18} />
            Preview Page
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600">
            <Edit size={18} />
            Edit Page
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            <Trash2 size={18} />
            Delete Page
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
    status === "Published"
      ? "bg-emerald-50 text-emerald-600"
      : "bg-yellow-50 text-yellow-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {status}
    </span>
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
