import {
  LayoutDashboard,
  Users,
  HandHeart,
  Settings,
  FileText,
  BarChart3,
  ShieldCheck,
  Bell,
} from "lucide-react";

export const navLinks = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "donor", "volunteer"],
  },

  {
    name: "Users",
    icon: Users,
    roles: ["admin"],
    subMenu: [
      { name: "All Users", path: "/admin/dashboard/users" },
      { name: "Add User", path: "/admin/dashboard/users/new" },
    ],
  },

  {
    name: "Donations",
    icon: HandHeart,
    roles: ["admin", "donor"],
    subMenu: [
      {
        name: "All Requests",
        path: "/admin/dashboard/donation-requests",
        roles: ["admin", "donor"],
      },
    ],
  },

  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    roles: ["admin", "donor", "volunteer"],
  },
];
