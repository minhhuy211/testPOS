using Microsoft.AspNetCore.Mvc;
using PosApi.Models;
using PosApi.Services;

namespace PosApi.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IPosService _posService;

    public OrdersController(IPosService posService)
    {
        _posService = posService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Order>> GetOrders()
    {
        try
        {
            var orders = _posService.GetOrders();
            return Ok(orders);
        }
        catch (Exception)
        {
            return StatusCode(500, "Đã xảy ra lỗi khi lấy danh sách đơn hàng");
        }
    }

    [HttpGet("{id}")]
    public ActionResult<Order> GetOrder(int id)
    {
        try
        {
            var order = _posService.GetOrderById(id);
            if (order == null)
            {
                return NotFound($"Không tìm thấy đơn hàng với ID {id}");
            }
            return Ok(order);
        }
        catch (Exception)
        {
            return StatusCode(500, "Đã xảy ra lỗi khi lấy thông tin đơn hàng");
        }
    }

    [HttpPost]
    public ActionResult<Order> CreateOrder([FromBody] CreateOrderRequest request)
    {
        try
        {
            if (request == null)
            {
                return BadRequest("Dữ liệu đơn hàng không hợp lệ");
            }

            var order = _posService.CreateOrder(request);
            return Ok(order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "Đã xảy ra lỗi khi tạo đơn hàng");
        }
    }
}

