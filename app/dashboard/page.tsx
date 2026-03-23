// app/dashboard/page.tsx
"use client";

import { PrivateRoute } from "@/components/routes/PrivateRoute";

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-black">Bem-vindo ao painel!</h1>
      </div>
    </PrivateRoute>
  );
}
