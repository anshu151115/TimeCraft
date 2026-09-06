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

        [HttpGet("profile/{id}")]
        public async Task<IActionResult> GetProfile(int id)
        {
            var user = await _authService.GetUserById(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found"
                });
            }

            return Ok(new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role
            });
        }

        [HttpPut("profile/{id}")]
        public async Task<IActionResult> UpdateProfile(
    int id,
    [FromBody] UpdateProfileDto dto)
        {
            var result = await _authService.UpdateProfile(
                id,
                dto.Name,
                dto.Email
            );

            if (result == "User not found")
            {
                return NotFound(new
                {
                    message = result
                });
            }

            if (result == "Email already exists")
            {
                return BadRequest(new
                {
                    message = result
                });
            }

            return Ok(new
            {
                message = result
            });
        }

        [HttpPut("change-password/{id}")]
        public async Task<IActionResult> ChangePassword(
    int id,
    [FromBody] ChangePasswordDto dto)
        {
            var result = await _authService.ChangePassword(
                id,
                dto.CurrentPassword,
                dto.NewPassword
            );

            if (result == "User not found")
            {
                return NotFound(new
                {
                    message = result
                });
            }

            if (result == "Current password is incorrect")
            {
                return BadRequest(new
                {
                    message = result
                });
            }

            return Ok(new
            {
                message = result
            });
        }
    }
}