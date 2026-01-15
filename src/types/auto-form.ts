import { FieldValues, Path } from "react-hook-form";

export interface FieldConfig<T = any> {
  name: Path<T>;
  label: string;
  type:
    | "text"
    | "number"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "multi-select"
    | "date"
    | "file"
    | "custom";
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  defaultValue?: any;
  disabled?: boolean;
  accept?: string; // For file inputs
  render?: (props: { control: any; name: string }) => React.ReactNode;
}

export interface AutoFormModalProps<T extends FieldValues = any> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: FieldConfig<T>[];
  onSubmit: (data: T) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<T>;
  submitLabel?: string;
  className?: string;
  initialValues?: any; // Added to satisfy strict props check in some pages
}
