
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { NumberDisplay } from "@/components/NumberDisplay";
import { shouldShowWords } from "@/utils/numberFormatting";

interface NumberInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  displayType?: 'currency' | 'percentage' | 'number';
  wordClassName?: string;
}

export function NumberInput({ 
  value, 
  onChange, 
  displayType = 'number',
  wordClassName = "text-muted-foreground italic text-xs mt-2",
  ...props 
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? undefined : Number(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Input
        type="number"
        value={value === undefined ? '' : value}
        onChange={handleChange}
        {...props}
      />
      {value !== undefined && shouldShowWords(value) && (
        <div className={wordClassName}>
          <NumberDisplay 
            value={value} 
            type={displayType}
            className="text-xs" 
          />
        </div>
      )}
    </div>
  );
}
