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

        public async Task<(bool Success, int UserId, string Role, string Message)> Login(LoginDto dto)
        {
            var user = await _userRepository.GetByEmail(dto.Email);

            if (user == null)
            {
                return (false, 0,"", "Invalid email or password");
            }

            bool passwordValid = BCrypt.Net.BCrypt.Verify(
                dto.Password,
                user.PasswordHash
            );

            if (!passwordValid)
            {
                return (false,0, "", "Invalid email or password");
            }

            return (true, user.Id, user.Role, "Login successful");
        }


        public async Task<User> GetUserById(int id)
        {
            return await _userRepository.GetById(id);
        }

        public async Task<string> UpdateProfile(
            int userId,
            string name,
            string email)
        {
            var user = await _userRepository.GetById(userId);

            if (user == null)
            {
                return "User not found";
            }

            var existingUser =
                await _userRepository.GetByEmail(email);

            if (existingUser != null &&
                existingUser.Id != userId)
            {
                return "Email already exists";
            }

            user.Name = name;
            user.Email = email;

            await _userRepository.UpdateUser(user);

            return "Profile updated successfully";
        }

        public async Task<string> ChangePassword(
            int userId,
            string currentPassword,
            string newPassword)
        {
            var user = await _userRepository.GetById(userId);

            if (user == null)
            {
                return "User not found";
            }

            bool passwordValid =
                BCrypt.Net.BCrypt.Verify(
                    currentPassword,
                    user.PasswordHash);

            if (!passwordValid)
            {
                return "Current password is incorrect";
            }

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(newPassword);

            await _userRepository.UpdateUser(user);

            return "Password changed successfully";
        }
    }
}