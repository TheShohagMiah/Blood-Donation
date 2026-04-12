import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Send,
  Phone,
  User,
  Droplets,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  Home,
} from "lucide-react";
import Input from "../../../../ui/Input";
import Select from "../../../../ui/Select";
import Button from "../../../../ui/Button";
import { districts } from "../../../../data/districts";
import { upazilas } from "../../../../data/upazilas";
import { toast } from "react-hot-toast";
import { useCreateBloodRequestMutation } from "../../../../redux/features/bloodRequest/bloodRequestApi";
const CreateBloodRequest = ({ onClose }) => {
  const [createRequest] = useCreateBloodRequestMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      urgency: "normal",
    },
  });

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  const selectedDistrictName = watch("district");

  const filteredUpazilas = upazilas
    .filter((u) => {
      const dist = districts.find((d) => d.name === selectedDistrictName);
      return dist ? u.district_id === dist.id : false;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const onSubmit = async (data) => {
    try {
      await createRequest(data).unwrap();
      onClose();
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to create request. Please try again.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[var(--color-surface-overlay)] backdrop-blur-md animate-in fade-in duration-300"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-2xl bg-[var(--color-surface-card)] rounded-[var(--radius-2xl)] border border-[var(--color-border-strong)] shadow-[var(--shadow-2xl)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border-default)] flex items-center justify-between bg-[var(--color-surface-secondary)]">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[var(--color-content-primary)] uppercase">
              Create Blood Request
            </h3>
            <p className="text-[10px] font-medium text-[var(--color-content-muted)] uppercase tracking-widest">
              Fill in the details to post your request
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

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Section 1: Recipient & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              {...register("recipientName", { required: "Name is required" })}
              label="Recipient Name"
              icon={User}
              placeholder="e.g. John Doe"
              error={errors.recipientName?.message}
            />
            <Input
              {...register("contactNumber", {
                required: "Required",
                pattern: {
                  value: /^(?:\+88|01)[3-9]\d{8}$/,
                  message: "Format: 01XXXXXXXXX",
                },
              })}
              label="Contact Number"
              icon={Phone}
              type="tel"
              placeholder="01XXXXXXXXX"
              error={errors.contactNumber?.message}
            />
          </div>

          {/* Section 2: Blood & Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Blood Group"
              icon={Droplets}
              {...register("bloodGroup", { required: "Required" })}
              error={errors.bloodGroup?.message}
            >
              <option value="">Select Group</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
            <Select
              label="Urgency Level"
              icon={AlertCircle}
              {...register("urgency", { required: "Required" })}
              error={errors.urgency?.message}
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent (Within 24h)</option>
              <option value="emergency">Emergency (Immediate)</option>
            </Select>
          </div>

          {/* Section 3: Regional Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="District"
              icon={MapPin}
              {...register("district", { required: "Required" })}
              error={errors.district?.message}
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
              {...register("upazila", { required: "Required" })}
              error={errors.upazila?.message}
            >
              <option value="">Select Upazila</option>
              {filteredUpazilas.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Section 4: Physical Address (NEW) */}
          <div className="space-y-5">
            <Input
              {...register("hospitalName", {
                required: "Hospital name is required",
              })}
              label="Hospital Name"
              placeholder="e.g. Dhaka Medical College Hospital"
              error={errors.hospitalName?.message}
            />
            <Input
              {...register("fullAddress", {
                required: "Detailed address is required",
              })}
              label="Detailed Address"
              icon={Home}
              placeholder="e.g. Floor 4, Ward 2, Bed 12, Main Building"
              error={errors.fullAddress?.message}
            />
          </div>

          {/* Section 5: Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              {...register("donationDate", { required: "Required" })}
              type="date"
              label="Required Date"
              icon={Calendar}
              error={errors.donationDate?.message}
            />
            <Input
              {...register("donationTime", { required: "Required" })}
              type="time"
              label="Required Time"
              icon={Clock}
              error={errors.donationTime?.message}
            />
          </div>

          {/* Note Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-content-muted)]">
              Case Summary / Notes
            </label>
            <textarea
              {...register("message")}
              rows={3}
              placeholder="Briefly explain the medical case or any specific needs..."
              className="w-full bg-[var(--color-surface-main)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-3 text-sm focus:outline-none focus:border-[var(--color-primary-600)] transition-colors resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[var(--color-surface-secondary)] border-t border-[var(--color-border-default)] flex justify-end gap-3">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            className="px-10"
          >
            <span className="flex items-center gap-2">
              Add Request <Send size={14} />
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBloodRequest;
