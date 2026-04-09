import React from "react";
import {
  LayoutDashboard,
  Users,
  HandHeart,
  Settings,
  ShieldCheck,
  UserPlus,
  ClipboardList,
} from "lucide-react";

/**
 * Navigation configuration for the dashboard.
 * Supports role-based access control and nested sub-menus.
 */
export const navLinks = [
  {
    id: "overview",
    name: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "donor", "volunteer"],
  },
  {
    id: "user-management",
    name: "User Management",
    icon: Users,
    roles: ["admin"],
    subMenu: [
      {
        id: "all-users",
        name: "All Users",
        path: "/dashboard/users",
        icon: Users,
        roles: ["admin"],
      },
      {
        id: "add-user",
        name: "Add User",
        path: "/dashboard/users/add",
        icon: UserPlus,
        roles: ["admin"],
      },
    ],
  },
  {
    id: "donations",
    name: "Donations",
    icon: HandHeart,
    roles: ["admin", "donor"],
    subMenu: [
      {
        id: "all-requests",
        name: "All Requests",
        path: "/dashboard/donation-requests",
        icon: ClipboardList,
        roles: ["admin", "donor"],
      },
      {
        id: "new-request",
        name: "New Request",
        path: "/dashboard/donation-requests/new",
        icon: UserPlus,
        roles: ["admin", "donor"],
      },
    ],
  },
  {
    id: "settings",
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
    roles: ["admin", "donor", "volunteer"],
  },
];
