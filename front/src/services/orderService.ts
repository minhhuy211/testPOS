import type { Order, CartItem } from "../types";

const STORAGE_KEY = "pos_orders";
const ORDER_EVENT = "order-updated";

export const saveOrder = (items: CartItem[]): Order => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const now = new Date();

  const order: Order = {
    id: Date.now(),
    code: `ORD-${Date.now().toString().slice(-6)}`,
    total,
    paidAt: now,
    items,
    createdAt: now.toISOString(),
  };

  const orders = getOrders();
  orders.unshift(order); // Thêm vào đầu danh sách
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

  // Dispatch event để RealtimeScreen có thể cập nhật
  window.dispatchEvent(new CustomEvent(ORDER_EVENT, { detail: order }));

  return order;
};

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const orders = JSON.parse(stored);
  // Convert paidAt từ string về Date
  return orders.map((order: Order) => ({
    ...order,
    paidAt: new Date(order.paidAt ?? ""),
  }));
};

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  const updateOrders = () => {
    callback(getOrders());
  };

  // Lắng nghe event khi có đơn hàng mới
  window.addEventListener(ORDER_EVENT, updateOrders);

  // Trả về hàm unsubscribe
  return () => {
    window.removeEventListener(ORDER_EVENT, updateOrders);
  };
};

