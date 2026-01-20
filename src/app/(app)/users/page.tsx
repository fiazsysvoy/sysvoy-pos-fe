"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenuButton } from "@/app-components/dropdownButton";
import { DataTable } from "@/app-components/data-table";
import { UserDialog } from "@/app-components/add-user-dialog";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

const Users = () => {
  const [user, setUser] = useState(false);
  const [users, setUsers] = useState<Array<any>>([]);
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const getUsers = async () => {
    const response = await api.get(`/api/users`);
    setUsers(response.data.data);
  };

  const handleEdit = (user: any) => {
    setUser(user)
    setEditing(true)
    setOpen(true)
  }

  const handleView = (user: any) => {

  }

  const handleDelete = async (user: any) => {
    try {
      if (!confirm("Delete this user?")) return
      await api.delete(`/api/users/${user.id}`)
      // refresh list
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      toast.success("User deleted successfully.")
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || "Failed to delete user")
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-4 p-6">
        <h1 className="text-2xl font-bold">Users{(users.length > 0) && ` (${users.length})`}</h1>
        <div className="flex flex-row gap-2">
          <Button variant="default" className="w-24 h-12 bg-gray-900 text-background dark:bg-chart-accent" onClick={() => setOpen(true)}>Add User</Button>
        </div>
      </div>
      <div className="p-6">
        <DataTable
          onEdit={handleEdit} onView={handleView} onDelete={handleDelete}
          columns={[
            {
              accessorKey: "name",
              header: "Name",
            },
            {
              accessorKey: "email",
              header: "Email",
            },
            {
              accessorKey: "role",
              header: "Role",
            },
          ]}
          data={users} />
      </div>
      {open && <UserDialog open={open} setOpen={setOpen} setEditing={setEditing} editing={editing} refetch={getUsers} user={user} setUser={setUser} />}
    </>
  );
};

export default Users;
