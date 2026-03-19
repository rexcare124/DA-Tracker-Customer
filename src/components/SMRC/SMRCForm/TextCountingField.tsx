"use client";

import type { RegisterOptions } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import {
  type SMRCFormInputFields,
  SMRC_LABEL_CLASS,
  SMRC_TEXTAREA_CLASS,
  SMRC_ERROR_CLASS,
} from "./helper";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TextCountingFieldProps {
  label: React.ReactNode;
  name: keyof SMRCFormInputFields;
  limit: number;
  rules?: RegisterOptions<SMRCFormInputFields, keyof SMRCFormInputFields>;
  disabled?: boolean;
}

export default function TextCountingField({
  label,
  name,
  limit,
  rules,
  disabled,
}: TextCountingFieldProps) {
  const { control, formState: { errors } } = useFormContext<SMRCFormInputFields>();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <div className="w-full space-y-0 mt-[30px]">
          <Label className={SMRC_LABEL_CLASS}>{label}</Label>
          <textarea
            className={cn(
              SMRC_TEXTAREA_CLASS,
              errors[name] && "border-destructive"
            )}
            {...field}
            value={field.value as string ?? ""}
            onChange={(e) => {
              if (e.target.value.length <= limit) field.onChange(e.target.value);
            }}
            disabled={disabled}
          />
          {!errors[name]?.message && (
            <p className="text-sm text-[#38464d] mt-1">
              Remaining characters: {limit - ((field.value as string)?.length ?? 0)}
            </p>
          )}
          {errors[name]?.message && (
            <p className={SMRC_ERROR_CLASS}>{String(errors[name]?.message)}</p>
          )}
        </div>
      )}
    />
  );
}
