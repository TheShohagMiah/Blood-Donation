import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  MoreHorizontal,
  Trash2,
  ShieldCheck,
  UserCog,
  Ban,
  Unlock,
  Users as UsersIcon,
  Search,
} from "lucide-react";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateRoleMutation,
  useUpdateStatusMutation,
} from "../../redux/features/isAuth/authApi";
import Loader from "../../ui/Loader";
import DeleteUserModal from "../../ui/DeleteModal";
import { toast } from "react-hot-toast";
import AllUsersTableRow from "../../ui/AllUsersTableRow";
import Pagination from "../../ui/Pagination";
import { useDebounce } from "../../hooks/useDebounce";

const AllUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [filter, setFilter] = useState("all");
  const [activeMenu, setActiveMenu] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const { data, isLoading, error } = useGetAllUsersQuery({
    page,
    limit,
    search: debouncedSearch,
    status: filter,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const [updateRole] = useUpdateRoleMutation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu !== null) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenu]);

  const filteredUsers = useMemo(() => {
    const users = data?.data || [];
    return users.filter((user) => {
      const matchesFilter = filter === "all" || user.status === filter;
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [data, filter, searchQuery]);

  const handleToggleMenu = useCallback((id) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  }, []);

  const handleUpdateRole = useCallback(
    async ({ id, role }) => {
      setActiveMenu(null);
      try {
        await updateRole({ id, role }).unwrap();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to update role.");
      }
    },
    [updateRole],
  );

  const handleUpdateStatus = useCallback(
    async ({ id, status }) => {
      setActiveMenu(null);
      try {
        await updateStatus({ id, status }).unwrap();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to update status.");
      }
    },
    [updateStatus],
  );

  const handleDeleteUser = useCallback(
    async (id) => {
      setActiveMenu(null);
      try {
        await deleteUser(id).unwrap();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete user.");
      }
    },
    [deleteUser],
  );
  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filter]);

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="text-red-500 p-8 text-center font-bold uppercase tracking-widest text-sm">
        {error?.data?.message || error?.status || "Something went wrong."}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-[var(--color-primary-600)]">
            <UsersIcon size={28} strokeWidth={2.5} />
            <h1 className="text-3xl font-black tracking-tight text-[var(--color-content-primary)] uppercase">
              Member Directory
            </h1>
          </div>
          <p className="text-[var(--color-content-muted)] text-[11px] font-black uppercase tracking-widest">
            Total Authorized Personnel: {data?.users?.length || 0}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-content-muted)]"
              size={16}
            />
            <input
              type="text"
              placeholder="SEARCH BY NAME OR EMAIL..."
              className="w-full bg-[var(--color-surface-muted)]/50 border border-[var(--color-border-default)] rounded-xl py-2.5 pl-11 pr-4 text-[10px] font-black tracking-widest focus:ring-1 focus:ring-[var(--color-primary-500)] transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex bg-[var(--color-surface-tertiary)] p-1 rounded-xl border border-[var(--color-border-default)]">
            {["all", "active", "blocked"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${
                  filter === s
                    ? "bg-[var(--color-surface-card)] text-[var(--color-primary-600)] shadow-sm"
                    : "text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] shadow-sm">
        <div className="overflow-x-auto rounded-[var(--radius-2xl)]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--color-surface-muted)]/30 border-b border-[var(--color-border-default)]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                  Member Identity
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                  Blood Group
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                  Authorization
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                  Current Status
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-default)]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <AllUsersTableRow
                    key={user._id}
                    user={user}
                    isOpen={activeMenu === user._id}
                    onToggle={() => handleToggleMenu(user._id)}
                    onUpdateRole={handleUpdateRole}
                    onUpdateStatus={handleUpdateStatus}
                    onDeleteRequest={() => setDeleteTarget(user)}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]"
                  >
                    No records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagniation */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {deleteTarget && (
        <DeleteUserModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          userName={deleteTarget.name}
          onDelete={() => {
            handleDeleteUser(deleteTarget._id);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
};

export default AllUsers;
