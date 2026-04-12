import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  useGetBloodRequestByIdQuery,
  useUpdateBloodRequestMutation,
} from "../../redux/features/bloodRequest/bloodRequestApi";

const EditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: existingData, isLoading } = useGetBloodRequestByIdQuery(id);
  const [updateRequest] = useUpdateBloodRequestMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (existingData) {
      const data = existingData.data;
      reset({
        ...data,
        donationDate: data.donationDate?.split("T")[0],
      });
    }
  }, [existingData, reset]);

  const selectedDistrictName = watch("district");

  const filteredUpazilas = upazilas
    .filter((u) => {
      const dist = districts.find((d) => d.name === selectedDistrictName);
      return dist ? u.district_id === dist.id : false;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const onSubmit = async (data) => {
    try {
      await updateRequest({ id, data }).unwrap();
      toast.success("Request updated successfully!");
      navigate(-1);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update request.");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 animate-in fade-in duration-500">
      <div className="bg-[var(--color-surface-card)] shadow-2xl border border-[var(--color-border-default)] rounded-md p-8 md:p-12">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--color-content-primary)]">
            Edit Blood Request
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary-600)] mt-2">
            Update the details of your request
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="p-6 space-y-6">
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

          {/* Footer inside form */}
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
                Update Request <Send size={14} />
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRequest;
