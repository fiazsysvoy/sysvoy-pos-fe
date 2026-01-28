"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuthFlow } from "@/context/auth-flow-context";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignupCard = () => {
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    mode: "onChange",
  });

  const { setEmail } = useAuthFlow();

  const router = useRouter();
  const password = watch("password");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        router.replace("/dashboard");
      } else {
        setIsLoading(false);
      }
    }
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  const onSubmit = async (data: SignupForm) => {
    try {
      await api.post("/api/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      // toast.success("Signup successful! Please login.");

      // verify email otp
      setEmail(data.email);
      router.push("/verify-email");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-1/4">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>

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

              {/* Password */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
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
                  placeholder="••••••••"
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

            <CardFooter className="flex-col gap-2 mt-4">
              <Button
                type="submit"
                className="w-full"
                variant="black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
              <div className="text-sm text-center text-muted-foreground mt-2">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
