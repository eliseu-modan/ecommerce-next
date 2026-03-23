// app/layout.tsx
import "./globals.css";
import Header from "@/components/Layout/Header/Header";
import Footer from "@/components/Layout/Footer/Footer";
import ProductList from "@/components/Products/ProductList/productList";
import { AuthProvider } from "@/contexts/AuthProvider"; // ✅ importa o contexto

export const metadata = {
  title: "Ecommerce",
  description: "Store built with Next.js + Tailwind",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-white text-gray-900">
        {/* ✅ Agora tudo fica dentro do AuthProvider */}
        <AuthProvider>
          <div className="relative overflow-hidden">
            <Header />
            <ProductList />
            {/* <HeroSection /> */}
          </div>

          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
