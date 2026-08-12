using AdminService.Dtos;
using System.Collections.Generic;

namespace AdminService.Services
{
    public interface IUserService
    {
        UserResponse GetUserProfile(long userId);
        UserResponse UpdateUserProfile(long userId, UpdateUserRequest request);
        void DeleteUserAccount(long userId);

        AddressResponse AddAddress(long userId, AddressRequest request);
        List<AddressResponse> GetUserAddresses(long userId);
        AddressResponse UpdateAddress(long userId, long addressId, AddressRequest request);
        void DeleteAddress(long userId, long addressId);
    }
}
