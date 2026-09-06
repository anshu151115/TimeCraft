using Microsoft.EntityFrameworkCore;
using TimeCraft.Data;
using TimeCraft.Models;
using TimeCraft.Repositories.Interfaces;

namespace TimeCraft.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetByEmail(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task AddUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User> GetById(int id)
        {
            return await _context.Users
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<bool> UpdateUser(User user)
        {
            _context.Users.Update(user);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}