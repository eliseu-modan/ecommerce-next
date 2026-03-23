// components/routes/PrivateRoute.tsx
"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const token = auth?.token;
  const router = useRouter();
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);
  if (!token) {
    return null;
  }

  return <>{children}</>;
}
