"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Controller, set, useForm } from "react-hook-form"
import CustomSelectInput from "./Select-Input"
import api from "@/lib/axios"
import { toast } from "sonner"
import { useState } from "react"
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export function UserDialog({ open, setOpen, user, setEditing, editing, refetch, setUser }: { open?: boolean, setOpen: (open: boolean) => void, user: any, setEditing: (editing: boolean) => void, editing: boolean, refetch: () => void, setUser: (user: any) => void }) {
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onChange",
    });
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            setIsLoading(true);
            if (editing) {
                const res = await api.put(`/api/users/${user.id}`, data);
                if (res.status == 200) {
                    setOpen(false);
                    setEditing(false);
                    setUser(null);
                    refetch();
                    toast.success("User updated successfully");
                }
                return;
            }
            const res = await api.post(`/api/users`, data);
            if (res.status == 201) {
                setUser(null);
                setOpen(false);
                refetch();
                toast.success("User added successfully");
            }
        } catch (err: any) {
            console.error(err.message);
            toast.error(err?.response?.data?.message || "An error occurred. Please try again.")
        } finally {
            setIsLoading(false);
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // if(!editing) return;
        const { id, value } = e.target;
        setUser((prev: any) => ({ ...prev, [id]: value }));
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Add User</DialogTitle>
                        <DialogDescription>
                            Add a new user to your team here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                value={user?.name || ''}
                                id="name"
                                {...register("name", {
                                    required: "Name is required",
                                })}
                                onChange={handleChange}
                            />
                            {errors.name?.message && (
                                <span className="text-red-500 text-sm">{String(errors.name?.message)}</span>
                            )}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                value={user?.email || ''}
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email address",
                                    },
                                    onChange: handleChange
                                })}
                            />
                            {errors.email && (
                                <span className="text-red-500 text-sm">{String(errors.email.message)}</span>
                            )}
                        </div>
                        {/* {!editing && (
                            <div className="grid gap-3">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    value={user?.password || ''}
                                    id="password"
                                    type="password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                    onChange={handleChange}
                                />
                                {errors.password && (
                                    <span className="text-red-500 text-sm">{String(errors.password.message)}</span>
                                )}
                            </div>
                        )} */}
                        <div className="grid gap-3">
                            <Label htmlFor="role">Role</Label>
                            <Controller
                                control={control}
                                name="role"
                                render={({ field }) => (
                                    <CustomSelectInput
                                        value={field.value || user?.role || ''}
                                        onChange={field.onChange}
                                        options={[
                                            { value: "ADMIN", label: "Admin" },
                                            { value: "STAFF", label: "Staff" },
                                        ]}
                                        placeholder="Select a role"
                                    />
                                )}
                            />
                            {errors.role && (
                                <span className="text-red-500 text-sm">{String((errors.role as any).message)}</span>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => { setOpen(false); setEditing(false); setUser(null) }}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isLoading}>{isLoading ? "Saving..." : "Save changes"}</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

