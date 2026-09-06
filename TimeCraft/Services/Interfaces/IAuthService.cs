using TimeCraft.DTOs;
using TimeCraft.Models;

namespace TimeCraft.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> Signup(SignupDto dto);
        Task<(bool Success, int UserId, string Role, string Message)> Login(LoginDto dto);

        Task<User> GetUserById(int id);

        Task<string> UpdateProfile(
            int userId,
            string name,
            string email);

        Task<string> ChangePassword(
            int userId,
            string currentPassword,
            string newPassword);
    }
}
