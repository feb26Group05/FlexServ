import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar.jsx';
import { 
  getUserProfile, 
  updateUserProfile, 
  getUserAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress 
} from '../../api/userService.js';
import './UserProfile.css';


const UserProfile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', role: '' });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

  // Address Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    houseNo: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profileRes = await getUserProfile();
      if (profileRes.success) {
        setProfile(profileRes.data);
        setProfileForm({ name: profileRes.data.name, phone: profileRes.data.phone });
      }

      const addressRes = await getUserAddresses();
      if (addressRes.success) {
        setAddresses(addressRes.data);
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUserProfile(profileForm);
      if (res.success) {
        setProfile(res.data);
        setIsEditingProfile(false);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const openAddressModal = (addr = null) => {
    if (addr) {
      setSelectedAddressId(addr.id);
      setAddressForm({
        houseNo: addr.houseNo || '',
        street: addr.street || '',
        area: addr.area || '',
        city: addr.city || '',
        state: addr.state || '',
        pincode: addr.pincode || ''
      });
    } else {
      setSelectedAddressId(null);
      setAddressForm({ houseNo: '', street: '', area: '', city: '', state: '', pincode: '' });
    }
    setIsModalOpen(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAddressId) {
        await updateAddress(selectedAddressId, addressForm);
      } else {
        await addAddress(addressForm);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert('Failed to save address details');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to remove this address?')) {
      try {
        await deleteAddress(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete address');
      }
    }
  };

  return (
    <div className="user-profile-container">
      {/* Global Navbar */}
      <Navbar />

      <div className="profile-wrapper">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', fontSize: '18px' }}>
            Loading profile details...
          </div>
        ) : (
          <>
            {/* User Details Glass Card */}
            <div className="profile-glass-card">
              <div className="profile-card-header">
                <div className="profile-user-info">
                  <div className="profile-avatar-box">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="profile-title-text">
                    <h3>{profile.name}</h3>
                    <p>{profile.email}</p>
                  </div>
                </div>
                <button 
                  className="home-btn-orange" 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {!isEditingProfile ? (
                <div className="profile-rows-container">
                  <div className="profile-data-row">
                    <label>Account Role</label>
                    <span>{profile.role}</span>
                  </div>
                  <div className="profile-data-row">
                    <label>Full Name</label>
                    <span>{profile.name}</span>
                  </div>
                  <div className="profile-data-row">
                    <label>Email Address</label>
                    <span>{profile.email}</span>
                  </div>
                  <div className="profile-data-row">
                    <label>Phone Number</label>
                    <span>{profile.phone}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="home-form-stack">
                  <div className="home-input-group">
                    <label>Full Name</label>
                    <input 
                      className="home-input-field" 
                      value={profileForm.name} 
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="home-input-group">
                    <label>Phone Number</label>
                    <input 
                      className="home-input-field" 
                      value={profileForm.phone} 
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} 
                      required 
                    />
                  </div>
                  <button type="submit" className="home-btn-orange" style={{ marginTop: '10px' }}>
                    Save Changes
                  </button>
                </form>
              )}
            </div>

            {/* Saved Addresses Glass Card */}
            <div className="profile-glass-card">
              <div className="profile-card-header">
                <h3 style={{ margin: 0, fontSize: '20px' }}>Saved Addresses</h3>
                <button className="home-btn-orange" onClick={() => openAddressModal()}>
                  + Add Address
                </button>
              </div>

              <div className="profile-table-wrapper">
                <table className="profile-custom-table">
                  <thead>
                    <tr>
                      <th>House / Street</th>
                      <th>Area</th>
                      <th>City & State</th>
                      <th>Pincode</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addresses.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: '#c5c5c5', padding: '30px' }}>
                          No saved addresses found. Click "+ Add Address" to create one.
                        </td>
                      </tr>
                    ) : (
                      addresses.map((addr) => (
                        <tr key={addr.id}>
                          <td>{addr.houseNo ? `${addr.houseNo}, ` : ''}{addr.street}</td>
                          <td>{addr.area}</td>
                          <td>{addr.city}, {addr.state}</td>
                          <td>{addr.pincode}</td>
                          <td>
                            <button className="home-btn-secondary" onClick={() => openAddressModal(addr)}>
                              Edit
                            </button>
                            <button 
                              className="home-btn-danger" 
                              onClick={() => handleDeleteAddress(addr.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Address Form Modal */}
      {isModalOpen && (
        <div className="home-modal-overlay">
          <div className="home-modal-box">
            <div className="home-modal-header">
              <h3>{selectedAddressId ? 'Edit Address' : 'Add New Address'}</h3>
              <button className="home-modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddressSubmit} className="home-form-stack">
              <div className="home-input-group">
                <label>House / Flat No.</label>
                <input 
                  className="home-input-field" 
                  value={addressForm.houseNo} 
                  onChange={(e) => setAddressForm({ ...addressForm, houseNo: e.target.value })} 
                  placeholder="e.g. Flat 402, Alpine Towers"
                />
              </div>

              <div className="home-input-group">
                <label>Street</label>
                <input 
                  className="home-input-field" 
                  value={addressForm.street} 
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} 
                  placeholder="e.g. FC Road"
                />
              </div>

              <div className="home-input-group">
                <label>Area</label>
                <input 
                  className="home-input-field" 
                  value={addressForm.area} 
                  onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })} 
                  placeholder="e.g. Shivajinagar"
                  required 
                />
              </div>

              <div className="home-form-grid-2">
                <div className="home-input-group">
                  <label>City</label>
                  <input 
                    className="home-input-field" 
                    value={addressForm.city} 
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} 
                    placeholder="e.g. Pune"
                    required 
                  />
                </div>
                <div className="home-input-group">
                  <label>State</label>
                  <input 
                    className="home-input-field" 
                    value={addressForm.state} 
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} 
                    placeholder="e.g. Maharashtra"
                    required 
                  />
                </div>
              </div>

              <div className="home-input-group">
                <label>Pincode</label>
                <input 
                  className="home-input-field" 
                  value={addressForm.pincode} 
                  onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} 
                  placeholder="e.g. 411005"
                  required 
                />
              </div>

              <button type="submit" className="home-btn-orange" style={{ marginTop: '10px' }}>
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;