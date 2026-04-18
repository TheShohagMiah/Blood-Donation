import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
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
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import { districts } from "../../data/districts";
import { upazilas } from "../../data/upazilas";
import { toast } from "react-hot-toast";
import { useCreateBloodRequestMutation } from "../../redux/features/bloodRequest/bloodRequestApi";
import { useSelector } from "react-redux";

const CreateBloodRequestFromDashboard = () => {
  const { user } = useSelector((state) => state.auth) || {};
  const [createRequest] = useCreateBloodRequestMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      urgency: "normal",
      bloodGroup: "",
      district: "",
      upazila: "",
    },
  });

  const selectedDistrictName = watch("district");

  // Reset upazila when district changes
  useEffect(() => {
    setValue("upazila", "");
  }, [selectedDistrictName, setValue]);

  const filteredUpazilas = upazilas
    .filter((u) => {
      const dist = districts.find((d) => d.name === selectedDistrictName);
      return dist ? u.district_id === dist.id : false;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const onSubmit = async (data) => {
    try {
      await createRequest(data).unwrap();
      navigate(-1);
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to create request. Please try again.",
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 animate-in fade-in duration-500">
      <div className="bg-[var(--color-surface-card)] shadow-2xl border border-[var(--color-border-default)] rounded-md p-8 md:p-12">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--color-content-primary)]">
            Create Blood Request
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary-600)] mt-2">
            Fill in the details to post your request
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="p-6 space-y-6">
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
              <Controller
                name="bloodGroup"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <Select
                    label="Blood Group"
                    icon={Droplets}
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
                name="urgency"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <Select
                    label="Urgency Level"
                    icon={AlertCircle}
                    error={errors.urgency?.message}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent (Within 24h)</option>
                    <option value="emergency">Emergency (Immediate)</option>
                  </Select>
                )}
              />
            </div>

            {/* Section 3: Regional Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Controller
                name="district"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <Select
                    label="District"
                    icon={MapPin}
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
                rules={{ required: "Required" }}
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

            {/* Section 4: Physical Address */}
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
          <div className="p-6 flex justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(-1)}
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
    </div>
  );
};

export default CreateBloodRequestFromDashboard;
