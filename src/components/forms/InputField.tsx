// components/form/HmInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFormContext } from "react-hook-form";

type TInputProps = {
  name: string;
  label?: string;
  type?: string;
  isMultiline?: boolean;
  required?: boolean;
  rows?: number;
  placeholder?: string;
};

const InputField = ({
  name,
  label,
  type = "text",
  isMultiline = false,
  required = false,
  rows = 4,
  placeholder = ""
}: TInputProps) => {
  const { control } = useFormContext();

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            {isMultiline ? (
              <Textarea
                {...field}
                id={name}
                placeholder={placeholder}
                rows={rows}
                className={error ? "border-red-500" : ""}
              />
            ) : (
              <Input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                className={error ? "border-red-500" : ""}
              />
            )}
            {error && (
              <p className="text-sm text-red-500 mt-1">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
};

export default InputField;
