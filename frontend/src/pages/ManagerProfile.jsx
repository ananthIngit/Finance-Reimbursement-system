import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const ManagerProfile = () => {
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            const response = await api.patch('users/profile/', formData);
            setProfile(prev => ({ 
                ...prev, 
                first_name: response.data.first_name, 
                last_name: response.data.last_name 
            }));
            setIsEditing(false);
            alert("Manager profile updated successfully!");
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update profile.");
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('profile_picture', file); 

        try {
            const response = await api.patch('users/profile/', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile(prev => ({ ...prev, profile_picture: response.data.profile_picture }));
            alert("Manager photo updated!");
        } catch (error) {
            console.error("Photo upload failed", error);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 dark:text-gray-400">Loading Manager Profile...</div>;
    if (!profile) return <div className="p-10 text-center text-red-500 dark:text-red-400">Profile not found.</div>;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 transition-colors duration-300 bg-gray-100 dark:bg-gray-900 relative">
            
            {/* Theme Toggle in corner */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="rounded-2xl shadow-xl overflow-hidden max-w-lg w-full transition-colors duration-300 bg-white dark:bg-gray-800">

                {/* Top Header Background */}
                <div className="h-32 relative bg-indigo-600 dark:bg-indigo-700">
                    <button
                        onClick={() => navigate('/manager-dashboard')} // 👈 REDIRECT TO MANAGER DASHBOARD
                        className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-medium transition
                                   bg-black/20 hover:bg-black/40"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-center -mt-16 mb-6">
                        <div className="relative h-32 w-32 rounded-full border-4 shadow-lg group overflow-hidden
                                        border-white bg-gray-200 dark:border-gray-800 dark:bg-gray-700">
                            
                            {profile.profile_picture ? (
                                <img src={profile.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-4xl font-bold uppercase bg-indigo-100 text-indigo-500 dark:bg-indigo-900/50 dark:text-indigo-300">
                                    {profile.username?.charAt(0) || "M"}
                                </div>
                            )}

                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{profile.username}</h1>
                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">Manager Account</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2 h-10 border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-600 dark:text-gray-400">First Name</span>
                            {isEditing ? (
                                <input
                                    type="text" name="first_name" value={formData.first_name} onChange={handleChange}
                                    className="border rounded px-2 py-1 w-1/2 text-right bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            ) : (
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{profile.first_name || "-"}</span>
                            )}
                        </div>

                        <div className="flex justify-between items-center border-b pb-2 h-10 border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Last Name</span>
                            {isEditing ? (
                                <input
                                    type="text" name="last_name" value={formData.last_name} onChange={handleChange}
                                    className="border rounded px-2 py-1 w-1/2 text-right bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            ) : (
                                <span className="font-semibold text-gray-800 dark:text-gray-200">{profile.last_name || "-"}</span>
                            )}
                        </div>

                        <div className="flex justify-between items-center border-b pb-2 h-10 border-gray-200 dark:border-gray-700">
                            <span className="font-medium text-gray-600 dark:text-gray-400">Department</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">{profile.department_name || "General"}</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center space-x-4">
                        {isEditing ? (
                            <>
                                <button onClick={handleSave} className="px-6 py-2 rounded-lg shadow font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Changes</button>
                                <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg shadow font-medium bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Cancel</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="font-medium text-sm border px-6 py-2 rounded-lg transition text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                                Edit Manager Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerProfile;