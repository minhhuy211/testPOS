using Microsoft.AspNetCore.Mvc;
using PosApi.Services;

namespace PosApi.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IPosService _posService;

    public ProductsController(IPosService posService)
    {
        _posService = posService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Models.Product>> GetProducts()
    {
        try
        {
            var products = _posService.GetProducts();
            return Ok(products);
        }
        catch (Exception)
        {
            return StatusCode(500, "Đã xảy ra lỗi khi lấy danh sách sản phẩm");
        }
    }
}

