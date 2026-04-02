import React from "react";
import {
  User,
  Mail,
  MapPin,
  Droplet,
  Calendar,
  ShieldCheck,
  Edit3,
  History,
} from "lucide-react";
import Button from "../../ui/Button";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  // Mock User Data - Replace with your Auth Context data

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* 1. Header Profile Card */}
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-2xl)] p-8 relative overflow-hidden">
        {/* Decorative Blood Group Watermark */}
        <div className="absolute -right-6 -top-6 text-[120px] font-black text-[var(--color-primary-600)] opacity-5 select-none">
          {user.bloodGroup}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-[var(--color-surface-muted)] border-2 border-[var(--color-border-default)] flex items-center justify-center">
              <User size={64} className="text-[var(--color-content-muted)]" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-[var(--color-primary-600)] text-white rounded-lg shadow-lg hover:scale-110 transition-transform">
              <Edit3 size={16} />
            </button>
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl font-bold text-[var(--color-content-primary)]">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 rounded border border-green-100 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={12} /> {user.status}
                </span>
              </div>
              <p className="text-[var(--color-content-muted)] font-medium">
                {user.role}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-[var(--color-content-muted)]">
                <Mail size={16} className="text-[var(--color-primary-600)]" />{" "}
                {user.email}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-[var(--color-content-muted)]">
                <MapPin size={16} className="text-[var(--color-primary-600)]" />{" "}
                {user.area}, {user.district}
              </div>
            </div>
          </div>

          {/* Blood Group Highlight */}
          <div className="bg-[var(--color-primary-600)] text-white px-8 py-4 rounded-2xl text-center shadow-lg shadow-[var(--color-primary-subtle)]">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
              Blood Group
            </span>
            <span className="text-4xl font-black">{user.bloodGroup}</span>
          </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] p-6 rounded-[var(--radius-xl)] space-y-2">
          <div className="flex items-center gap-3 text-[var(--color-primary-600)] mb-2">
            <History size={20} />
            <h3 className="text-[11px] font-bold uppercase tracking-widest">
              Total Donations
            </h3>
          </div>
          <p className="text-4xl font-bold text-[var(--color-content-primary)]">
            {user.totalDonations}
          </p>
        </div>

        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] p-6 rounded-[var(--radius-xl)] space-y-2">
          <div className="flex items-center gap-3 text-[var(--color-primary-600)] mb-2">
            <Calendar size={20} />
            <h3 className="text-[11px] font-bold uppercase tracking-widest">
              Last Donation
            </h3>
          </div>
          <p className="text-2xl font-bold text-[var(--color-content-primary)]">
            {user.lastDonation}
          </p>
        </div>

        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] p-6 rounded-[var(--radius-xl)] space-y-2">
          <div className="flex items-center gap-3 text-[var(--color-primary-600)] mb-2">
            <Droplet size={20} />
            <h3 className="text-[11px] font-bold uppercase tracking-widest">
              Next Eligible
            </h3>
          </div>
          <p className="text-2xl font-bold text-green-600 italic">
            Ready to Donate
          </p>
        </div>
      </div>

      {/* 3. Action Tabs Placeholder */}
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-xl)] overflow-hidden">
        <div className="flex border-b border-[var(--color-border-default)]">
          <button className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest border-b-2 border-[var(--color-primary-600)] text-[var(--color-primary-600)] bg-[var(--color-primary-50)]/30">
            Donation History
          </button>
          <button className="px-8 py-4 text-[11px] font-bold uppercase tracking-widest text-[var(--color-content-muted)] hover:text-[var(--color-content-primary)] transition-colors">
            Account Settings
          </button>
        </div>
        <div className="p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-[var(--color-surface-muted)] rounded-full flex items-center justify-center mx-auto">
            <History size={24} className="text-[var(--color-content-muted)]" />
          </div>
          <p className="text-sm text-[var(--color-content-muted)]">
            No recent activity to display.
          </p>
          <Button variant="secondary" className="h-9">
            Update Records
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
