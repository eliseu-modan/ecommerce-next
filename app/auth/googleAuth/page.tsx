"use client";

import { useEffect, useContext, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/contexts/AuthProvider";

export default function GoogleAuthPage() {
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
