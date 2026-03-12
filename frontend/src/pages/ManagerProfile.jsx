import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import ProfileCard from '../components/ProfileCard';

const ManagerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ first_name: '', last_name: '' });

  const fetchProfile = async () => {
    try {
      const response = await api.get('users/profile/');
      setProfile(response.data);
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
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
      const response = await api.patch('users/profile/', formData);
      setProfile((prev) => ({
        ...prev,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
      }));
      setIsEditing(false);
      alert('Manager profile updated successfully!');
    } catch (error) {
      console.error('Update failed', error);
      alert('Failed to update profile.');
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
        setFormData({ first_name: profile.first_name || '', last_name: profile.last_name || '' });
      }}
      onSave={handleSave}
      onChange={handleChange}
      onFileChange={handleFileChange}
      accentColor="indigo"
      roleLabel="Manager Account"
    />
  );
};

export default ManagerProfile;
