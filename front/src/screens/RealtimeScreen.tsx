import React, { useState, useEffect } from "react";
import { Receipt, Clock, DollarSign, RefreshCw, Loader2 } from "lucide-react";
import { apiService } from "../services/api";
import type { Order } from "../types";

const RealtimeScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      const apiOrders = await apiService.getOrders();

      if (!apiOrders || !Array.isArray(apiOrders)) {
        console.warn("API trả về không phải array:", apiOrders);
        setOrders([]);
        return;
      }

      const convertedOrders: Order[] = apiOrders.map((o) => ({
        id: o.id,
        code: `ORD-${o.id}`,
        total: o.totalAmount,
        createdAt: o.createdAt,
        paidAt: new Date(o.createdAt),
        items: o.items.map((item) => ({
          product: {
            id: item.productId,
            name: item.productName,
            price: item.unitPrice,
          },
          quantity: item.quantity,
        })),
      }));

      setOrders(convertedOrders);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể tải danh sách đơn hàng";
      setError(errorMessage);
      console.error("Error loading orders:", err);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const formatTimeAgo = (date: Date | undefined) => {
    if (!date) return "Vừa xong";

    const diff = Date.now() - date.getTime();
    if (diff < 0) return "Vừa xong";

    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds} giây trước`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ngày trước`;

    return formatDateTime(date);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Danh sách đơn hàng
            </h1>
          </div>
          <button
            onClick={loadOrders}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 border border-blue-600"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="text-black">Làm mới</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Đang tải đơn hàng...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p className="text-lg font-medium mb-4">{error}</p>
            <button onClick={loadOrders} className="px-4 py-2  text-black">
              Thử lại
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Receipt className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Chưa có đơn hàng nào</p>
            <p className="text-sm mt-2">
              Các đơn hàng sẽ tự động hiển thị ở đây khi được thanh toán
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-lg text-gray-800">
                      {order.code}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {formatTimeAgo(order.paidAt)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Tổng tiền:</span>
                    <span className="font-bold text-lg text-green-600 ml-auto">
                      {(order.total || 0).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Thời gian:</span>
                    <span className="text-sm text-gray-800 ml-auto">
                      {formatDateTime(order.paidAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealtimeScreen;
