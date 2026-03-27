import React from "react";
import StatsCard from "../../ui/StatsCard";
import { CircleDollarSign, Users, ClipboardList } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome, Shohag Miah
        </h1>
        <p className="text-content-muted mt-2">
          Overview of platform metrics and activity.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatsCard label="Total Users" value="1,240" icon={Users} />
        <StatsCard label="Donation Requests" value="84" icon={ClipboardList} />
        <StatsCard
          label="Total Funding"
          value="$12,450"
          icon={CircleDollarSign}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
