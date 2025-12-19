import React from "react";
import { ShoppingCart, Minus, Plus, Trash2, CreditCard, X } from "lucide-react";
import type { CartItem } from "../types";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng</h2>
        <p className="text-sm text-gray-500 mt-1">{items.length} sản phẩm</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="mb-4 flex justify-center">
              <ShoppingCart className="h-14 w-14 text-gray-300" />
            </div>
            <p className="text-lg">Giỏ hàng trống</p>
            <p className="text-sm mt-2">Thêm sản phẩm để bắt đầu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {item.product.name}
                    </h3>
                    <p className="text-black font-medium mt-1">
                      {item.product.price.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                    title="Xóa"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.product.id,
                          Math.max(0, item.quantity - 1)
                        )
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1 text-gray-800 font-medium min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-bold text-gray-800">
                    {(item.product.price * item.quantity).toLocaleString(
                      "vi-VN"
                    )}{" "}
                    ₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-gray-200 p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>VAT (10%):</span>
              <span>{tax.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
              <span>Tổng cộng:</span>
              <span className="text-black">
                {total.toLocaleString("vi-VN")} ₫
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClearCart}
              className="flex-1 bg-gray-800 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Xóa giỏ</span>
            </button>
            <button
              onClick={onCheckout}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4 text-black" />
              <span className="text-black">Thanh toán</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
