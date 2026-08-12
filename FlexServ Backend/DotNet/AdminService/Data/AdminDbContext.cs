using AdminService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using System.Collections.Generic;
using ServiceProvider = AdminService.Models.ServiceProvider;

namespace AdminService.Data
{
    public class AdminDbContext : DbContext
    {
        public AdminDbContext(DbContextOptions<AdminDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<ServiceProvider> ServiceProviders { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            var roleConverter = new ValueConverter<Role, string>(
                v => v.ToString(),
                v => Enum.Parse<Role>(v, true));

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion(roleConverter);

            modelBuilder.Entity<Admin>()
                .Property(a => a.Role)
                .HasConversion(roleConverter);

            modelBuilder.Entity<User>()
                .HasMany(u => u.Addresses)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId);

            modelBuilder.Entity<ServiceProvider>()
                .HasMany(p => p.Services)
                .WithMany()
                .UsingEntity<Dictionary<string, object>>(
                    "provider_services",
                    j => j.HasOne<Service>().WithMany().HasForeignKey("service_id"),
                    j => j.HasOne<ServiceProvider>().WithMany().HasForeignKey("provider_id"),
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
