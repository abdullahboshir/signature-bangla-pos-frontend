"use client";

import React, { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import Image from "next/image";

type FileUploaderProps = {
  name: string;
  label?: string;
};

const FileUploader = ({ name, label = "Upload" }: FileUploaderProps) => {
  const { control } = useFormContext();
  const value = useWatch({ control, name });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File || value instanceof Blob) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string") {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, ...field } }) => (
        <div className="space-y-2">
          <label className="block w-full cursor-pointer">
            {preview ? (
              <Image
                src={preview}
                alt="Uploaded preview"
                width={300}
                height={100}
                className="w-full h-32 object-cover rounded-md border border-muted"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium bg-muted rounded-md border border-muted text-muted-foreground hover:bg-muted/70">
                {label}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange(file);
                }
              }}
              className="hidden"
            />
          </label>
        </div>
      )}
    />
  );
};

export default FileUploader;
