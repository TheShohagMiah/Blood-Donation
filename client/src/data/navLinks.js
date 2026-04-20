import React from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  UserPlus,
  ClipboardList,
  HeartHandshake,
  Droplet,
  ListChecks,
  Activity,
} from "lucide-react";

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
    id: "requests",
    name: "Blood Requests",
    icon: Droplet, // ✅ more accurate than HandHeart
    roles: ["admin", "volunteer"],
    subMenu: [
      {
        id: "all-requests",
        name: "All Requests",
        path: "/dashboard/all-requests",
        icon: ListChecks, // ✅ list of tasks/requests
        roles: ["admin", "donor"],
      },
      {
        id: "new-request",
        name: "New Request",
        path: "/dashboard/blood-requests/create",
        icon: UserPlus,
        roles: ["admin", "donor"],
      },
    ],
  },

  {
    id: "donation-requests",
    name: "Donations",
    icon: HeartHandshake, // ✅ better meaning (helping/donation)
    roles: ["admin", "volunteer"],
    subMenu: [
      {
        id: "all-donation-requests",
        name: "All Donations",
        path: "/dashboard/donation-requests",
        icon: Activity, // ✅ activity/logs
        roles: ["admin", "donor"],
      },
    ],
  },

  {
    id: "profile-settings",
    name: "Profile Settings",
    path: "/dashboard/profile",
    icon: Settings,
    roles: ["admin", "donor", "volunteer"],
  },
];
