"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthFlowContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
  tempToken: string | null;
  setTempToken: (token: string | null) => void;
  clearAuth: () => void;
}

const AuthFlowContext = createContext<AuthFlowContextType | undefined>(
  undefined,
);

export const AuthFlowProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [tempToken, setTempToken] = useState<string | null>(null);

  const clearAuth = () => {
    setEmail(null);
    setTempToken(null);
  };

  return (
    <AuthFlowContext.Provider
      value={{
        email,
        setEmail,
        tempToken,
        setTempToken,
        clearAuth,
      }}
    >
      {children}
    </AuthFlowContext.Provider>
  );
};

export const useAuthFlow = () => {
  const context = useContext(AuthFlowContext);
  if (context === undefined) {
    throw new Error("useAuthFlow must be used within an AuthFlowProvider");
  }
  return context;
};
