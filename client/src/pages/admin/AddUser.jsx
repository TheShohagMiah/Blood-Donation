import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { User as UserIcon, Mail, Lock, Droplet } from "lucide-react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import { districts } from "../../data/districts";
import { upazilas } from "../../data/upazilas";
import Button from "../../ui/Button";
import { useRegistrationMutation } from "../../redux/features/isAuth/authApi";
import { toast } from "react-hot-toast";

const AddUser = () => {
  const [registerUser, { isLoading, isSuccess }] = useRegistrationMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
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

  const selectedDistrictName = watch("district");
  const password = watch("password");

  // Reset upazila when district changes
  useEffect(() => {
    setValue("upazila", "");
  }, [selectedDistrictName, setValue]);

  // Navigate or show success after registration
  useEffect(() => {
    if (isSuccess) {
      toast.success("User added successfully.");
      reset();
    }
  }, [isSuccess, reset]);

  const filteredUpazilas = upazilas
    .filter((u) => {
      const dist = districts.find((d) => d.name === selectedDistrictName);
      return dist ? u.district_id === dist.id : false; // ← bug fix: was `true`
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...submitData } = data;
      await registerUser(submitData).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      <div className="bg-[var(--color-surface-card)] shadow-2xl border border-[var(--color-border-default)] rounded-md p-8 md:p-12">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--color-content-primary)]">
            Add User
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary-600)] mt-2">
            Create new donor or volunteer account
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Identity */}
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

          {/* Medical & Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="bloodGroup"
              control={control}
              rules={{ required: "Select blood group" }}
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
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <Select
                  label="Role"
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

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="district"
              control={control}
              rules={{ required: "Select district" }}
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
              rules={{ required: "Select upazila" }}
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

          {/* Security */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Access Password"
              type="password"
              icon={Lock}
              error={errors.password?.message}
              {...register("password", {
                required: "Required",
                minLength: { value: 8, message: "Min 8 characters" },
              })}
            />
            <Input
              label="Verify Password"
              type="password"
              icon={Lock}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Required",
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
            Add User
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
