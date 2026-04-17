import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Edit3Icon, ChevronDown, Save } from "lucide-react";
import { useUpdatePasswordMutation } from "../../redux/features/isAuth/authApi";
import { logout } from "../../redux/slices/authSlice";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

const UpdatePassword = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const togglePasswordForm = () => {
    setShowPasswordForm((prev) => !prev);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updatePassword] = useUpdatePasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleReset = () => {
    reset();
  };

  const onSubmitPassword = async (data) => {
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      dispatch(logout());
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[var(--color-content-primary)] flex items-center gap-2">
          <Edit3Icon size={20} /> Update Password
        </h2>

        <ChevronDown
          size={24}
          className={`cursor-pointer bg-primary-600 text-white rounded-full p-1 transition-transform duration-300 ${
            showPasswordForm ? "rotate-180" : "rotate-0"
          }`}
          onClick={togglePasswordForm}
        />
      </div>

      {showPasswordForm && (
        <form className="space-y-4" onSubmit={handleSubmit(onSubmitPassword)}>
          <Input
            label="Current Password"
            type="password"
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            error={errors.currentPassword?.message}
          />

          <Input
            label="New Password"
            type="password"
            {...register("newPassword", {
              required: "New password is required",
              minLength: { value: 6, message: "Minimum 6 characters required" },
            })}
            error={errors.newPassword?.message}
          />

          <Input
            label="Confirm New Password"
            type="password"
            {...register("confirmNewPassword", {
              required: "Please confirm your new password",
              validate: (value) =>
                value === watch("newPassword") || "Passwords do not match",
            })}
            error={errors.confirmNewPassword?.message}
          />

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save size={16} /> Change Password
            </Button>

            <Button onClick={handleReset} type="button" variant="secondary">
              Reset
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdatePassword;
