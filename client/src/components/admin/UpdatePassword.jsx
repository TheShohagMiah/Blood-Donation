import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUpdatePasswordMutation } from "../../redux/features/isAuth/authApi";
import { useForm } from "react-hook-form";
import { Edit3Icon, Save } from "lucide-react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updatePassword] = useUpdatePasswordMutation();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleReset = () => {
    reset({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  // Functionality: Password Update
  const onSubmitPassword = async (data) => {
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Password changed. Please login again.");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update password.");
    }
  };

  return (
    <div className="bg-[var(--color-surface-card)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-8">
      <h2 className="text-xl font-bold text-[var(--color-content-primary)] mb-6 flex items-center gap-2">
        <Edit3Icon size={20} /> Update Password
      </h2>
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
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="mt-2 flex items-center gap-2"
          >
            <Save size={16} /> Change Password
          </Button>
          <Button
            onClick={handleReset}
            type="button"
            variant="secondary"
            className="mt-2"
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePassword;
