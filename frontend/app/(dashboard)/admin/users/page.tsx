"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserRow {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string | null;
  role: string;
  ligneIds: string[];
  lignes?: { id: string; name: string }[];
  createdAt?: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const authResp = await fetch("/api/auth/user");
      if (!authResp.ok) throw new Error("Unauthorized");
      const auth = await authResp.json();
      if (auth.role !== "SUPERADMIN") throw new Error("Only SUPERADMIN allowed");

      const resp = await fetch("/api/users");
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || data.error || "Failed to load users");
      setUsers(data.users || []);
    } catch (e:any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    setDeletingId(id);
    try {
      const resp = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || data.error || "Delete failed");
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e:any) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => load()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => router.push("/admin/users/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            + New User
          </button>
          <button
            onClick={() => router.push("/admin")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Back
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between">
          <span>{error}</span>
          <button className="underline" onClick={load}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Username</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Lignes</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">No users</td>
                </tr>
              )}
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-800">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-2 text-gray-700">{u.username}</td>
                  <td className="px-4 py-2 text-gray-700">{u.email}</td>
                  <td className="px-4 py-2 text-gray-700">{u.phone || '-'}</td>
                  <td className="px-4 py-2 text-gray-700">{u.role}</td>
                  <td className="px-4 py-2 text-sm text-gray-600 max-w-xs">
                    {(u.lignes || []).map(l => l.name).join(', ') || '-'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap flex gap-2 justify-end">
                    <button
                      onClick={() => router.push(`/admin/users/edit/${u.id}`)}
                      className="text-blue-600 hover:underline text-sm"
                    >Edit</button>
                    <button
                      onClick={() => router.push(`/admin/users/reset-password/${u.id}`)}
                      className="text-yellow-600 hover:underline text-sm"
                    >Reset</button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={deletingId === u.id}
                      className="text-red-600 hover:underline text-sm disabled:opacity-50"
                    >{deletingId === u.id ? 'Deleting...' : 'Delete'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
