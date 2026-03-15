import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/auth";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const { user, signOut } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <h1>Bem-vindo, {user.first_name}!</h1>
      <Button onClick={signOut}>Sair</Button>
    </>
  );
};

export default HomePage;
