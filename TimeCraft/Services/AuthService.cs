using TimeCraft.DTOs;
using TimeCraft.Models;
using TimeCraft.Repositories.Interfaces;
using TimeCraft.Services.Interfaces;

namespace TimeCraft.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<string> Signup(SignupDto dto)
        {
            var existingUser = await _userRepository.GetByEmail(dto.Email);

            if (existingUser != null)
            {
                return "Email already exists";
            }

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "User",
                CreatedAt = DateTime.Now
            };

            await _userRepository.AddUser(user);

            return "Signup successful";
        }

        public async Task<(bool Success, string Role, string Message)> Login(LoginDto dto)
        {
            var user = await _userRepository.GetByEmail(dto.Email);

            if (user == null)
            {
                return (false, "", "Invalid email or password");
            }

            bool passwordValid = BCrypt.Net.BCrypt.Verify(
                dto.Password,
                user.PasswordHash
            );

            if (!passwordValid)
            {
                return (false, "", "Invalid email or password");
            }

            return (true, user.Role, "Login successful");
        }
    }
}