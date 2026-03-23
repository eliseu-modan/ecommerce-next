"use client";

import { useEffect, useState } from "react";
import Example from "../../Overviews/index";
import { api } from "@/lib/api";

export default function ProductList() {
  type Product = {
    id: string | number;
    name: string;
    description: string;
    price: string;
    stock: number;
    categoryId?: string;
    createdAt?: string;
    images: { url: string }[];
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const getAllProducts = async () => {
    try {
      const response = await api.get("/product/getAll");
      console.log(response.data); // 👈 veja o array de produtos no console
      setProducts(response.data); // 👈 agora está correto
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  if (selectedProduct) {
    return <Example {...({ product: selectedProduct } as any)} />;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Produtos disponíveis
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => {
            // 👇 pega a primeira imagem ou define uma padrão
            const imageUrl =
              product.images?.[0]?.url || "/placeholder.png";

            return (
              <div
                key={product.id}
                className="group relative cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  alt={product.name}
                  src={imageUrl}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">{product.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.description}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    R$ {product.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
