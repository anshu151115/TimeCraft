using Microsoft.AspNetCore.Mvc;
using TimeCraft.DTOs;
using TimeCraft.Services.Interfaces;

namespace TimeCraft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup(SignupDto dto)
        {
            var result = await _authService.Signup(dto);

            if (result == "Email already exists")
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _authService.Login(dto);

            if (!result.Success)
            {
                return Unauthorized(new
                {
                    message = "Email or password is incorrect"
                });
            }

            return Ok(new
            {
                message = result.Message,
                userId = result.UserId,
                role = result.Role
            });
        }
    }
}