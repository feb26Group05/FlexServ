import API from './adminApi';

// --- User Profile APIs ---
export const getUserProfile = async () => {
  const response = await API.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await API.put('/users/profile', userData);
  return response.data;
};

// --- Address APIs ---
export const getUserAddresses = async () => {
  const response = await API.get('/users/addresses');
  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await API.post('/users/addresses', addressData);
  return response.data;
};

export const updateAddress = async (addressId, addressData) => {
  const response = await API.put(`/users/addresses/${addressId}`, addressData);
  return response.data;
};

export const deleteAddress = async (addressId) => {
  const response = await API.delete(`/users/addresses/${addressId}`);
  return response.data;
};