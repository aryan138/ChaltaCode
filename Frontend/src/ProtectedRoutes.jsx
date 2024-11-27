import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader'; // Import the loader

const ProtectedRoute = ({ requiredRole }) => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/getRole', {
                    withCredentials: true, // Include cookies
                });
                setUserRole(response.data.role);
                console.log("data:",response.data.role);
                console.log("required role:",requiredRole);
                // console.log("user role",requiredRole); // Extract role from the response
            } catch (error) {
                console.error('Error fetching role:', error);
                setUserRole(null);
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ClipLoader color="#4A90E2" size={60} />
            </div>
        ); // Centered loader with custom color and size
    }

    if (!userRole || userRole !== requiredRole) {
        return <Navigate to="/auth/sign-in" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
