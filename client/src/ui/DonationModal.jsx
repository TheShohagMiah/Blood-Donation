import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Clock,
  MessageSquare,
  CheckCircle2,
  Mail,
  User2,
} from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { useCreateDonationMutation } from "../redux/features/donation/donationApi";
import { toast } from "react-hot-toast";

const DonationModal = ({
  isOpen,
  onClose,
  selectedRequest,
  showName,
  showEmail,
}) => {
  const [createDonation, { isSuccess, error }] = useCreateDonationMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      message: "",
      status: "interested",
      estimatedArrivalTime: "",
      name: "",
      email: "",
    },
  });

  const handleDonationSubmit = async (data) => {
    try {
      await createDonation({
        ...data,
        requestId: selectedRequest?._id,
      }).unwrap();
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to commit donation. Please try again.",
      );
    }
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      onClose();
    }
  }, [isSuccess, reset, onClose]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-surface-overlay)] backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit(handleDonationSubmit)}
        className="relative w-full max-w-lg bg-[var(--color-surface-card)] rounded-[var(--radius-2xl)] border border-[var(--color-border-strong)] shadow-[var(--shadow-2xl)] overflow-hidden animate-in zoom-in-95 duration-300"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-[var(--color-border-default)] flex items-center justify-between bg-[var(--color-surface-secondary)]">
          <div>
            <h3 className="font-bold text-xl tracking-tight text-[var(--color-content-primary)] uppercase">
              Commit Donation
            </h3>
            <p className="text-[10px] font-black text-[var(--color-content-muted)] uppercase tracking-[0.2em] mt-1">
              Recipient: {selectedRequest?.recipientName || "Emergency Case"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-surface-tertiary)] rounded-full transition-colors text-[var(--color-content-muted)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          {/* ✅ FIXED optional fields */}
          {(showName || showEmail) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {showName && (
                <Input
                  label="Name"
                  icon={User2}
                  placeholder="Your name"
                  value={showName}
                  readOnly={true}
                  {...register("name")}
                  error={errors.name?.message}
                />
              )}
              {showEmail && (
                <Input
                  label="Email"
                  icon={Mail}
                  value={showEmail}
                  readOnly={true}
                  placeholder="Your email"
                  {...register("email")}
                  error={errors.email?.message}
                />
              )}
            </div>
          )}

          {/* Status & Arrival */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Your Status"
              {...register("status", { required: "Required" })}
              error={errors.status?.message}
            >
              <option value="interested">Interested</option>
              <option value="on-the-way">On the way</option>
              <option value="at-hospital">Already at Hospital</option>
            </Select>

            <Input
              label="Arrival Time"
              icon={Clock}
              placeholder="e.g. 45 mins"
              {...register("estimatedArrivalTime", { required: "Required" })}
              error={errors.estimatedArrivalTime?.message}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-content-muted)] flex items-center gap-2">
              <MessageSquare
                size={12}
                className="text-[var(--color-primary-500)]"
              />
              Message to Recipient
            </label>

            <textarea
              {...register("message", {
                required: "Please provide a short message",
                minLength: { value: 10, message: "Message too short" },
              })}
              placeholder="e.g. I am O+ and starting now..."
              className="w-full min-h-[120px] p-4 bg-[var(--color-surface-main)] border border-[var(--color-border-default)] rounded-[var(--radius-xl)] text-sm focus:outline-none focus:border-[var(--color-primary-600)] transition-all resize-none shadow-sm placeholder:text-[var(--color-content-muted)]"
            />

            {errors.message && (
              <p className="text-[11px] font-medium text-red-500 flex items-center gap-1">
                <X size={12} /> {errors.message.message}
              </p>
            )}
          </div>

          {/* Guidelines */}
          <div className="p-4 bg-[var(--color-primary-50)] rounded-[var(--radius-lg)] border border-[var(--color-primary-100)]">
            <p className="text-[11px] text-[var(--color-primary-700)] font-medium leading-relaxed">
              <strong>Note:</strong> By submitting, you agree to show up as soon
              as possible. Your contact details will be shared with the
              recipient.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-[var(--color-surface-secondary)] border-t border-[var(--color-border-default)] flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="px-6 h-11"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="px-10 h-11 shadow-lg shadow-primary-500/20"
          >
            <span className="flex items-center gap-2 uppercase tracking-widest text-[11px] font-black">
              Confirm Donation <CheckCircle2 size={16} />
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DonationModal;
