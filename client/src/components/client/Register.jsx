import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  User as UserIcon,
  Mail,
  Lock,
  Droplet,
  ArrowRight,
} from "lucide-react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import { districts } from "../../data/districts";
import { upazilas } from "../../data/upazilas";
import Button from "../../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useRegistrationMutation } from "../../redux/features/isAuth/authApi";
import { BackgroundGradient } from "../ui/background-gradient";
import toast from "react-hot-toast";
// Recommended for professional feedback

const RegisterForm = () => {
  const navigate = useNavigate();
  // ⚡️ Fix 1: RTK Mutation Hook returns [trigger, result]
  const [registerUser, { isLoading, isSuccess }] = useRegistrationMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      role: "donor",
      bloodGroup: "",
      district: "",
      upazila: "",
    },
  });

  // ⚡️ Fix 2: Dynamic Filtering Logic
  const selectedDistrictName = watch("district");
  const password = watch("password");

  const filteredUpazilas = upazilas
    .filter((u) => {
      const dist = districts.find((d) => d.name === selectedDistrictName);
      return dist ? u.district_id === dist.id : true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const onSubmit = async (data) => {
    try {
      // Remove confirmPassword before sending to server
      const { confirmPassword, ...submitData } = data;
      await registerUser(submitData).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Terminal Error: Registration Failed");
    }
  };

  return (
    <div className=" flex items-center justify-center bg-surface-main min-h-screen">
      <BackgroundGradient className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-surface-primary rounded-xl shadow-[var(--shadow-xl)] border-border-strong p-5 md:p-6">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-black capitalize tracking-tighter text-[var(--color-content-primary)]">
            Create an Account
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary-600)] mt-2">
            Secure Terminal Onboarding
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Identity Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              icon={UserIcon}
              placeholder="John Doe"
              error={errors.name?.message}
              {...register("name", { required: "Name is required" })}
            />
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="john@flow.com"
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })}
            />
          </div>

          {/* Medical & Role Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Blood Group"
              icon={Droplet}
              error={errors.bloodGroup?.message}
              {...register("bloodGroup", { required: "Select blood group" })}
            >
              <option value="">Select Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>

            <Select
              label="System Role"
              error={errors.role?.message}
              {...register("role", { required: "Role is required" })}
            >
              <option value="donor">Donor</option>
              <option value="volunteer">Volunteer</option>
            </Select>
          </div>

          {/* Location Group - Dynamic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="District"
              error={errors.district?.message}
              {...register("district", { required: "Select district" })}
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

            <Select
              label="Upazila"
              disabled={!selectedDistrictName}
              error={errors.upazila?.message}
              {...register("upazila", { required: "Select upazila" })}
            >
              <option value="">Select Upazila</option>
              {filteredUpazilas.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Security Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Access Password"
              type="password"
              icon={Lock}
              error={errors.password?.message}
              {...register("password", { required: "Required", minLength: 8 })}
            />
            <Input
              label="Verify Password"
              type="password"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                validate: (v) => v === password || "Match failed",
              })}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-red-500/10"
            isLoading={isLoading}
          >
            Register
          </Button>
        </form>

        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[var(--color-content-muted)] mt-8">
          Already Enlisted?{" "}
          <Link
            to="/login"
            className="text-[var(--color-content-primary)] hover:text-[var(--color-primary-600)] transition-colors inline-flex items-center gap-2"
          >
            Sign in <ArrowRight size={12} />
          </Link>
        </p>
      </BackgroundGradient>
    </div>
  );
};

export default RegisterForm;
