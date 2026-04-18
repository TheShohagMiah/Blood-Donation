import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User as UserIcon,
  Mail,
  Lock,
  Droplet,
  ArrowRight,
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
  const [registerUser, { isLoading, isSuccess }] = useRegistrationMutation();

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

  // Reset upazila when district changes
  useEffect(() => {
    setValue("upazila", "");
  }, [selectedDistrictName, setValue]);

  useEffect(() => {
    if (isSuccess) navigate("/login");
  }, [isSuccess, navigate]);

  const filteredUpazilas = upazilas
    .filter((u) => {
      const dist = districts.find((d) => d.name === selectedDistrictName);
      return dist ? u.district_id === dist.id : false;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const onSubmit = async (data) => {
    try {
      await registerUser(data).unwrap();
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
          {/* Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              icon={UserIcon}
              placeholder="e.g. Alexander Pierce"
              error={errors.name?.message}
              {...register("name", {
                required: "Identity verification required",
              })}
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
              rules={{ required: "Medical data required" }}
              render={({ field }) => (
                <Select
                  label="Blood Group"
                  icon={Droplet}
                  error={errors.bloodGroup?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
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
              rules={{ required: "Role designation required" }}
              render={({ field }) => (
                <Select
                  label="System Role"
                  error={errors.role?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
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
              rules={{ required: "Geographic data required" }}
              render={({ field }) => (
                <Select
                  label="District"
                  error={errors.district?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                >
                  <option value="">Select District</option>
                  {[...districts]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((d) => (
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
              rules={{ required: "Sub-district required" }}
              render={({ field }) => (
                <Select
                  label="Upazila"
                  error={errors.upazila?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  disabled={!selectedDistrictName}
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
              label="Access Password"
              type="password"
              icon={Lock}
              error={errors.password?.message}
              {...register("password", {
                required: "Required",
                minLength: { value: 8, message: "Min 8 chars" },
              })}
            />
            <Input
              label="Verify Password"
              type="password"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Required",
                validate: (v) => v === password || "Sequence mismatch",
              })}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-5 text-[11px] font-black uppercase tracking-[0.4em]"
            isLoading={isLoading}
          >
            Finalize Enlistment
          </Button>
        </form>

        <footer className="mt-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-content-muted)]">
            Already Enlisted?{" "}
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
