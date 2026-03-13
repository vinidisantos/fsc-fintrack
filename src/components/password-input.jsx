import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { forwardRef, useState } from "react";

const PasswordInput = forwardRef(
  ({ placeholder = "Digite sua senha", ...props }, ref) => {
    const [passwordIsVisible, setPasswordIsVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          placeholder={placeholder}
          type={passwordIsVisible ? "text" : "password"}
          ref={ref}
          {...props}
        />
        <Button
          variant="ghost"
          className="absolute bottom-0 right-0 top-0 my-auto mr-1 h-8 w-8 text-muted-foreground"
          onClick={() => setPasswordIsVisible((prev) => !prev)}
        >
          {passwordIsVisible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
