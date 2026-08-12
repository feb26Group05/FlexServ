using AdminService.Data;
using AdminService.Dtos;
using AdminService.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AdminService.Services
{
    public class UserServiceImpl : IUserService
    {
        private readonly AdminDbContext _dbContext;

        public UserServiceImpl(AdminDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public UserResponse GetUserProfile(long userId)
        {
            var user = FindUserById(userId);
            return MapToUserResponse(user);
        }

        public UserResponse UpdateUserProfile(long userId, UpdateUserRequest request)
        {
            var user = FindUserById(userId);

            if (user.Phone != request.Phone && _dbContext.Users.Any(u => u.Phone == request.Phone))
            {
                throw new InvalidOperationException("Phone number already in use by another account");
            }

            user.Name = request.Name;
            user.Phone = request.Phone;
            user.UpdatedAt = DateTime.UtcNow;

            _dbContext.SaveChanges();
            return MapToUserResponse(user);
        }

        public void DeleteUserAccount(long userId)
        {
            var user = FindUserById(userId);
            _dbContext.Users.Remove(user);
            _dbContext.SaveChanges();
        }

        public AddressResponse AddAddress(long userId, AddressRequest request)
        {
            var user = FindUserById(userId);

            var address = new Address
            {
                UserId = user.Id,
                HouseNo = request.HouseNo,
                Street = request.Street,
                Area = request.Area,
                City = request.City,
                State = request.State,
                Pincode = request.Pincode
            };

            _dbContext.Addresses.Add(address);
            _dbContext.SaveChanges();

            return MapToAddressResponse(address);
        }

        public List<AddressResponse> GetUserAddresses(long userId)
        {
            FindUserById(userId);
            var addresses = _dbContext.Addresses.Where(a => a.UserId == userId).ToList();
            return addresses.Select(a => MapToAddressResponse(a)).ToList();
        }

        public AddressResponse UpdateAddress(long userId, long addressId, AddressRequest request)
        {
            var address = _dbContext.Addresses.FirstOrDefault(a => a.Id == addressId && a.UserId == userId)
                ?? throw new KeyNotFoundException("Address not found or doesn't belong to this user");

            address.HouseNo = request.HouseNo;
            address.Street = request.Street;
            address.Area = request.Area;
            address.City = request.City;
            address.State = request.State;
            address.Pincode = request.Pincode;

            _dbContext.SaveChanges();
            return MapToAddressResponse(address);
        }

        public void DeleteAddress(long userId, long addressId)
        {
            FindUserById(userId);
            var address = _dbContext.Addresses.FirstOrDefault(a => a.Id == addressId && a.UserId == userId)
                ?? throw new KeyNotFoundException("Address not found or doesn't belong to user");

            _dbContext.Addresses.Remove(address);
            _dbContext.SaveChanges();
        }

        private User FindUserById(long userId)
        {
            return _dbContext.Users.FirstOrDefault(u => u.Id == userId)
                ?? throw new KeyNotFoundException($"User not found with id: {userId}");
        }

        private static UserResponse MapToUserResponse(User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role,
                Active = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        private static AddressResponse MapToAddressResponse(Address address)
        {
            return new AddressResponse(
                address.Id,
                address.HouseNo,
                address.Street,
                address.Area,
                address.City,
                address.State,
                address.Pincode
            );
        }
    }
}
