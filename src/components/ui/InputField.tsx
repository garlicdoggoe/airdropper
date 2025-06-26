import React from "react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  type: string;
  large?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  type,
  large = false,
  onChange,
}) => {
  const commonProps = {
    placeholder,
    value,
    onChange,
    className:
      "p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
  };

  return (
    <div className="flex flex-col space-y-1 w-full">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {large ? (
        <textarea
          {...commonProps}
          className={`${commonProps.className} h-32`}
        />
      ) : (
        <input {...commonProps} type={type} />
      )}
    </div>
  );
};

export default InputField;
