import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({ placeholder = "Digite sua senha" }) => {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        type={passwordIsVisible ? "text" : "password"}
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
};

export default PasswordInput;
