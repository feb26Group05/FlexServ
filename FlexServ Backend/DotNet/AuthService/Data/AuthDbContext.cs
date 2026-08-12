using AuthService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;

namespace AuthService.Data
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ServiceEntity> Services { get; set; }
        public DbSet<ServiceProviderCompany> ServiceProviderCompanies { get; set; }
        public DbSet<Review> Reviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var roleConverter = new ValueConverter<Role, string>(
                v => v.ToString(),
                v => Enum.Parse<Role>(v, true));

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion(roleConverter);

            modelBuilder.Entity<ServiceProviderCompany>()
                .HasMany(p => p.Services)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "provider_services",
                    j => j.HasOne<ServiceEntity>().WithMany().HasForeignKey("service_id"),
                    j => j.HasOne<ServiceProviderCompany>().WithMany().HasForeignKey("provider_id"),
                    j =>
                    {
                        j.HasKey("id");
                        j.Property<long>("id").ValueGeneratedOnAdd().HasColumnName("id");
                        j.IndexerProperty<long>("provider_id").HasColumnName("provider_id");
                        j.IndexerProperty<long>("service_id").HasColumnName("service_id");
                    });
        }
    }
}
