import React from "react";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-surface-main)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
        {/* Visual Warning */}
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mx-auto border border-red-100">
            <ShieldAlert size={48} className="text-red-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full border-4 border-[var(--color-surface-main)] flex items-center justify-center text-white font-bold text-xs">
            403
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-[var(--color-content-primary)] uppercase tracking-tight">
            Access Restricted
          </h1>
          <p className="text-sm text-[var(--color-content-muted)] leading-relaxed">
            Your current account credentials do not have the required
            permissions to view this terminal section.
          </p>
        </div>

        {/* Industrial Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="secondary"
            className="flex-1 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Go Back
          </Button>
          <Button
            variant="primary"
            className="flex-1 gap-2"
            onClick={() => navigate("/")}
          >
            <Home size={16} /> Return Home
          </Button>
        </div>

        {/* System ID */}
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-content-muted)] opacity-50">
          Security Protocol: 0x403_FORBIDDEN
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
