"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";

interface LoginForm {
  email: string;
  password: string;
}

export const LoginCard = () => {
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    mode: "onChange",
  });

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.replace("/dashboard");
      } else {
        setIsLoading(false);
      }
    }
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post("/api/auth/signin", {
        email: data.email,
        password: data.password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid login credentials");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-1/4">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">{errors.password.message}</span>
                )}
              </div>
            </div>

            <CardFooter className="flex-col gap-2 mt-4">
              <Button type="submit" className="w-full" variant="black" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
