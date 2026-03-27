import React, { useState } from "react";
import { ArrowLeft, Save, User, Shield, Globe } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock initial state - in a real app, fetch this via useEffect
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    location: "New York, USA",
    bio: "Lead Developer with a focus on scalable architecture.",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle update logic here
    navigate("/users");
  };

  return (
    <div className="container-main section-sm animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary !p-2 rounded-[var(--radius-md)]"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-content-primary)] font-display">
              Edit Profile
            </h1>
            <p className="text-sm text-[var(--color-content-muted)]">
              Update account details and permission scopes.
            </p>
          </div>
        </div>

        <button
          form="edit-form"
          type="submit"
          className="btn btn-primary flex items-center gap-2 px-6"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card text-center py-10">
            <div className="relative inline-block mb-4">
              <img
                src="https://avatar.iran.liara.run/public/30"
                className="w-32 h-32 rounded-[var(--radius-2xl)] object-cover border-4 border-[var(--color-surface-secondary)] shadow-[var(--shadow-lg)]"
                alt="Profile"
              />
              <span className="absolute bottom-2 right-2 w-6 h-6 bg-[var(--color-success-solid)] border-4 border-[var(--color-surface-card)] rounded-full" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-content-primary)]">
              {formData.name}
            </h3>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--color-content-muted)] mt-1">
              {formData.role}
            </p>
          </div>

          <div className="card space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-content-muted)]">
              Quick Actions
            </h4>
            <button className="w-full btn btn-secondary text-[var(--color-error-solid)] hover:bg-[var(--color-error-subtle)] border-[var(--color-error-subtle)]">
              Reset Password
            </button>
          </div>
        </div>

        {/* Right Column: Form Fields */}
        <div className="lg:col-span-2">
          <form
            id="edit-form"
            onSubmit={handleSubmit}
            className="card space-y-8"
          >
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-default)]">
                <User size={16} className="text-[var(--color-primary-600)]" />
                <h3 className="text-sm font-bold text-[var(--color-content-primary)] uppercase tracking-wider">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.email}
                    disabled
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6 pt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--color-border-default)]">
                <Shield size={16} className="text-[var(--color-primary-600)]" />
                <h3 className="text-sm font-bold text-[var(--color-content-primary)] uppercase tracking-wider">
                  Access Control
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase ml-1">
                    System Role
                  </label>
                  <select className="input-field appearance-none bg-[url('data:image/svg+xml;...')]">
                    <option value="admin">Administrator</option>
                    <option value="donor">Donor</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-[var(--color-content-muted)] uppercase ml-1">
                    Account Status
                  </label>
                  <select className="input-field">
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
