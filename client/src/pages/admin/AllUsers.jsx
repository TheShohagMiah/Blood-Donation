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

const ROLE_STYLES = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  volunteer: "bg-blue-100 text-blue-700 border-blue-200",
  donor: "bg-emerald-100 text-emerald-700 border-emerald-200",
};
const STATUS_STYLES = {
  active: "text-emerald-600",
  blocked: "text-red-600",
};
const AllUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeMenu, setActiveMenu] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, error } = useGetAllUsersQuery();
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
    const users = data?.users || [];
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

      {/* ✅ Removed overflow-hidden from outer — it was clipping the dropdown */}
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-2xl)] shadow-sm">
        <div className="overflow-x-auto rounded-[var(--radius-2xl)]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--color-surface-muted)]/30 border-b border-[var(--color-border-default)]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                  Member Identity
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                  Authorization
                </th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                  Current Status
                </th>
                <th className="px-8 py-5 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-default)]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <UserRow
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

const UserRow = React.memo(
  ({
    user,
    isOpen,
    onToggle,
    onUpdateRole,
    onUpdateStatus,
    onDeleteRequest,
  }) => (
    <tr
      className={`group transition-colors ${
        isOpen
          ? "bg-[var(--color-surface-tertiary)]/30"
          : "hover:bg-[var(--color-surface-tertiary)]/10"
      }`}
    >
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              className="w-10 h-10 rounded-xl object-cover border border-[var(--color-border-default)]"
              alt=""
            />
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-[var(--color-surface-card)] rounded-full ${
                user.status === "active" ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[var(--color-content-primary)] tracking-tight">
              {user.name}
            </span>
            <span className="text-[12px] text-[var(--color-content-muted)]   opacity-70">
              {user.email}
            </span>
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <span
          className={`inline-flex text-[9px] font-black uppercase px-2.5 py-1 rounded-lg tracking-[0.15em] border ${
            ROLE_STYLES[user.role] ||
            "bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-8 py-5">
        <span
          className={`text-[9px] font-black uppercase tracking-widest ${STATUS_STYLES[user.status] || "text-gray-500"}`}
        >
          {user.status}
        </span>
      </td>
      <td className="px-8 py-5 text-right">
        <div className="relative inline-block">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-tertiary)] transition-all"
          >
            <MoreHorizontal
              size={20}
              className="text-[var(--color-content-muted)]"
            />
          </button>

          {isOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-1 w-52 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200"
            >
              <DropdownItem
                onClick={() =>
                  onUpdateRole({
                    id: user._id,
                    role: user.role === "donor" ? "volunteer" : "donor",
                  })
                }
                icon={
                  user.role === "donor" ? (
                    <UserCog size={14} />
                  ) : (
                    <ShieldCheck size={14} />
                  )
                }
              >
                MAKE {user.role === "donor" ? "VOLUNTEER" : "DONOR"}
              </DropdownItem>
              {user.role !== "admin" && (
                <DropdownItem
                  onClick={() => onUpdateRole({ id: user._id, role: "admin" })}
                  icon={<ShieldCheck size={14} />}
                >
                  MAKE ADMIN
                </DropdownItem>
              )}
              <div className="my-1 border-t border-[var(--color-border-default)]" />
              <DropdownItem
                onClick={() =>
                  onUpdateStatus({
                    id: user._id,
                    status: user.status === "active" ? "blocked" : "active",
                  })
                }
                icon={
                  user.status === "active" ? (
                    <Ban size={14} />
                  ) : (
                    <Unlock size={14} />
                  )
                }
                className={
                  user.status === "active"
                    ? "text-amber-600"
                    : "text-emerald-600"
                }
              >
                {user.status === "active" ? "BLOCK USER" : "UNBLOCK USER"}
              </DropdownItem>
              <DropdownItem
                onClick={onDeleteRequest}
                icon={<Trash2 size={14} />}
                className="text-red-600 hover:bg-red-50"
              >
                DELETE USER
              </DropdownItem>
            </div>
          )}
        </div>
      </td>
    </tr>
  ),
);

const DropdownItem = ({ children, icon, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-2.5 text-left text-[9px] font-black uppercase tracking-widest hover:bg-[var(--color-surface-muted)] flex items-center gap-3 transition-colors ${className}`}
  >
    {icon} {children}
  </button>
);

export default AllUsers;
