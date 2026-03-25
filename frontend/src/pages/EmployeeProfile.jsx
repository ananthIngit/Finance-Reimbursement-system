import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import ProfileCard from '../components/ProfileCard';

const EmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // 🏦 UPDATED: Added Bank Details to formData
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    account_number: '',
    bank_name: '',
    ifsc_code: ''
  });

  const fetchProfile = async () => {
    try {
      const response = await api.get('users/profile/');
      setProfile(response.data);
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        // 🏦 Syncing bank details from backend
        account_number: response.data.account_number || '',
        bank_name: response.data.bank_name || '',
        ifsc_code: response.data.ifsc_code || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile', error);
      alert('Could not load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // 🏦 Sending all data including bank details to backend
      const response = await api.patch('users/profile/', formData);
      setProfile(response.data);
      setFormData({
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        account_number: response.data.account_number,
        bank_name: response.data.bank_name,
        ifsc_code: response.data.ifsc_code
      });
      setIsEditing(false);
      alert('Profile and Bank Details updated successfully!');
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update profile. Ensure all fields are valid.');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('profile_picture', file);
    try {
      const response = await api.patch('users/profile/', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfile((prev) => ({ ...prev, profile_picture: response.data.profile_picture }));
      alert('Profile picture updated!');
    } catch (error) {
      console.error('Photo upload failed', error);
      alert('Failed to upload photo.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400" />
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <p className="text-red-500 dark:text-red-400">Profile not found.</p>
    </div>
  );

  return (
    <ProfileCard
      profile={profile}
      formData={formData}
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onCancel={() => {
        setIsEditing(false);
        setFormData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          account_number: profile.account_number || '',
          bank_name: profile.bank_name || '',
          ifsc_code: profile.ifsc_code || ''
        });
      }}
      onSave={handleSave}
      onChange={handleChange}
      onFileChange={handleFileChange}
      accentColor="indigo"
      roleLabel="Employee Account"
    />
  );
};

export default EmployeeProfile;