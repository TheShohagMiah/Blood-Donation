import React, { useState, useEffect } from "react";
import {
  User,
  ShieldCheck,
  Edit3,
  History,
  Save,
  X,
  Camera,
  MapPin,
  Calendar,
} from "lucide-react";
import Button from "../../ui/Button";
import { useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../../redux/features/isAuth/authApi";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [updateProfile] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    district: "",
    upazila: "",
    bloodGroup: "",
    avatar: "",
  });

  // Synchronize local state with Redux user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        district: user.district || "",
        upazila: user.upazila || "",
        bloodGroup: user.bloodGroup || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      district: user?.district || "",
      upazila: user?.upazila || "",
      bloodGroup: user?.bloodGroup || "",
      avatar: user?.avatar || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Profile Card */}
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-2xl)] p-8 relative overflow-hidden">
        {/* Decorative Blood Group Background */}
        <div className="absolute -right-6 -top-6 text-[120px] font-black text-[var(--color-primary-600)] opacity-5 select-none pointer-events-none">
          {formData.bloodGroup}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-[var(--color-surface-muted)] border-2 border-[var(--color-border-default)] overflow-hidden flex items-center justify-center">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={64} className="text-[var(--color-content-muted)]" />
              )}
            </div>

            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={24} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl font-black text-[var(--color-content-primary)] tracking-tight">
                    {formData.name || "Anonymous User"}
                  </h1>
                  <span className="px-2 py-0.5 rounded border border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={12} /> {user?.status}
                  </span>
                </div>
                <p className="text-[var(--color-content-muted)] text-sm font-bold uppercase tracking-widest mt-1">
                  {user?.role}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="primary"
                    className="flex items-center gap-2 px-6"
                  >
                    <Edit3 size={16} /> Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleCancel}
                      variant="ghost"
                      className="text-red-500 font-bold uppercase text-[11px] tracking-widest"
                    >
                      <X size={16} /> Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      variant="primary"
                      className="flex items-center gap-2 px-6"
                    >
                      <Save size={16} /> Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-[var(--color-border-default)]">
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "District", name: "district", type: "text" },
                { label: "Upazila", name: "upazila", type: "text" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] focus:bg-[var(--color-surface-card)] focus:ring-2 focus:ring-[var(--color-primary-500)]/20 transition-all disabled:opacity-60"
                  />
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted)] focus:bg-[var(--color-surface-card)] transition-all disabled:opacity-60 appearance-none"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          icon={<History size={20} />}
          label="Total Donations"
          value={user?.totalDonations || 0}
        />
        <StatCard
          icon={<MapPin size={20} />}
          label="Lives Saved"
          value={(user?.totalDonations || 0) * 3}
        />
        <StatCard
          icon={<Calendar size={20} />}
          label="Last Donation"
          value={user?.lastDonationDate || "No data"}
        />
      </div>
    </div>
  );
};

// Reusable Stat Card to keep clean typography
const StatCard = ({ icon, label, value }) => (
  <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] p-6 rounded-[var(--radius-xl)] hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-3 text-[var(--color-primary-600)] mb-3">
      {icon}
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">
        {label}
      </h3>
    </div>
    <p className="text-4xl font-black text-[var(--color-content-primary)] tracking-tighter">
      {value}
    </p>
  </div>
);

export default Profile;
