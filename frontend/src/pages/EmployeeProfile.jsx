import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const EmployeeProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: ''
    });

    const navigate = useNavigate();

    // 1. Fetch Profile Data on Load
    const fetchProfile = async () => {
        try {
            const response = await api.get('users/profile/');
            setProfile(response.data);
            
            // Initialize form data with fetched values
            setFormData({
                first_name: response.data.first_name || '',
                last_name: response.data.last_name || ''
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
            alert("Could not load profile data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // 2. Handle Text Input Changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. Save Text Changes (Fixes the hyphen issue)
    const handleSave = async () => {
        try {
            // Send PATCH request with the form data
            const response = await api.patch('users/profile/', formData);
            
            // IMPORTANT: Merge the RESPONSE data into the profile state.
            // This ensures we show exactly what the server saved.
            setProfile(prev => ({ 
                ...prev, 
                first_name: response.data.first_name, 
                last_name: response.data.last_name 
            }));

            // Update form data just in case
            setFormData({
                first_name: response.data.first_name,
                last_name: response.data.last_name
            });
            
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    // 4. Handle Profile Picture Upload
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        // Key must match 'profile_pic' in your serializer source or 'profile_picture' if mapped
        // Based on your serializer: profile_picture = serializers.ImageField(source='profile_pic'...)
        // So the frontend should send 'profile_picture' or 'profile_pic' depending on how DRF parses it.
        // Usually, ModelSerializer expects the field name defined in fields[].
        uploadData.append('profile_picture', file); 

        try {
            const response = await api.patch('users/profile/', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Force update the profile picture in state
            setProfile(prev => ({ ...prev, profile_picture: response.data.profile_picture }));
            alert("Profile picture updated!");
        } catch (error) {
            console.error("Photo upload failed", error);
            alert("Failed to upload photo.");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
    if (!profile) return <div className="p-10 text-center text-red-500">Profile not found.</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-lg w-full">

                {/* Top Header Background */}
                <div className="h-32 bg-indigo-600 relative">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="absolute top-4 left-4 text-white bg-black/20 hover:bg-black/40 px-3 py-1 rounded-full text-sm font-medium transition"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Profile Picture & Info */}
                <div className="px-8 pb-8">
                    <div className="relative flex justify-center -mt-16 mb-6">
                        <div className="relative h-32 w-32 rounded-full border-4 border-white bg-gray-200 shadow-lg group overflow-hidden">
                            
                            {/* Current Image or Initials */}
                            {profile.profile_picture ? (
                                <img
                                    src={profile.profile_picture}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-500 text-4xl font-bold uppercase">
                                    {profile.username?.charAt(0) || "U"}
                                </div>
                            )}

                            {/* Camera Icon Overlay (Visible on Hover) */}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {/* Hidden File Input */}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleFileChange} 
                                />
                            </label>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">{profile.username}</h1>
                        <p className="text-gray-500">{profile.email}</p>
                    </div>

                    {/* Details Form */}
                    <div className="space-y-4">
                        {/* First Name */}
                        <div className="flex justify-between items-center border-b pb-2 h-10">
                            <span className="text-gray-600 font-medium">First Name</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1 text-gray-800 focus:outline-indigo-500 w-1/2 text-right bg-gray-50"
                                    placeholder="Enter first name"
                                />
                            ) : (
                                <span className="text-gray-800 font-semibold">{profile.first_name || "-"}</span>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="flex justify-between items-center border-b pb-2 h-10">
                            <span className="text-gray-600 font-medium">Last Name</span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1 text-gray-800 focus:outline-indigo-500 w-1/2 text-right bg-gray-50"
                                    placeholder="Enter last name"
                                />
                            ) : (
                                <span className="text-gray-800 font-semibold">{profile.last_name || "-"}</span>
                            )}
                        </div>

                        {/* Read-Only Fields */}
                        <div className="flex justify-between border-b pb-2 h-10 items-center">
                            <span className="text-gray-600 font-medium">Department</span>
                            <span className="text-gray-800 font-semibold">
                                {profile.department_name || "General"}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2 h-10 items-center">
                            <span className="text-gray-600 font-medium">Role</span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
                                {profile.role_name || "Employee"}
                            </span>
                        </div>

                        <div className="flex justify-between border-b pb-2 h-10 items-center">
                            <span className="text-gray-600 font-medium">Manager</span>
                            <span className="text-gray-800 font-semibold">
                                {profile.manager_name || "None"}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 text-center space-x-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 shadow transition font-medium"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset form to original profile data in case of cancel
                                        setFormData({ 
                                            first_name: profile.first_name || '', 
                                            last_name: profile.last_name || '' 
                                        }); 
                                    }}
                                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 shadow transition font-medium"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm border border-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;