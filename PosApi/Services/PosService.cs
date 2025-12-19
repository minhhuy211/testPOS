using PosApi.Models;

namespace PosApi.Services;

public class PosService : IPosService
{
    private readonly List<Product> _products;
    private readonly List<Order> _orders;
    private int _nextOrderId = 1;

    public PosService()
    {
        _products = new List<Product>();
        _orders = new List<Order>();
        SeedProducts();
    }

    private void SeedProducts()
    {
        _products.AddRange(new List<Product>
        {
            new Product { Id = 1, Name = "Cà phê đen", Category = "Đồ uống", Price = 15000, Image = "https://via.placeholder.com/200x200?text=Ca+phe+den" },
            new Product { Id = 2, Name = "Cà phê sữa", Category = "Đồ uống", Price = 20000, Image = "https://via.placeholder.com/200x200?text=Ca+phe+sua" },
            new Product { Id = 3, Name = "Trà đá", Category = "Đồ uống", Price = 10000, Image = "https://via.placeholder.com/200x200?text=Tra+da" },
            new Product { Id = 4, Name = "Bánh mì thịt nướng", Category = "Đồ ăn", Price = 35000, Image = "https://via.placeholder.com/200x200?text=Banh+mi+thit" },
            new Product { Id = 5, Name = "Bánh mì pate", Category = "Đồ ăn", Price = 25000, Image = "https://via.placeholder.com/200x200?text=Banh+mi+pate" },
            new Product { Id = 6, Name = "Bánh ngọt", Category = "Đồ ăn", Price = 30000, Image = "https://via.placeholder.com/200x200?text=Banh+ngot" },
            new Product { Id = 7, Name = "Nước ngọt", Category = "Đồ uống", Price = 20000, Image = "https://via.placeholder.com/200x200?text=Nuoc+ngot" },
            new Product { Id = 8, Name = "Nước ép cam", Category = "Đồ uống", Price = 25000, Image = "https://via.placeholder.com/200x200?text=Nuoc+ep+cam" },
            new Product { Id = 9, Name = "Sinh tố", Category = "Đồ uống", Price = 30000, Image = "https://via.placeholder.com/200x200?text=Sinh+to" },
            new Product { Id = 10, Name = "Bánh quy", Category = "Đồ ăn", Price = 15000, Image = "https://via.placeholder.com/200x200?text=Banh+quy" }
        });
    }

    public List<Product> GetProducts()
    {
        return _products.ToList();
    }

    public Product? GetProductById(int id)
    {
        return _products.FirstOrDefault(p => p.Id == id);
    }

    public List<Order> GetOrders()
    {
        var orders = _orders.OrderByDescending(o => o.CreatedAt).ToList();
        
        Console.WriteLine($"[PosService] GetOrders - Total orders: {orders.Count}");
        foreach (var order in orders)
        {
            Console.WriteLine($"[PosService] Order {order.Id} - CreatedAt: {order.CreatedAt:yyyy-MM-dd HH:mm:ss.fff} UTC");
        }
        
        return orders;
    }

    public Order? GetOrderById(int id)
    {
        return _orders.FirstOrDefault(o => o.Id == id);
    }

    public Order CreateOrder(CreateOrderRequest request)
    {
        if (request.Items == null || !request.Items.Any())
        {
            throw new ArgumentException("Đơn hàng phải có ít nhất một sản phẩm");
        }

        var orderItems = new List<OrderItem>();
        decimal totalAmount = 0;

        foreach (var itemRequest in request.Items)
        {
            var product = GetProductById(itemRequest.ProductId);
            if (product == null)
            {
                throw new ArgumentException($"Sản phẩm với ID {itemRequest.ProductId} không tồn tại");
            }

            if (itemRequest.Quantity <= 0)
            {
                throw new ArgumentException($"Số lượng sản phẩm phải lớn hơn 0");
            }

            var orderItem = new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                Quantity = itemRequest.Quantity,
                UnitPrice = product.Price
            };

            orderItems.Add(orderItem);
            totalAmount += orderItem.SubTotal;
        }

        decimal tax = totalAmount * 0.1m;
        decimal totalWithTax = totalAmount + tax;
        var createdAt = DateTime.UtcNow;
        var orderId = _nextOrderId++;
        
        var order = new Order
        {
            Id = orderId,
            CreatedAt = createdAt,
            TotalAmount = totalWithTax,
            Items = orderItems
        };

        _orders.Add(order);
        
        Console.WriteLine($"[PosService] Created Order {orderId} at {createdAt:yyyy-MM-dd HH:mm:ss.fff} UTC");
        
        return order;
    }
}

