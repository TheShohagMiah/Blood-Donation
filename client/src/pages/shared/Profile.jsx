import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { Controller, useForm } from "react-hook-form";
import Button from "../../ui/Button";
import { useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../../redux/features/isAuth/authApi";
import { toast } from "react-hot-toast";
import StatsCard from "../../components/admin/StatsCard";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import { districts } from "../../data/districts";
import { upazilas } from "../../data/upazilas";
import UpdatePassword from "../../components/admin/UpdatePassword";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [updateProfile] = useUpdateProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: {
      name: "",
      district: "",
      upazila: "",
      bloodGroup: "",
      email: "",
      avatar: "",
    },
  });

  const avatar = watch("avatar");
  const bloodGroup = watch("bloodGroup");
  const selectedDistrict = watch("district");

  const filteredUpazilas = useMemo(() => {
    if (!selectedDistrict) return [];
    const districtObj = districts.find((d) => d.name === selectedDistrict);
    if (!districtObj) return [];
    return upazilas.filter((u) => u.district_id === districtObj.id);
  }, [selectedDistrict]);

  // Sync Redux user into form on load
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        district: user.district || "",
        upazila: user.upazila || "",
        bloodGroup: user.bloodGroup || "",
        avatar: user.avatar || "",
      });
    }
  }, [user, reset]);

  // Reset upazila when district changes — skip on initial load
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setValue("upazila", "");
  }, [selectedDistrict, setValue]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setValue("avatar", reader.result, { shouldDirty: true });
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    try {
      await updateProfile({
        name: data.name,
        district: data.district,
        upazila: data.upazila,
        bloodGroup: data.bloodGroup,
        avatar: data.avatar,
        email: data.email,
      }).unwrap();
      toast.success("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-8 relative overflow-hidden">
        {/* Blood group watermark */}
        <div className="absolute -right-6 -top-6 text-[120px] font-black text-[var(--color-primary-600)] opacity-5 select-none pointer-events-none">
          {bloodGroup}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-[var(--color-surface-muted)] border-2 border-[var(--color-border-default)] overflow-hidden flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar}
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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <h1 className="text-3xl font-black text-[var(--color-content-primary)] tracking-tight">
                    {watch("name") || "Anonymous User"}
                  </h1>
                  <span className="px-2 py-0.5 rounded border border-emerald-100 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={12} /> {user?.status}
                  </span>
                </div>
                <p className="text-[var(--color-content-muted)] text-sm font-bold uppercase tracking-widest mt-1">
                  {user?.role}
                </p>
              </div>

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
                      onClick={handleSubmit(onSubmit)}
                      variant="primary"
                      disabled={!isDirty || isSubmitting}
                      className="flex items-center gap-2 px-6 disabled:opacity-50"
                    >
                      <Save size={16} />{" "}
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-[var(--color-border-default)]"
            >
              <Input
                label="Full Name"
                {...register("name", { required: "Name is required" })}
                disabled={!isEditing}
                error={errors?.name?.message}
              />
              <Input
                label="Email"
                type="email"
                readOnly
                {...register("email")}
                disabled={!isEditing}
              />

              <Controller
                name="bloodGroup"
                control={control}
                rules={{ required: "Blood group is required" }}
                render={({ field }) => (
                  <Select
                    label="Blood Group"
                    error={errors?.bloodGroup?.message}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    disabled={!isEditing}
                  >
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name="district"
                control={control}
                rules={{ required: "District is required" }}
                render={({ field }) => (
                  <Select
                    label="District"
                    error={errors?.district?.message}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    disabled={!isEditing}
                  >
                    <option value="">Select District</option>
                    {districts.map((dist) => (
                      <option key={dist.id || dist.name} value={dist.name}>
                        {dist.name}
                      </option>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name="upazila"
                control={control}
                rules={{ required: "Upazila is required" }}
                render={({ field }) => (
                  <Select
                    label="Upazila"
                    error={errors?.upazila?.message}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    disabled={!isEditing || !selectedDistrict}
                  >
                    <option value="">Select Upazila</option>
                    {filteredUpazilas.map((upazila) => (
                      <option
                        key={upazila.id || upazila.name}
                        value={upazila.name}
                      >
                        {upazila.name}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </form>
          </div>
        </div>
      </div>

      <UpdatePassword />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          icon={<History size={20} />}
          label="Total Donations"
          value={user?.totalDonations || 0}
        />
        <StatsCard
          icon={<MapPin size={20} />}
          label="Lives Saved"
          value={(user?.totalDonations || 0) * 3}
        />
        <StatsCard
          icon={<Calendar size={20} />}
          label="Last Donation"
          value={user?.lastDonationDate?.split("T")[0] || "No data"}
        />
      </div>
    </div>
  );
};

export default Profile;
