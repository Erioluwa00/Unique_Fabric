// import React, { useState } from 'react';
// import './UserEditProfile.css';
// import ProfileSidebar from '../../components/ProfileSidebar';
// const UserEditProfile = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     country: '',
//     bio: ''
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission here
//     console.log('Profile updated:', formData);
//     alert('Profile updated successfully!');
//   };

//   return (
//              <div class="up-container">
//      <ProfileSidebar/>
//     <div className="edit-profile-page">
//       <div className="profile-container">
//         <h1 className="page-title">Edit Profile</h1>
        
//         <form className="profile-form" onSubmit={handleSubmit}>
//           <div className="form-section">
//             <h3 className="section-title">Personal Information</h3>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="fullName">Full Name</label>
//                 <input
//                   type="text"
//                   id="firstName"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   placeholder="Enter your first name"
//                 />
//               </div>
              
//               {/* <div className="form-group">
//                 <label htmlFor="lastName">Last Name</label>
//                 <input
//                   type="text"
//                   id="lastName"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   placeholder="Enter your last name"
//                 />
//               </div> */}
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="email">Email Address</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email address"
//               />
//             </div>
            
//             <div className="form-group">
//               <label htmlFor="phone">Phone Number</label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Enter your phone number"
//               />
//             </div>
//           </div>

//           <div className="form-section">
//             <h3 className="section-title">Address Information</h3>
            
//             <div className="form-group">
//               <label htmlFor="address">Street Address</label>
//               <input
//                 type="text"
//                 id="address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 placeholder="Enter your street address"
//               />
//             </div>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="city">City</label>
//                 <input
//                   type="text"
//                   id="city"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   placeholder="Enter your city"
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label htmlFor="country">Country</label>
//                 <select
//                   id="country"
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select your country</option>
//                   <option value="us">United States</option>
//                   <option value="uk">United Kingdom</option>
//                   <option value="ca">Canada</option>
//                   <option value="au">Australia</option>
//                   <option value="ng">Nigeria</option>
//                   <option value="ke">Kenya</option>
//                   <option value="za">South Africa</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* <div className="form-section">
//             <h3 className="section-title">About Me</h3>
            
//             <div className="form-group">
//               <label htmlFor="bio">Bio</label>
//               <textarea
//                 id="bio"
//                 name="bio"
//                 value={formData.bio}
//                 onChange={handleChange}
//                 placeholder="Tell us a little about yourself..."
//                 rows="4"
//               />
//             </div>
//           </div> */}

//           <div className="form-actions">
//             <button type="button" className="cancel-btn">
//               Cancel
//             </button>
//             <button type="submit" className="save-btn">
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default UserEditProfile;  

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './UserEditProfile.css';
import ProfileSidebar from '../../components/ProfileSidebar';

const UserEditProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Pre-populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear message when user starts typing again
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const token = localStorage.getItem('fabricToken');
      
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Profile updated successfully!');
        setMessageType('success');
        
        // Update both context and localStorage with the new data
        const updatedUser = { ...user, ...formData };
        updateUser(updatedUser); // This updates both context and localStorage
        
        // Success message stays for 3 seconds
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
        
      } else {
        setMessage(data.message || 'Failed to update profile');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setMessage('Network error. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data from context
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || ''
      });
    }
    setMessage('');
    setMessageType('');
  };

  if (!user) {
    return <div className="login-message">Please log in to edit your profile.</div>;
  }

  return (
    <div >
      {/* <ProfileSidebar /> */}
      {/* <div className="edit-profile-page"> */}
        <div className="profile-container">
          <h1 className="page-title">Edit Profile</h1>
          
          {message && (
            <div className={`message ${messageType}`}>
              {message}
              {messageType === 'success' && (
                <div style={{marginTop: '8px', fontSize: '14px', opacity: 0.8}}>
                  Your changes have been saved and will persist when you return!
                </div>
              )}
            </div>
          )}
          
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="section-title">Personal Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Address Information</h3>
              
              <div className="form-group">
                <label htmlFor="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">Select your country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="ng">Nigeria</option>
                    <option value="ke">Kenya</option>
                    <option value="za">South Africa</option>
                    <option value="gh">Ghana</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-btn" 
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    // </div>
  );
};

export default UserEditProfile;