namespace PosApi.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; }
    public decimal Price { get; set; }
    public string? Image { get; set; }
}

