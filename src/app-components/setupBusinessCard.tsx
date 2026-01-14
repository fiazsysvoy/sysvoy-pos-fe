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
import Link from "next/link"; // unused but consistent imports
import { useAuthFlow } from "@/context/auth-flow-context";
import Loader from "@/components/common/Loader";

interface SetupBusinessForm {
    name: string;
}

export const SetupBusinessCard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { tempToken } = useAuthFlow();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SetupBusinessForm>({
        mode: "onChange",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (!tempToken) {
                toast.error("Please login to continue.");
                router.replace("/login");
            } else {
                setIsLoading(false);
            }
        }
    }, [router, tempToken]);

    if (isLoading) {
        return <Loader />;
    }

    const onSubmit = async (data: SetupBusinessForm) => {
        try {
            await api.post("/api/auth/create-organization", {
                name: data.name,
            }, {
                headers: {
                    Authorization: `Bearer ${tempToken}`
                }
            });

            if (tempToken) {
                localStorage.setItem("token", tempToken);
            }
            toast.success("Business setup complete!");
            router.push("/dashboard");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to create organization");
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center w-full">
            <Card className="w-1/4">
                <CardHeader>
                    <CardTitle>Setup your Business</CardTitle>
                    <CardDescription>
                        Enter the name of your business to get started.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            {/* Business Name */}
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="name">Business Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="My Awesome Café"
                                    {...register("name", {
                                        required: "Business name is required",
                                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                                    })}
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-sm">{errors.name.message}</span>
                                )}
                            </div>
                        </div>

                        <CardFooter className="flex-col gap-2 mt-4">
                            <Button type="submit" className="w-full" variant="black" disabled={isSubmitting}>
                                {isSubmitting ? "Setting up..." : "Complete Setup"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
