import React, { useState } from "react";

interface TextAreaProps {
  name: string;
  hasLabel: boolean;
  labelText: string;
  options?: {
    valueProp?: string;
  };
  onChange: (name: string, value: string) => void;
}

export default function TextArea({
  name,
  hasLabel,
  labelText,
  options,
  onChange,
}: TextAreaProps) {
  const [value, setValue] = useState<string>(options?.valueProp || "");

  const handleChange = (val: string) => {
    setValue(val);
    if (onChange) {
      onChange(name, val); // Enviamos el cambio al padre
    }
  };

  return (
    <div className="w-full flex flex-col h-full min-h-[120px]">
      {hasLabel && (
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 tracking-wider">
          {labelText}
        </label>
      )}
      <div className="flex-1 w-full group">
        <textarea
          name={name}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Escribe aquí las observaciones..."
          className="
            w-full
            h-full
            min-h-[100px]
            p-3
            text-sm
            text-gray-700
            bg-white
            border-2
            border-gray-100
            rounded-xl
            outline-none
            transition-all
            duration-200
            resize-none
            placeholder:text-gray-300
            hover:border-gray-200
            focus:border-[#FF7A00]
            focus:ring-4
            focus:ring-orange-50
          "
        />
      </div>
    </div>
  );
}
