import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../store/store';
import axiosInstance from './axios';

function SessionManager({ children }) {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.user);
    const [isSessionValidated, setIsSessionValidated] = useState(false);

    useEffect(() => {
        if (token && user && !isSessionValidated) {
            // Avoid sending the session check request if the session has already been validated
            setIsSessionValidated(true);

            // If token and user are present, validate the session
            axiosInstance
                .get('/auth/session')
                .then((response) => {
                    const { user, accessToken } = response.data;
                    dispatch(login({ user, token: accessToken, userId: user.userId }));
                })
                .catch(async (error) => {
                    if (error.response?.status === 401) {
                        try {
                            const refreshResponse = await axiosInstance.get('/auth/refresh');
                            const newAccessToken = refreshResponse.data.accessToken;
                            dispatch(login({ user, token: newAccessToken, userId: user.userId }));
                        } catch (refreshError) {
                            dispatch(logout());
                            localStorage.clear();
                        }
                    }
                });
        } else {
            console.info('No token found or session already validated. Skipping session restoration.');
        }
    }, [dispatch, token, user, isSessionValidated]); // Add `isSessionValidated` as a dependency to control effect running

    return children;
}

export default SessionManager;
