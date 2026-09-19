import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";

export default function PasswordInput({ label, name, value, onChange, placeholder, error, helperText, ...props }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <Input
                {...props}
                type={showPassword ? "text" : "password"}
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                error={error}
                endElement={
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-zinc-400 hover:text-white transition cursor-pointer p-1"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
            />
            {helperText && <p className="mt-1.5 text-xs text-zinc-500">{helperText}</p>}
        </div>
    );
}
