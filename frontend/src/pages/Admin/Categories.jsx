import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Search,
  Plus,
  Grid3X3,
  Home,
  Compass,
  EyeOff,
  X,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  toggleAdminCategory,
} from "../../api/admin";

const emptyForm = {
  name: "",
  category_for: "property",
  icon: "🏠",
  image: "",
  is_active: true,
  sort_order: 0,
};

export default function Categories() {
  const { user } = useUser();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [activeCard, setActiveCard] = useState("total");
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const clerkId = user?.id;
  const role = "admin";

  const loadCategories = async () => {
    if (!clerkId) return;

    try {
      setLoading(true);

      const data = await fetchAdminCategories(clerkId);

      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadCategories();
  }, [clerkId]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.name?.toLowerCase().includes(search.toLowerCase()) ||
        category.slug?.toLowerCase().includes(search.toLowerCase());

      const matchesType = type === "all" || category.category_for === type;

      const matchesStatus =
        status === "all" ||
        (status === "active" && Number(category.is_active) === 1) ||
        (status === "hidden" && Number(category.is_active) === 0);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [categories, search, type, status]);

  const stats = useMemo(() => {
    return {
      total: categories.length,
      property: categories.filter((c) => c.category_for === "property").length,
      experience: categories.filter((c) => c.category_for === "experience")
        .length,
      hidden: categories.filter((c) => Number(c.is_active) === 0).length,
    };
  }, [categories]);

  const openAddModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
      category_for: category.category_for || "property",
      icon: category.icon || "🏠",
      image: category.image || "",
      is_active: Number(category.is_active) === 1,
      sort_order: category.sort_order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (!form.icon.trim()) {
      toast.error("Icon is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        is_active: form.is_active ? 1 : 0,
        sort_order: Number(form.sort_order) || 0,
      };

      if (editingCategory) {
        await updateAdminCategory(clerkId, editingCategory.id, payload);
        toast.success("Category updated");
      } else {
        await createAdminCategory(clerkId, payload);
        toast.success("Category created");
      }

      setModalOpen(false);
      setEditingCategory(null);
      setForm(emptyForm);
      await loadCategories();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteAdminCategory(clerkId, deleteTarget.id);
      toast.success("Category deleted");
      setDeleteTarget(null);
      await loadCategories();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Cannot delete this category because it may be in use",
      );
    }
  };

  const handleToggle = async (category) => {
    try {
      await toggleAdminCategory(clerkId, category.id);
      toast.success(
        Number(category.is_active) === 1
          ? "Category hidden"
          : "Category activated",
      );
      await loadCategories();
    } catch (error) {
      toast.error("Failed to update category status");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Categories</h1>
          <p className="mt-1 text-gray-500">
            Manage property and experience categories from one place.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white transition hover:bg-rose-600"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          title="Total Categories"
          value={stats.total}
          icon={Grid3X3}
          active={activeCard === "total"}
          onClick={() => {
            setActiveCard("total");
            setType("all");
            setStatus("all");
          }}
        />

        <StatCard
          title="Property Types"
          value={stats.property}
          icon={Home}
          active={activeCard === "property"}
          onClick={() => {
            setActiveCard("property");
            setType("property");
            setStatus("all");
          }}
        />

        <StatCard
          title="Experience Types"
          value={stats.experience}
          icon={Compass}
          active={activeCard === "experience"}
          onClick={() => {
            setActiveCard("experience");
            setType("experience");
            setStatus("all");
          }}
        />

        <StatCard
          title="Hidden"
          value={stats.hidden}
          icon={EyeOff}
          active={activeCard === "hidden"}
          onClick={() => {
            setActiveCard("hidden");
            setType("all");
            setStatus("hidden");
          }}
        />
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
              onKeyDown={(e) => {
                if (e.key === "Enter") loadCategories();
              }}
              type="text"
              placeholder="Search categories..."
              className="w-full rounded-2xl border border-gray-200 py-3 pl-11 pr-4 outline-none transition focus:border-rose-500"
            />
          </div>

          <select
            value={type}
            onChange={(e) => {
              const value = e.target.value;

              setType(value);

              if (value === "property") {
                setActiveCard("property");
              } else if (value === "experience") {
                setActiveCard("experience");
              } else if (status === "hidden") {
                setActiveCard("hidden");
              } else {
                setActiveCard("total");
              }
            }}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option value="all">All Types</option>
            <option value="property">Property</option>
            <option value="experience">Experience</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              const value = e.target.value;

              setStatus(value);

              if (value === "hidden") {
                setActiveCard("hidden");
              } else if (type === "property") {
                setActiveCard("property");
              } else if (type === "experience") {
                setActiveCard("experience");
              } else {
                setActiveCard("total");
              }
            }}
            className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-rose-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-500">
          <Loader2 className="animate-spin" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="rounded-[1.7rem] border border-gray-100 bg-white p-10 text-center shadow-sm">
          <p className="font-bold text-gray-900">No categories found</p>
          <p className="mt-1 text-sm text-gray-500">
            Try changing your filters or add a new category.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={() => openEditModal(category)}
              onDelete={() => setDeleteTarget(category)}
              onToggle={() => handleToggle(category)}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <CategoryModal
          form={form}
          setForm={setForm}
          editingCategory={editingCategory}
          saving={saving}
          onClose={() => {
            setModalOpen(false);
            setEditingCategory(null);
          }}
          onSubmit={handleSave}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function CategoryCard({ category, onEdit, onDelete, onToggle }) {
  const isActive = Number(category.is_active) === 1;

  return (
    <div className="rounded-[1.8rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-[1.3rem] bg-gray-100 text-3xl">
          {category.icon || "🏠"}
        </div>

        <Badge active={isActive} />
      </div>

      <h2 className="mt-5 text-xl font-black">{category.name}</h2>

      <p className="mt-1 text-sm capitalize text-gray-500">
        {category.category_for}
      </p>

      <div className="mt-4 rounded-2xl bg-gray-50 p-3">
        <p className="text-xs font-bold uppercase text-gray-400">Slug</p>
        <p className="mt-1 truncate text-sm font-semibold text-gray-700">
          {category.slug}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm font-semibold text-gray-500">
        <span>Order: {category.sort_order ?? 0}</span>
        <span>ID: {category.id}</span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-1 rounded-xl bg-gray-100 py-2 text-sm font-bold transition hover:bg-gray-200"
        >
          <Edit size={15} />
          Edit
        </button>

        <button
          onClick={onToggle}
          className={`flex items-center justify-center gap-1 rounded-xl py-2 text-sm font-bold transition ${
            isActive
              ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          {isActive ? <EyeOff size={15} /> : <Eye size={15} />}
          {isActive ? "Hide" : "Show"}
        </button>

        <button
          onClick={onDelete}
          className="flex items-center justify-center gap-1 rounded-xl bg-red-50 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </div>
  );
}

function CategoryModal({
  form,
  setForm,
  editingCategory,
  saving,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">
            {editingCategory ? "Edit Category" : "Add Category"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="House"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">Type</label>
            <select
              value={form.category_for}
              onChange={(e) =>
                setForm((f) => ({ ...f, category_for: e.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-rose-500"
            >
              <option value="property">Property</option>
              <option value="experience">Experience</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">Icon</label>
            <input
              value={form.icon}
              onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              placeholder="🏠"
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-xl outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">
              Image URL optional
            </label>
            <input
              value={form.image || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, image: e.target.value }))
              }
              placeholder="https://..."
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">
              Sort Order
            </label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) =>
                setForm((f) => ({ ...f, sort_order: e.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-rose-500"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_active: e.target.checked }))
              }
              className="h-4 w-4"
            />
            <span className="font-bold text-gray-700">Active</span>
          </label>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-gray-200 px-5 py-3 font-bold hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-500 px-5 py-3 font-bold text-white hover:bg-rose-600 disabled:opacity-60"
            >
              {saving && <Loader2 size={18} className="animate-spin" />}
              {editingCategory ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ category, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[110]">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[2rem] bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-black">Delete Category?</h2>

        <p className="mt-3 text-gray-500">
          Are you sure you want to delete{" "}
          <span className="font-bold text-gray-900">{category.name}</span>? This
          action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-gray-200 px-5 py-3 font-bold hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ active }) {
  const style = active
    ? "bg-emerald-50 text-emerald-600"
    : "bg-yellow-50 text-yellow-600";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${style}`}>
      {active ? "Active" : "Hidden"}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[1.7rem] border p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        active ? "border-rose-500 bg-rose-50" : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <h2 className="mt-2 text-3xl font-black">{value}</h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            active ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-500"
          }`}
        >
          <Icon size={24} />
        </div>
      </div>
    </button>
  );
}
