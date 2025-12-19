using PosApi.Models;

namespace PosApi.Services;

public interface IPosService
{
    List<Product> GetProducts();
    Product? GetProductById(int id);
    List<Order> GetOrders();
    Order? GetOrderById(int id);
    Order CreateOrder(CreateOrderRequest request);
}

