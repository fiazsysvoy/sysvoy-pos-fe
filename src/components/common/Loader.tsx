"use client";

import { Loader2 } from "lucide-react";

interface LoaderProps {
  text?: string;
}

export default function Loader({ text }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
        {text && <p className="text-sm text-gray-600">{text}</p>}
      </div>
    </div>
  );
}
