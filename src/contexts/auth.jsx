import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import React, { useContext, useEffect } from "react";
import { toast } from "sonner";

export const AuthContext = React.createContext({
  user: null,
  isInitializing: true,
  login: () => {},
  signup: () => {},
  signOut: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const LOCAL_STORAGE_ACCESS_TOKEN_KEY = "accessToken";
const LOCAL_STORAGE_REFRESH_TOKEN_KEY = "refreshToken";

const setTokens = (tokens) => {
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, tokens.refreshToken);
};

const removeTokens = () => {
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY);
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [isInitializing, setIsInitializing] = React.useState(true);
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
        const accessToken = localStorage.getItem(
          LOCAL_STORAGE_ACCESS_TOKEN_KEY,
        );
        const refreshToken = localStorage.getItem(
          LOCAL_STORAGE_REFRESH_TOKEN_KEY,
        );

        if (!accessToken && !refreshToken) {
          return;
        }

        const response = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        removeTokens();
        console.error(error);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  const signup = (data) => {
    signupMutation.mutate(data, {
      onSuccess: (createdUser) => {
        setUser(createdUser.user);
        setTokens(createdUser.tokens);
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
        setTokens(loggedUser.tokens);
        setUser(loggedUser.user);
        toast.success("Login realizado com sucesso!");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Ocorreu um erro ao fazer login",
        );
      },
    });
  };

  const signOut = () => {
    removeTokens();
    setUser(null);
    toast.success("Logout realizado com sucesso!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        isInitializing,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
