// components/routes/PrivateRoute.tsx
"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const token = auth?.token;
  const isReady = auth?.isReady;
  const router = useRouter();

  useEffect(() => {
    if (isReady && !token) {
      router.push("/login");
    }
  }, [isReady, token, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Carregando sua sessão...
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
