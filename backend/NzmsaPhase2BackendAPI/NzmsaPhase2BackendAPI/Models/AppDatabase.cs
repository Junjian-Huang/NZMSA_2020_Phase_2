using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
