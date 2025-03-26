// hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";

export function useAuth() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    setIsLogged(auth === "true");
  }, []);

  return { isLogged };
}
