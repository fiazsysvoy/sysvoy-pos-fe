"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (!token) {
                router.replace("/login");
            } else {
                setIsLoading(false);
            }
        }
    }, [router]);

    if (isLoading) {
        return <Loader />;
    }

    return <>{children}</>;
};
