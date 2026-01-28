"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Suspense, useEffect, useState } from "react";
import Loader from "@/components/common/Loader";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

const ResetPasswordFormContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      return;
    }

    const verifyToken = async () => {
      try {
        await api.get(`/api/auth/verify-reset-token/${token}`);
        setIsValidToken(true);
      } catch (err) {
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    mode: "onChange",
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    try {
      await api.post("/api/auth/reset-password", {
        token,
        newPassword: data.password,
      });

      toast.success("Password reset successful! Please login.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password.");
      console.error(err);
    }
  };

  if (isValidToken === null) {
    return <Loader />;
  }

  if (!isValidToken) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-red-500">
          This password reset link has expired or is invalid.
        </p>
        <Button onClick={() => router.push("/forgot-password")}>
          Request New Reset Link
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-red-500">Missing or invalid reset token.</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        {/* Password */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
      </div>

      <CardFooter className="flex-col gap-2 mt-4 px-0">
        <Button
          type="submit"
          className="w-full bg-black text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </CardFooter>
    </form>
  );
};

export const ResetPasswordCard = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>

        <CardContent>
          <Suspense fallback={<Loader />}>
            <ResetPasswordFormContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};
