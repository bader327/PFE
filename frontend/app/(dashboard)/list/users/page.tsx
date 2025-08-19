"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../lib/auth-hooks";
import Pagination from "../../../components/Pagination";
import Table from "../../../components/Table";
import TableSearch from "../../../components/TableSearch";

type UserRow = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string | null;
  role: string;
  ligneIds: string[];
  lignes?: { id: string; name: string }[];
};

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Username", accessor: "username", className: "hidden md:table-cell" },
  { header: "Role", accessor: "role", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Lignes", accessor: "lignes", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "actions" },
];

const roles = ["SUPERADMIN", "QUALITICIEN", "CHEF_ATELIER", "NORMAL_USER"] as const;

const UsersPage = () => {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [filtered, setFiltered] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    role: "NORMAL_USER",
    ligneIds: [] as string[], // selected ligne ids
  });
  const [lignes, setLignes] = useState<{ id: string; name: string }[]>([]);

  // Fetch users
  useEffect(() => {
    if (!authUser) return;
    if (authUser.role !== "SUPERADMIN") return; // Only superadmin can list
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/users", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load users");
        setUsers(data.users || []);
        setFiltered(data.users || []);
        if ((data.lignes?.length || 0) > 0) {
          setLignes((prev) => prev.length === 0 ? data.lignes : prev);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [authUser]);

  // Fetch lignes for selection
  useEffect(() => {
    if (!authUser || authUser.role !== 'SUPERADMIN') return;
    const load = async () => {
      try {
        let r = await fetch('/api/lignes');
        if (r.status === 404) {
          // fallback path variant
            r = await fetch('/api/lignes/list');
        }
        const d = await r.json().catch(() => ({ lignes: [] }));
        if (r.ok) {
          setLignes(d.lignes || []);
        } else {
          console.warn('Failed to fetch lignes', r.status, d);
        }
      } catch (err) {
        console.warn('Error fetching lignes', err);
      }
    };
    load();
  }, [authUser]);

  // Simple search handler
  const handleSearch = (term: string) => {
    const t = term.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.firstName.toLowerCase().includes(t) ||
          u.lastName.toLowerCase().includes(t) ||
          u.email.toLowerCase().includes(t) ||
          u.username.toLowerCase().includes(t)
      )
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
  const payload = { ...form, ligneIds: form.ligneIds };
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create user");
      setUsers((prev) => [data.user, ...prev]);
      setFiltered((prev) => [data.user, ...prev]);
  setForm({ firstName: "", lastName: "", username: "", email: "", phone: "", role: "NORMAL_USER", ligneIds: [] });
      setShowCreate(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setFiltered((prev) => prev.filter((u) => u.id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  };

  const renderRow = (item: UserRow) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-gray-100 transition-all"
    >
      <td className="p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800">
            {item.firstName} {item.lastName}
          </h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell text-gray-700">{item.username}</td>
      <td className="hidden md:table-cell text-gray-700">{item.role}</td>
      <td className="hidden lg:table-cell text-gray-700">{item.phone || "-"}</td>
      <td className="hidden lg:table-cell text-gray-700">
        {item.lignes && item.lignes.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {item.lignes.map(l => (
              <span key={l.id} className="px-2 py-0.5 rounded bg-gray-200 text-[10px] font-medium">
                {l.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>
      <td className="p-2">
        {authUser?.role === "SUPERADMIN" && (
          <button
            onClick={() => handleDelete(item.id)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition text-white"
            title="Delete"
          >
            <Image src="/delete.png" alt="delete" width={16} height={16} />
          </button>
        )}
      </td>
    </tr>
  );

  const notAuthorized = authUser && authUser.role !== "SUPERADMIN";

  return (
    <div className="bg-white p-6 rounded-xl shadow-md m-4 mt-0 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        {authUser?.role === "SUPERADMIN" && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <TableSearch onSearch={handleSearch} />
            <button
              onClick={() => setShowCreate((s) => !s)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 transition"
              title="Create User"
            >
              <Image src="/create.png" alt="create" width={14} height={14} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 text-sm rounded bg-red-100 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {notAuthorized && (
        <div className="p-3 text-sm rounded bg-yellow-100 text-yellow-800 border border-yellow-200">
          You are not authorized to view the users list.
        </div>
      )}

      {showCreate && authUser?.role === "SUPERADMIN" && (
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50"
        >
          <input
            placeholder="First Name"
            className="input"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <input
            placeholder="Last Name"
            className="input"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
            <input
            placeholder="Username"
            className="input"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Phone"
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <select
            className="input"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <div className="md:col-span-3 flex flex-col gap-2 bg-white p-3 rounded border">
            <span className="text-xs font-semibold text-gray-600">Assign Lignes</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {lignes.map(l => {
                const checked = form.ligneIds.includes(l.id);
                return (
                  <label key={l.id} className="flex items-center gap-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="accent-yellow-500"
                      checked={checked}
                      onChange={() => {
                        setForm(f => ({
                          ...f,
                          ligneIds: checked ? f.ligneIds.filter(id => id !== l.id) : [...f.ligneIds, l.id]
                        }));
                      }}
                    />
                    <span>{l.name}</span>
                  </label>
                );
              })}
              {lignes.length === 0 && (
                <span className="text-gray-400 col-span-full">No lignes</span>
              )}
            </div>
          </div>
          <div className="flex gap-4 md:col-span-3">
            <button
              disabled={creating}
              className="px-4 py-2 rounded bg-green-600 text-white text-sm disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded bg-gray-300 text-gray-800 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* TABLE */}
      {authUser?.role === "SUPERADMIN" && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          {loading ? (
            <div className="p-4 text-sm text-gray-500">Loading users...</div>
          ) : (
            <Table columns={columns} renderRow={renderRow} data={filtered} />
          )}
        </div>
      )}

      {/* PAGINATION placeholder (server-side not yet implemented) */}
      {authUser?.role === "SUPERADMIN" && <Pagination />}
    </div>
  );
};

export default UsersPage;
