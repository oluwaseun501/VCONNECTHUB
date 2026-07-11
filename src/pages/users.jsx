import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import AdminSidebar from "./adminSidebar";
import AdminTopbar from "./adminTopbar";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Loader2,
  Shield,
} from "lucide-react";
import { getAdminUsers } from "./adminApi";

const PER_PAGE = 8;

function getInitials(name) {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "??";
}

const AVATAR_COLORS = [
  "bg-violet-500", "bg-fuchsia-500", "bg-amber-500",
  "bg-emerald-500", "bg-blue-500", "bg-rose-500",
];

function colorFor(id) {
  const hash = String(id).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [allUsers, setAllUsers] = useState([]);   // full sorted list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  // Fetch ALL users once, sort admins first, paginate client-side
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await getAdminUsers({ limit: 500 });
        if (!cancelled) {
          const raw = Array.isArray(data) ? data : (data.users ?? []);
          // Admins at the top, then by join date (newest first)
          const sorted = [...raw].sort((a, b) => {
            if (b.isAdmin !== a.isAdmin) return (b.isAdmin ? 1 : 0) - (a.isAdmin ? 1 : 0);
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setAllUsers(sorted);
        }
      } catch (err) {
        if (!cancelled) setError("Failed to load users.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = (v) => {
    setSearch(v);
    setPage(1);
  };

  // Client-side search filter
  const filtered = search
    ? allUsers.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : allUsers;

  const total = filtered.length;
  const totalPages = Math.ceil(total / PER_PAGE);
  // Slice for current page
  const users = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Users</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {total} users found
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-all"
            />
            {search && (
              <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          {/* Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="text-left px-6 py-3.5 font-medium">User</th>
                      <th className="text-left px-4 py-3.5 font-medium hidden md:table-cell">
                        <span className="inline-flex items-center gap-1">Balance <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="text-left px-4 py-3.5 font-medium hidden lg:table-cell">Orders</th>
                      <th className="text-left px-4 py-3.5 font-medium hidden xl:table-cell">Joined</th>
                      <th className="text-left px-4 py-3.5 font-medium">Status</th>
                      <th className="text-left px-4 py-3.5 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground text-sm">
                          No users match your search.
                        </td>
                      </tr>
                    ) : (
                      users.map((u, i) => (
                        <tr
                          key={u._id}
                          className={`border-b border-border/50 hover:bg-white/5 transition-colors ${i === users.length - 1 ? "border-b-0" : ""}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <div className={`w-9 h-9 rounded-full ${colorFor(u._id)} flex items-center justify-center text-white text-xs font-bold`}>
                                  {getInitials(u.name)}
                                </div>
                                {u.isAdmin && (
                                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-600 border-2 border-background flex items-center justify-center">
                                    <Shield className="w-2 h-2 text-white" />
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground leading-tight">{u.name}</p>
                                <p className="text-xs text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 font-semibold text-foreground hidden md:table-cell">₦{(u.balance ?? 0).toLocaleString()}</td>
                          <td className="px-4 py-4 text-muted-foreground hidden lg:table-cell">{u.orders ?? 0}</td>
                          <td className="px-4 py-4 text-muted-foreground hidden xl:table-cell">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                              u.isBanned
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}>
                              {u.isBanned ? "banned" : "active"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => setLocation(`/admin/users/${u._id}`)}
                              className="text-xs text-violet-400 hover:text-violet-300 hover:underline transition-colors font-medium"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                <span>Page {page} of {totalPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
