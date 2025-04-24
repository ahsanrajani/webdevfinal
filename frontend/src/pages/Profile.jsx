import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        
        const userData = {
            username: localStorage.getItem('username'), 
            email: localStorage.getItem('email'), 
        };
        setUser(userData);
    }, []);

    const handlePasswordReset = () => {
        
        navigate('/login', { state: { forgotPassword: true } });
    };

    if (!user) {
        return <div>Loading...</div>; 
    }

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-semibold">Profile</h2>
            <div className="mt-6">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                
            </div>
        </div>
    );
};

export default Profile;
