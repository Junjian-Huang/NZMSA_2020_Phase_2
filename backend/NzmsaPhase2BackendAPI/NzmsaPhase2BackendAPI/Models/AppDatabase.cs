using Microsoft.EntityFrameworkCore;

namespace NzmsaPhase2BackendAPI.Models
{
    public class AppDatabase : DbContext
    {
        public AppDatabase(DbContextOptions<AppDatabase> options) : base(options)
        {

        }

        public DbSet<Canvas> Canvas { get; set; }

        public DbSet<ColorData> ColorData { get; set; }

    }
}
