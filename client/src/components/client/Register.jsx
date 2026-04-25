import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User as UserIcon,
  Mail,
  Lock,
  Droplet,
  ArrowRight,
  ImagePlus,
} from "lucide-react";

import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import { districts } from "../../data/districts";
import { upazilas } from "../../data/upazilas";
import { useRegistrationMutation } from "../../redux/features/isAuth/authApi";
import { BackgroundGradient } from "../ui/background-gradient";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegistrationMutation();
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      role: "donor",
      bloodGroup: "",
      district: "",
      upazila: "",
    },
  });

  const selectedDistrictName = watch("district");
  const password = watch("password");

  useEffect(() => {
    setValue("upazila", "");
  }, [selectedDistrictName, setValue]);

  // Memoize sorted districts — stable across renders
  const sortedDistricts = useMemo(
    () => [...districts].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const filteredUpazilas = useMemo(() => {
    const dist = districts.find((d) => d.name === selectedDistrictName);
    if (!dist) return [];
    return upazilas
      .filter((u) => u.district_id === dist.id)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedDistrictName]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, avatar: avatarFileList, ...rest } = data;

      const avatarFile = avatarFileList?.[0];
      if (!avatarFile) {
        toast.error("Please upload a profile picture.");
        return;
      }

      const formData = new FormData();
      Object.entries(rest).forEach(([key, value]) =>
        formData.append(key, value),
      );
      formData.append("avatar", avatarFile);

      await registerUser(formData).unwrap();
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex items-center justify-center bg-[var(--color-surface-main)] min-h-screen py-12 px-4">
      <BackgroundGradient className="w-full max-w-2xl bg-[var(--color-surface-primary)] rounded-2xl shadow-2xl border border-[var(--color-border-subtle)] p-6 md:p-10">
        <header className="mb-8 text-center">
          <h2 className="text-4xl font-black tracking-tighter text-[var(--color-content-primary)]">
            Create an Account
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600 mt-3">
            Secure Terminal Onboarding
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-[var(--color-border-subtle)] overflow-hidden flex items-center justify-center bg-[var(--color-surface-main)] cursor-pointer group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlus
                  size={28}
                  className="text-[var(--color-content-muted)] group-hover:text-red-500 transition-colors"
                />
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                {...register("avatar", {
                  required: "Profile picture is required",
                })}
                onChange={(e) => {
                  register("avatar").onChange(e); // keep RHF in sync
                  handleAvatarChange(e);
                }}
              />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-content-muted)]">
              Profile Picture
            </span>
            {errors.avatar && (
              <span className="text-xs text-red-500">
                {errors.avatar.message}
              </span>
            )}
          </div>

          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              icon={UserIcon}
              placeholder="e.g. Alexander Pierce"
              error={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="alex@network.com"
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })}
            />
          </div>

          {/* Blood Group & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="bloodGroup"
              control={control}
              rules={{ required: "Blood group is required" }}
              render={({ field }) => (
                <Select
                  label="Blood Group"
                  icon={Droplet}
                  error={errors.bloodGroup?.message}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="">Select Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ),
                  )}
                </Select>
              )}
            />

            <Controller
              name="role"
              control={control}
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <Select
                  label="System Role"
                  error={errors.role?.message}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="donor">Donor</option>
                  <option value="volunteer">Volunteer</option>
                </Select>
              )}
            />
          </div>

          {/* District & Upazila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="district"
              control={control}
              rules={{ required: "District is required" }}
              render={({ field }) => (
                <Select
                  label="District"
                  error={errors.district?.message}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="">Select District</option>
                  {sortedDistricts.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
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
                  error={errors.upazila?.message}
                  disabled={!selectedDistrictName}
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <option value="">Select Upazila</option>
                  {filteredUpazilas.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                </Select>
              )}
            />
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Password"
              type="password"
              icon={Lock}
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Minimum 8 characters" },
              })}
            />
            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (v) => v === password || "Passwords do not match",
              })}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-5 text-[11px] font-black uppercase tracking-[0.4em]"
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>

        <footer className="mt-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[var(--color-content-primary)] hover:text-red-600 transition-colors inline-flex items-center gap-2 ml-2"
            >
              Sign in <ArrowRight size={12} />
            </Link>
          </p>
        </footer>
      </BackgroundGradient>
    </div>
  );
};

export default RegisterForm;
