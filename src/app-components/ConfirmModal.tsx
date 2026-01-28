"use client";

import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onCancel} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-zinc-900 rounded-xl w-[360px] p-6 space-y-4">
          <h2 className="text-lg font-semibold dark:text-white">{title}</h2>
          <p className="text-sm dark:text-zinc-400">{description}</p>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="
                border-zinc-300 text-zinc-900
                hover:bg-zinc-100
                dark:border-zinc-700 dark:text-zinc-100
                dark:hover:bg-zinc-800"
            >
              {cancelText}
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Deleting..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
