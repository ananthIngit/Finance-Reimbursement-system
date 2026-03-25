import axios from 'axios';

// 1. Create a custom Axios instance
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // The base URL for your Django Backend
    timeout: 5000, // Wait for 5 seconds before failing
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

// 2. The Request Interceptor (The "Outgoing" Gate)
api.interceptors.request.use(
    (config) => {
        // Look for the token in Local Storage
        const token = localStorage.getItem('access_token');
        
        // If it exists, attach it to the header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. The Response Interceptor (The "Incoming" Gate)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the backend says "401 Unauthorized" (Token expired or invalid) and we haven't retried yet
        if (error.response && error.response.status === 401 && !originalRequest._retry && originalRequest.url !== 'auth/login/') {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    // Try to get a new token from the backend
                    const response = await axios.post('http://127.0.0.1:8000/api/auth/refresh/', { 
                        refresh: refreshToken 
                    });
                    
                    const newAccessToken = response.data.access;
                    localStorage.setItem('access_token', newAccessToken);
                    
                    if (response.data.refresh) {
                        localStorage.setItem('refresh_token', response.data.refresh);
                    }
                    
                    // Update the failed request with the new token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    
                    // Retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token Refresh Failed. Logging out...");
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        // If it's a 401 and we already retried, or no refresh token exists
        if (error.response && error.response.status === 401) {
            console.error("Token Expired or Invalid. Logging out...");
            
            // Clear storage
            localStorage.clear();
            
            // Redirect to Login Page
            window.location.href = '/'; 
        }
        
        return Promise.reject(error);
    }
);

export default api;