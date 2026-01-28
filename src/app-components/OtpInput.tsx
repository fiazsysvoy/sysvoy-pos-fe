"use client";

import { Input } from "@/components/ui/input";
import { useRef } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return;

    const newValue =
      value.substring(0, index) + val + value.substring(index + 1);

    onChange(newValue);

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(paste)) return;
    onChange(paste);
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          maxLength={1}
          inputMode="numeric"
          className="w-12 h-12 text-center text-lg font-semibold"
        />
      ))}
    </div>
  );
}
