using Microsoft.EntityFrameworkCore;
using TimeCraft.Data;
using TimeCraft.Repositories;
using TimeCraft.Repositories.Interfaces;
using TimeCraft.Services;
using TimeCraft.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// Repository
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Service
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowFrontend");

// Serve HTML, CSS and JavaScript from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.Run();