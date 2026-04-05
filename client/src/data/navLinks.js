import {
  LayoutDashboard,
  Users,
  HandHeart,
  Settings,
  ShieldCheck,
  UserPlus,
  ClipboardList,
} from "lucide-react";

export const navLinks = [
  {
    name: "Overview",
    path: "/dashboard", // Matches the 'index' route in App.jsx
    icon: LayoutDashboard,
    roles: ["admin", "donor", "volunteer"],
  },

  {
    name: "User Management",
    icon: Users,
    roles: ["admin", "donor"],
    subMenu: [
      {
        name: "All Users",
        path: "/dashboard/users",
        icon: Users,
      },
      {
        name: "Add User",
        path: "/dashboard/users/add",
        icon: UserPlus,
      },
    ],
  },

  {
    name: "Donations",
    icon: HandHeart,
    roles: ["admin", "donor"],
    subMenu: [
      {
        name: "All Requests",
        path: "/dashboard/donation-requests",
        icon: ClipboardList,
      },
      {
        name: "New Request",
        path: "/dashboard/donation-requests/new",
        icon: UserPlus,
        roles: ["donor"], // Example of nested role restriction
      },
    ],
  },

  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
    roles: ["admin", "donor", "volunteer"],
  },
];
