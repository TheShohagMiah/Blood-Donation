import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/features/isAuth/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import { BackgroundGradient } from "../ui/background-gradient";

const LoginPage = () => {
  const [loginUser, { data, isLoading, isSuccess, isError, error }] =
    useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      const response = await loginUser(formData).unwrap();
      dispatch(setCredentials(response?.user));
      navigate("/", { replace: true });
    } catch (err) {
      const errMsg =
        err?.data?.message || "Terminal Error: Invalid Credentials";
      toast.error(errMsg);
      console.error("Login Error:", err);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-surface-main px-4 pt-10">
      <BackgroundGradient className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-surface-primary rounded-xl shadow-[var(--shadow-xl)] border-border-strong p-8 md:p-10">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-content-primary)]">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--color-content-muted)]">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
          </div>

          <div className="">
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password", { required: "Password is required" })}
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isSubmitting}
          >
            <span className="flex items-center justify-center gap-2">
              Sign In
            </span>
          </Button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[var(--color-content-muted)] mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[var(--color-content-primary)] hover:text-[var(--color-primary-600)] transition-colors inline-flex items-center gap-2"
          >
            create an account <ArrowRight size={12} />
          </Link>
        </p>
      </BackgroundGradient>
    </div>
  );
};

export default LoginPage;
