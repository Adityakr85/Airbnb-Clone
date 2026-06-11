import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Edit2, Trash2, Eye, Star, ArrowLeft,
  ToggleLeft, ToggleRight, Search, IndianRupee
} from "lucide-react";
import { useHost } from "../../pages/Host/HostContext";
import toast from "react-hot-toast";

const amenitiesList = ["WiFi", "Kitchen", "Air Conditioning", "Heating", "Washing Machine", "TV", "Pool", "Gym", "Parking", "Pets Allowed", "Breakfast", "Fireplace"];

export default function MyProperties() {
  const { properties, updateProperty, deleteProperty } = useHost();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const saveEdit = () => {
    updateProperty(editingId, { ...editForm, price: Number(editForm.price) });
    setEditingId(null);
    toast.success("Property updated!");
  };

  const handleDelete = (id) => {
    deleteProperty(id);
    setConfirmDelete(null);
    toast.success("Property removed.");
  };

  const toggleStatus = (p) => {
    const next = p.status === "active" ? "inactive" : "active";
    updateProperty(p.id, { status: next });
    toast.success(`Listing ${next === "active" ? "activated" : "deactivated"}`);
  };

  return (
    <div className="min-h-screen bg-white">
      
      <div className="bg-white border-b border-gray-200 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/host" className="p-2 rounded-full hover:bg-gray-100 transition">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Properties</h1>
              <p className="text-sm text-gray-500">{properties.length} listings</p>
            </div>
          </div>
          <Link to="/host/add-property"
            className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2.5 rounded-full font-semibold hover:bg-rose-600 transition text-sm">
            <Plus size={16} /> Add Property
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
        
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or location..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
          />
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
            <p className="text-lg font-medium">No properties found</p>
            <Link to="/host/add-property" className="mt-3 inline-flex items-center gap-2 text-rose-500 hover:underline font-medium">
              <Plus size={16} /> Add your first listing
            </Link>
          </div>
        )}

        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {editingId === p.id ? (
              
              <div className="p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Edit Property</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
                    <input value={editForm.title} onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Location</label>
                    <input value={editForm.location} onChange={(e) => setEditForm(f => ({ ...f, location: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Price per night (₹)</label>
                    <input type="number" value={editForm.price} onChange={(e) => setEditForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
                    <input value={editForm.type || ""} onChange={(e) => setEditForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                  <textarea rows={3} value={editForm.description || ""} onChange={(e) => setEditForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {amenitiesList.map((a) => {
                      const selected = (editForm.amenities || []).includes(a);
                      return (
                        <button key={a} onClick={() => setEditForm(f => ({
                          ...f,
                          amenities: selected ? (f.amenities || []).filter(x => x !== a) : [...(f.amenities || []), a]
                        }))}
                          className={`px-3 py-1.5 rounded-full text-sm border transition ${selected ? "bg-rose-500 text-white border-rose-500" : "border-gray-200 hover:border-gray-300"}`}>
                          {a}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditingId(null)}
                    className="px-5 py-2 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button onClick={saveEdit}
                    className="px-5 py-2 bg-rose-500 text-white rounded-full font-semibold hover:bg-rose-600 transition">
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              
              <div className="flex flex-col sm:flex-row gap-0">
                <img src={`${p.image}?w=280&q=70`} alt={p.title}
                  className="sm:w-48 h-40 sm:h-auto object-cover flex-shrink-0" />
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{p.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{p.location} · {p.type}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 flex-shrink-0">
                      ₹{p.price.toLocaleString("en-IN")}<span className="text-sm font-normal text-gray-500">/night</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      {p.rating || "New"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {p.views} views
                    </span>
                    <span>{p.bookings} bookings</span>
                    <span className="flex items-center gap-1">
                      <IndianRupee size={13} /> {p.earnings.toLocaleString("en-IN")} earned
                    </span>
                  </div>

                  {p.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.description}</p>
                  )}

                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <button onClick={() => startEdit(p)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-200 rounded-full hover:bg-gray-50 transition">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => toggleStatus(p)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-200 rounded-full hover:bg-gray-50 transition">
                      {p.status === "active" ? <ToggleRight size={14} className="text-green-500" /> : <ToggleLeft size={14} />}
                      {p.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => setConfirmDelete(p.id)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Property?</h3>
            <p className="text-gray-500 text-sm mb-5">This will permanently remove the listing and all associated data.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
