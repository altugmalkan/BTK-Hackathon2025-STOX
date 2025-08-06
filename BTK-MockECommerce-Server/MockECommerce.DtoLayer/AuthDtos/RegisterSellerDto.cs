using System.ComponentModel.DataAnnotations;

namespace MockECommerce.DtoLayer.AuthDtos;

public class RegisterSellerDto
{
    [Required]
    public string FirstName { get; set; } = default!;

    [Required]
    public string LastName { get; set; } = default!;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = default!;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = default!;

    [Required]
    public string StoreName { get; set; } = default!;

    public string? LogoUrl { get; set; }

    public string Role { get; set; } = "Seller";
}
