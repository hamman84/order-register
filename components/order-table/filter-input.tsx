import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";

interface FilterInputProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  selectedColumn: string;
  onColumnChange: (column: string) => void;
}

export default function FilterInput({
  options,
  value,
  onChange,
  selectedColumn,
  onColumnChange,
}: FilterInputProps) {
  const id = useId();
  return (
    <div className="flex rounded-md shadow-xs">
      <div className="group relative">
        <Label
          htmlFor={id}
          className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
        >
          Buscar por...
        </Label>
        <SelectNative
          className="bg-background text-muted-foreground hover:text-foreground w-fit rounded-e-none shadow-none"
          value={selectedColumn}
          onChange={(e) => onColumnChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectNative>
      </div>
      <Input
        id={id}
        value={value}
        className="-ms-px bg-background rounded-s-none shadow-none focus-visible:z-10"
        placeholder="buscar..."
        type="text"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
