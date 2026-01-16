"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ChangePasswordCard = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const changePassword = async () => {
        setError("");

        if (!oldPassword || !newPassword) {
            setError("Fill all password fields");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            setLoading(true);
            await api.post("/api/auth/change-password", {
                oldPassword,
                newPassword,
            });

            toast.success("Password changed");
            setOldPassword("");
            setNewPassword("");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Password change failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <Button
                    className="bg-gray-900 text-background dark:bg-chart-accent"
                    onClick={changePassword}
                    disabled={loading}
                >
                    {loading ? "Upating..." : "Change Password"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default ChangePasswordCard;
