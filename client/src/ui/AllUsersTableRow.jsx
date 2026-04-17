import {
  Ban,
  Droplets,
  MoreHorizontal,
  ShieldCheck,
  Trash2,
  Unlock,
  UserCog,
} from "lucide-react";
import React from "react";

const ROLE_STYLES = {
  admin: "bg-purple-100 text-purple-700 border-purple-200",
  volunteer: "bg-blue-100 text-blue-700 border-blue-200",
  donor: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const STATUS_STYLES = {
  active: "text-emerald-600",
  blocked: "text-red-600",
};

const DropdownItem = ({ children, icon, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-2.5 text-left text-[9px] font-black uppercase tracking-widest hover:bg-[var(--color-surface-muted)] flex items-center gap-3 transition-colors ${className}`}
  >
    {icon} {children}
  </button>
);

const AllUsersTableRow = React.memo(
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
        <span className="px-4 py-2 w-fit rounded-xl bg-red-100 text-red-700 font-bold text-sm flex items-center gap-2">
          <Droplets size={16} /> {user.bloodGroup}
        </span>
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

export default AllUsersTableRow;
