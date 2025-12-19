import React, { useState, useEffect } from "react";
import { Package, Loader2 } from "lucide-react";
import type { Product } from "../types";
import { apiService } from "../services/api";

interface ProductListProps {
  onAddToCart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiProducts = await apiService.getProducts();
        const convertedProducts: Product[] = apiProducts.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          category: p.category,
        }));
        setProducts(convertedProducts);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải danh sách sản phẩm"
        );
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  if (loading) {
    return (
      <div className="h-full overflow-y-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Danh sách sản phẩm
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
            onClick={() => onAddToCart(product)}
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                {product.name}
              </h3>
              {product.category && (
                <p className="text-xs text-gray-500 mb-2">{product.category}</p>
              )}
              <p className="text-lg font-bold text-black-600">
                {product.price.toLocaleString("vi-VN")} ₫
              </p>
              <button
                className="mt-3 w-full hover:bg-neutral-800 text-black font-medium py-2 px-4 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>
      {products.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Không có sản phẩm nào</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
