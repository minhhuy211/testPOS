import React, { useState } from "react";
import ProductList from "../components/ProductList";
import Cart from "../components/Cart";
import { apiService } from "../services/api";
import type { Product, CartItem } from "../types";

const PosScreen: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    );
  };

  const handleClearCart = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?")) {
      setCartItems([]);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    try {
      const orderRequest = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await apiService.createOrder(orderRequest);
      alert(
        `Thanh toán thành công!\nMã đơn: ORD-${
          order.id
        }\nTổng tiền: ${order.totalAmount.toLocaleString(
          "vi-VN"
        )} ₫\nCảm ơn quý khách!`
      );

      setCartItems([]);
    } catch (error) {
      console.error("Error creating order:", error);
      alert(
        `Lỗi khi tạo đơn hàng: ${
          error instanceof Error ? error.message : "Đã xảy ra lỗi"
        }`
      );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Hệ thống POS</h1>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-gray-50">
          <ProductList onAddToCart={handleAddToCart} />
        </div>

        <div className="w-96 flex-shrink-0">
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
};

export default PosScreen;
