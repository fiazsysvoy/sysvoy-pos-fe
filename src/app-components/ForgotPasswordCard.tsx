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
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ForgotPasswordForm {
  email: string;
}

export const ForgotPasswordCard = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await api.post("/api/auth/forgot-password", {
        email: data.email,
      });
      setIsSuccess(true);
      toast.success("Reset link sent to your email.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send reset link.");
      console.error(err);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center w-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We have sent a password reset link to your email address.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col gap-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
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
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
              <Button asChild variant="link" className="px-0 font-normal">
                <Link href="/login">Back to Login</Link>
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
