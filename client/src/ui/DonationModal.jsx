import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Clock } from "lucide-react";
import Button from "../ui/Button";

const DonationModal = ({ isOpen, onClose, onSubmit, selectedRequest }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      message: "",
      status: "",
      estimatedArrivalTime: "",
    },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[var(--color-overlay)] backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-lg bg-[var(--color-surface-card)] rounded-[var(--radius-2xl)] border border-[var(--color-border-strong)] shadow-[var(--shadow-2xl)] overflow-hidden animate-in zoom-in-95 duration-300"
      >
        <div className="px-8 py-6 border-b border-[var(--color-border-default)] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl text-[var(--color-content-primary)]">
              Donate Now
            </h3>
            <p className="text-[13px] text-[var(--color-content-muted)] mt-1">
              Providing blood for {selectedRequest?.patient}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-surface-hover)] rounded-full transition-colors text-[var(--color-content-muted)]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-content-muted)]">
              Message
            </label>
            <textarea
              {...register("message", { required: "Message is required" })}
              placeholder="e.g., I'm coming from Mirpur..."
              className="w-full min-h-[100px] p-4 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-all resize-none"
            />
            {errors.message && (
              <p className="text-[12px] text-red-600">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-content-muted)]">
                Status
              </label>
              <select
                {...register("status", { required: "Required" })}
                className="w-full h-11 px-4 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[14px] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">Select status</option>
                <option value="interested">Interested</option>
                <option value="on-the-way">On the way</option>
              </select>
              {errors.status && (
                <p className="text-[12px] text-red-600">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[var(--color-content-muted)]">
                Arrival Time
              </label>
              <div className="relative">
                <Clock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-content-muted)]"
                />
                <input
                  type="text"
                  {...register("estimatedArrivalTime", {
                    required: "Required",
                  })}
                  placeholder="e.g. 30 mins"
                  className="w-full h-11 pl-11 pr-4 bg-[var(--color-surface-subtle)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] text-[14px] focus:outline-none"
                />
              </div>
              {errors.estimatedArrivalTime && (
                <p className="text-[12px] text-red-600">
                  {errors.estimatedArrivalTime.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-[var(--color-surface-subtle)] border-t border-[var(--color-border-default)] flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="px-10">
            Submit Donation
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DonationModal;
