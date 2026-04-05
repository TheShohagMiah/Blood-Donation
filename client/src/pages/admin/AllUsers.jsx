import React, { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
  Trash2,
  ChevronDown,
  User,
  MoreVertical,
} from "lucide-react";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateRoleMutation,
  useUpdateStatusMutation,
} from "../../redux/features/isAuth/authApi";
import Loader from "../../ui/Loader";
import DeleteUserModal from "../../ui/DeleteModal";

const STATUS_OPTIONS = ["all", "active", "blocked"];

const AllUsers = () => {
  const [deleteUserModalOpen, setDeleteModalOpen] = useState(false);
  const { data, isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const [updateRole] = useUpdateRoleMutation();

  const [allUsers, setAllUsers] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (data?.users) {
      setAllUsers(data.users);
    }
  }, [data]);

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateRole({ id, role: newRole }).unwrap();
      setAllUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)),
      );
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleStatusToggle = async ({ id, status }) => {
    try {
      await updateStatus({ id, status }).unwrap();
      setAllUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status } : u)),
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      setAllUsers((prev) => prev.filter((u) => u._id !== id));
      setActiveMenu(null);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (isLoading) return <Loader />;

  const filteredUsers = allUsers.filter((user) =>
    filter === "all" ? true : user.status === filter,
  );

  return (
    <div className="container-main section-sm max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-12 gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--color-content-primary)]">
            User Management
          </h1>
          <p className="text-[var(--color-content-secondary)] text-base lg:text-lg">
            Monitor activity and manage platform permissions.
          </p>
        </div>

        <div className="flex items-center overflow-x-auto pb-2 lg:pb-0">
          <div className="inline-flex items-center bg-[var(--color-surface-tertiary)] p-1 rounded-xl border border-[var(--color-border-default)] shadow-sm whitespace-nowrap">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 lg:px-6 py-2 text-xs lg:text-sm rounded-lg transition-all duration-200 capitalize font-semibold ${
                  filter === s
                    ? "bg-[var(--color-surface-card)] text-[var(--color-primary-600)] shadow-md border border-[var(--color-border-default)]"
                    : "text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Desktop Table View (Visible on md and up) */}
      <div className="hidden md:block bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border-default)] shadow-xl overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-secondary)]/50 border-b border-[var(--color-border-default)]">
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
                User
              </th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
                Role
              </th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
                Status
              </th>
              <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)]">
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-[var(--color-surface-tertiary)]/30 transition-colors"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar}
                      className="w-10 h-10 rounded-lg object-cover"
                      alt=""
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[var(--color-content-primary)]">
                        {user.name}
                      </span>
                      <span className="text-xs text-[var(--color-content-muted)]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="relative inline-flex items-center">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="appearance-none pl-3 pr-8 py-1.5 text-sm font-semibold rounded-lg bg-[var(--color-surface-tertiary)] border border-transparent cursor-pointer"
                    >
                      <option value="donor">Donor</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2 pointer-events-none opacity-50"
                    />
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="relative inline-flex items-center">
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusToggle({
                          id: user._id,
                          status: e.target.value,
                        })
                      }
                      className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-bold uppercase rounded-full border transition-all cursor-pointer ${
                        user.status === "active"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-2.5 pointer-events-none opacity-60"
                    />
                  </div>
                </td>
                <td className="px-8 py-5 text-right relative">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === user._id ? null : user._id)
                    }
                    className="p-2 rounded-lg hover:bg-[var(--color-surface-tertiary)]"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                  {activeMenu === user._id && (
                    <div className="absolute right-8 top-12 w-48 bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-xl shadow-2xl z-20 py-1">
                      <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"
                      >
                        <Trash2 size={16} /> Remove User
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Visible below md) */}
      <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-[var(--color-surface-card)] rounded-2xl border border-[var(--color-border-default)] p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  className="w-12 h-12 rounded-xl object-cover"
                  alt=""
                />
                <div>
                  <h3 className="font-bold text-[var(--color-content-primary)]">
                    {user.name}
                  </h3>
                  <p className="text-xs text-[var(--color-content-muted)]">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveMenu(user._id);
                  setDeleteModalOpen(true);
                }}
                className="p-2 text-red-500 bg-red-50 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-[var(--color-content-muted)]">
                  Role
                </span>
                <div className="relative flex items-center">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="w-full appearance-none bg-[var(--color-surface-tertiary)] text-xs font-bold py-2 px-3 rounded-lg border border-[var(--color-border-default)]"
                  >
                    <option value="donor">Donor</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2 pointer-events-none opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-[var(--color-content-muted)]">
                  Status
                </span>
                <div className="relative flex items-center">
                  <select
                    value={user.status}
                    onChange={(e) =>
                      handleStatusToggle({
                        id: user._id,
                        status: e.target.value,
                      })
                    }
                    className={`w-full appearance-none text-xs font-bold py-2 px-3 rounded-lg border ${
                      user.status === "active"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2 pointer-events-none opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Responsive Pagination */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[var(--color-border-default)]">
        <p className="text-sm text-[var(--color-content-muted)] font-medium order-2 sm:order-1">
          Showing{" "}
          <span className="text-[var(--color-content-primary)] font-bold">
            {filteredUsers.length}
          </span>{" "}
          members
        </p>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)] text-sm font-bold opacity-50 cursor-not-allowed">
            <ChevronLeft size={18} /> Prev
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)] text-sm font-bold shadow-sm hover:bg-[var(--color-surface-tertiary)] transition-all">
            Next <ChevronRight size={18} />
          </button>
        </div>
      </footer>

      {deleteUserModalOpen && (
        <DeleteUserModal
          isOpen={deleteUserModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          userName={allUsers.find((u) => u._id === activeMenu)?.name}
          onDelete={() => handleDelete(activeMenu)}
        />
      )}
    </div>
  );
};

export default AllUsers;
