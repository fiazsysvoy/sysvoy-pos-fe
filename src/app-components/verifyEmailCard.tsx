"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useEffect, useState, Suspense } from "react";
import Loader from "@/components/common/Loader";
import Link from "next/link";
import { useAuthFlow } from "@/context/auth-flow-context";

interface VerifyEmailForm {
    code: string;
}

const VerifyEmailContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { email, setTempToken } = useAuthFlow();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<VerifyEmailForm>({
        mode: "onChange",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
                router.replace("/dashboard");
            } else if (!email) {
                router.replace("/login");
            } else {
                setIsLoading(false);
            }
        }
    }, [router, email]);

    if (isLoading) {
        return <Loader />;
    }

    if (!email) {
        if (!email) {
            return null;
        }
    }

    const onSubmit = async (data: VerifyEmailForm) => {
        try {
            const res = await api.post("/api/auth/verify-email", {
                email: email,
                code: data.code,
            });

            if (res.data?.token) {
                setTempToken(res.data.token);
            }

            toast.success("Email verified successfully!");
            router.push("/setup-business");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Verification failed");
            console.error(err);
        }
    };

    const handleResend = async () => {
        try {
            await api.post("/api/auth/resend-verification", {
                email: email,
            });
            toast.success("Verification code resent!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to resend code");
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center w-full">
            <Card className="w-1/4">
                <CardHeader>
                    <CardTitle>Verify your email</CardTitle>
                    <CardDescription>
                        We have sent a verification code to <span className="font-semibold">{email}</span>
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="code">Verification Code</Label>
                                <Input
                                    id="code"
                                    type="number"
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    {...register("code", {
                                        required: "Verification code is required",
                                        minLength: { value: 6, message: "Code must be 6 characters" },
                                        maxLength: { value: 6, message: "Code must be 6 characters" },
                                    })}
                                />
                                {errors.code && (
                                    <span className="text-red-500 text-sm">{errors.code.message}</span>
                                )}
                            </div>
                        </div>

                        <CardFooter className="flex-col gap-2 mt-4">
                            <Button type="submit" className="w-full" variant="black" disabled={isSubmitting}>
                                {isSubmitting ? "Verifying..." : "Verify Email"}
                            </Button>

                            <Button
                                type="button"
                                variant="link"
                                className="px-0 font-normal"
                                onClick={handleResend}
                            >
                                Resend verification code
                            </Button>

                            <div className="text-sm text-center text-muted-foreground mt-2">
                                Back to{" "}
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

export const VerifyEmailCard = () => {
    return (
        <Suspense fallback={<Loader />}>
            <VerifyEmailContent />
        </Suspense>
    )
}
