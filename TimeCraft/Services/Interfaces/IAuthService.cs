using TimeCraft.DTOs;

namespace TimeCraft.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> Signup(SignupDto dto);
        Task<(bool Success, int UserId, string Role, string Message)> Login(LoginDto dto);
    }
}
