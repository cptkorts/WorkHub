interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  id,
  name,
  type,
  label,
  placeholder,
  required = false,
  autoComplete,
  value,
  error,
  onChange,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-default">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-1 appearance-none relative block w-full px-3 py-2 border border-border placeholder-text-muted text-hover rounded-md focus:outline-none focus:ring-2 focus:ring-muted focus:border-muted sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
