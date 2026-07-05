import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export const useEcho = () => {
    const { getToken, isSignedIn } = useAuth();
    const [echoInstance, setEchoInstance] = useState(null);

    useEffect(() => {
        const initEcho = async () => {
            // Do not attempt connection if the user isn't logged in
            if (!isSignedIn) return;

            // Fetch the secure JWT from Clerk
            const token = await getToken();

            // Build the Echo instance with the token
            const echo = new Echo({
                broadcaster: 'reverb',
                key: import.meta.env.VITE_REVERB_APP_KEY,
                wsHost: import.meta.env.VITE_REVERB_HOST,
                wsPort: import.meta.env.VITE_REVERB_PORT,
                forceTLS: false,
                enabledTransports: ['ws', 'wss'],
                authEndpoint: 'http://localhost:8000/broadcasting/auth',
                auth: {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                },
            });

            // Save the ready-to-use instance to state
            setEchoInstance(echo);
        };

        initEcho();
    }, [getToken, isSignedIn]);

    return echoInstance;
};