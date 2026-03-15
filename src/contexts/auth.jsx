import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "sonner";

export const AuthContext = React.createContext({
  user: null,
  login: () => {},
  signup: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const signupMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (variables) => {
      console.log("DADOS ENVIADOS:", variables);

      const response = await api.post("/users", {
        first_name: variables.firstName,
        last_name: variables.lastName,
        email: variables.email,
        password: variables.password,
      });

      return response.data;
    },
  });

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data) => {
      const response = await api.post("/auth", {
        email: data.email,
        password: data.password,
      });

      return response.data;
    },
  });

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!accessToken && !refreshToken) return;
        const response = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.error(error);
      }
    };
    init();
  }, []);

  const signup = (data) => {
    signupMutation.mutate(data, {
      onSuccess: (createdUser) => {
        const accessToken = createdUser.tokens.accessToken;
        const refreshToken = createdUser.tokens.refreshToken;

        setUser(createdUser.user);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        toast.success("Conta criada com sucesso!");
      },
      onError: (error) => {
        console.log("ERRO API:", error.response?.data);
        toast.error("Erro ao criar conta.");
      },
    });
  };

  const login = (data) => {
    loginMutation.mutate(data, {
      onSuccess: (loggedUser) => {
        const accessToken = loggedUser.tokens.accessToken;
        const refreshToken = loggedUser.tokens.refreshToken;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        setUser(loggedUser);

        toast.success("Login realizado com sucesso!");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Ocorreu um erro ao fazer login",
        );
      },
    });
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
