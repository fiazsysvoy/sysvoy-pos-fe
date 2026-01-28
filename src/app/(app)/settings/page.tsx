"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useUser } from "@/context/user-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ChangePasswordCard from "@/app-components/ChangePasswordCard";

const Settings = () => {
  const { user, loading, logout, refreshUser } = useUser();

  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const updateProfile = async () => {
    try {
      if (name.length < 2) {
        toast.error("Name must be atleast 2 char long");
        return;
      }
      await api.put("/api/account/", { name });
      toast.success("Profile updated");
      refreshUser();
    } catch (err: any) {
      console.log(err);
      toast.error(
        err.response?.data?.errors?.[0] || "Failed to update profile",
      );
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (!user) return null; // Should not happen if AuthGuard works

  return (
    <div className="p-6 w-full flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-6 ">
        {/* Heading */}
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={user.role} disabled />
            </div>

            <Button
              className="bg-gray-900 text-background dark:bg-chart-accent"
              onClick={updateProfile}
            >
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Organization */}
        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between flex-wrap">
            <p className="font-medium">Name:</p>
            <p className="text-sm text-muted-foreground">
              {user.organization?.name}{" "}
            </p>
          </CardContent>
        </Card>

        {/* Change Password */}
        <ChangePasswordCard />

        <Separator />

        {/* Logout */}
        <div className="flex justify-center">
          <Button variant="destructive" onClick={logout}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
