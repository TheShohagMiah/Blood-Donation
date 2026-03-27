import React from "react";
import { useForm } from "react-hook-form";
import {
  User as UserIcon,
  Mail,
  Lock,
  Droplet,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import { districts } from "../../data/districts";
import { upazilas } from "../../data/upazilas";
import Button from "../../ui/Button";
import { Link } from "react-router-dom";
const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      role: "donor",
      bloodGroup: "",
    },
  });

  const onSubmit = async (data) => {
    console.log("Registering User:", data);
  };

  const password = watch("password");

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
      <div className="card shadow-[var(--shadow-xl)] border-[var(--color-border-strong)] p-8 md:p-10">
        <header className="mb-15 text-center ">
          <h2 className="text-3xl font-bold text-[var(--color-content-primary)]">
            Create Account
          </h2>
          <p className="text-sm font-light text-[var(--color-content-muted)] mt-2">
            Join our network to help save lives through blood donation.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Section: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <Input
              label="Full Name"
              icon={UserIcon}
              placeholder="John Doe"
              error={errors.name?.message}
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
            />

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>

          {/* Section: Blood & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <Select
              label="Blood Group"
              icon={Droplet}
              error={errors.bloodGroup?.message}
              {...register("bloodGroup", {
                required: "Blood group is required",
              })}
            >
              <option value="">Select Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ),
              )}
            </Select>

            <Select
              label="Role"
              error={errors.role?.message}
              {...register("role", {
                required: "User role is required",
              })}
            >
              <option value="">Select Group</option>
              {["donor", "volunteer"].map((role) => (
                <option className="capitalize" key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </div>

          {/* Section: Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <Select
              label="Select District"
              error={errors.district?.message}
              {...register("district", {
                required: "District is required",
              })}
            >
              <option value="">Select District</option>
              {districts
                .concat()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
            </Select>
            <Select
              label="Select Upazila"
              error={errors.upazila?.message}
              {...register("upazila", {
                required: "Upazila group is required",
              })}
            >
              <option value="">Select Upazila</option>
              {upazilas
                .concat()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((upazila) => (
                  <option key={upazila.id} value={upazila.name}>
                    {upazila.name}
                  </option>
                ))}
            </Select>
          </div>

          {/* Section: Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <Input
              label="Password"
              type="password"
              icon={Lock}
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Min 8 characters" },
              })}
            />

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full"
            >
              Register Now
            </Button>
          </div>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-[var(--color-content-muted)] mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[var(--color-content-primary)] hover:underline inline-flex items-center gap-1 group"
          >
            Log in
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
