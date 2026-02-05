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
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [loadingOrg, setLoadingOrg] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoadingOrg(true);
        const res = await api.get("/api/account/organization");
        console.log("getOrganization", res.data);
        if (res.data.success && res.data.data) {
          setLowStockThreshold(res.data.data.lowStockThreshold || 10);
        }
      } catch (err: any) {
        console.error("Failed to fetch organization settings:", err);
      } finally {
        setLoadingOrg(false);
      }
    };
    fetchOrganization();
  }, []);

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

  const updateLowStockThreshold = async () => {
    try {
      if (lowStockThreshold < 0) {
        toast.error("Threshold must be a positive number");
        return;
      }
      setLoadingOrg(true);
      await api.put("/api/account/organization", {
        lowStockThreshold: lowStockThreshold,
      });
      toast.success("Low stock threshold updated");
    } catch (err: any) {
      console.log(err);
      toast.error(
        err.response?.data?.errors?.[0] ||
          "Failed to update low stock threshold",
      );
    } finally {
      setLoadingOrg(false);
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
          <CardContent className="space-y-4">
            <div className="flex justify-between flex-wrap">
              <p className="font-medium">Name:</p>
              <p className="text-sm text-muted-foreground">
                {user.organization?.name}{" "}
              </p>
            </div>
            {user.role === "ADMIN" && (
              <div className="space-y-2 pt-4 border-t">
                <Label>Low Stock Threshold</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={(e) =>
                      setLowStockThreshold(parseInt(e.target.value) || 0)
                    }
                    className="w-32"
                    disabled={loadingOrg}
                  />
                  <Button
                    onClick={updateLowStockThreshold}
                    disabled={loadingOrg}
                    className="bg-gray-900 text-background dark:bg-chart-accent"
                  >
                    {loadingOrg ? "Saving..." : "Update"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Products with stock at or below this number will trigger low
                  stock alerts
                </p>
              </div>
            )}
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
