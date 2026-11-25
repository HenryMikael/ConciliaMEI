import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

import {
    login as loginApi,
    restoreSession,
    logout as logoutApi,
} from "../api/authApi";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        async function initializeSession() {
            try {
                const session = await restoreSession();

                if (active && session?.user) {
                    setUser(session.user);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        initializeSession().catch((error) => {
            console.error("Session initialization failed:", error);
        });

        function handleSessionExpired() {
            setUser(null);
        }

        window.addEventListener("session-expired", handleSessionExpired);

        return () => {
            active = false;
            window.removeEventListener("session-expired", handleSessionExpired);
        };
    }, []);


    async function login(email, password) {
        const result = await loginApi(email, password);
        setUser(result.user);
        return result.user;
    }

    async function logout() {
        await logoutApi();
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: Boolean(user),
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}