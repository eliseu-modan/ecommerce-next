"use client";

import { Suspense, useContext, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/contexts/AuthProvider";

function GoogleAuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const auth = useContext(AuthContext);
  const hasLogged = useRef(false);

  useEffect(() => {
    const token = params.get("token");
    const userJson = params.get("user");

    if (token && userJson && auth && !hasLogged.current) {
      hasLogged.current = true;

      const user = JSON.parse(decodeURIComponent(userJson));
      auth.login(token, user);
      router.push("/");
    }
  }, [params, auth, router]);

  return <div>Autenticando com Google...</div>;
}

export default function GoogleAuthPage() {
  return (
    <Suspense fallback={<div>Preparando autenticacao...</div>}>
      <GoogleAuthContent />
    </Suspense>
  );
}
