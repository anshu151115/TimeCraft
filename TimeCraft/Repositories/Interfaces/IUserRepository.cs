using TimeCraft.Models;

namespace TimeCraft.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByEmail(string email);
        Task AddUser(User user);
    }
}
